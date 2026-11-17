import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";

import type { EmailAttachment } from "@/lib/server/email";
import { MAX_FILE_BYTES } from "@/lib/validation/common";

/**
 * Private file uploads (CVs, licences, incident photos) on Cloudinary.
 *
 * 1. The browser asks `prepareUploads` for permission. The server checks
 *    the spam protection and the file details, then signs one upload slot
 *    per file and returns a "ticket" listing those slots.
 * 2. The browser uploads each file straight to Cloudinary as a private
 *    ("authenticated") file. Our server never handles the file itself,
 *    which avoids the hosting platform's request-size limit.
 * 3. The form is submitted with the ticket. The server checks the ticket,
 *    confirms each file on Cloudinary (it exists, size is within limits),
 *    and attaches it to the company email (Resend downloads it through a
 *    signed, expiring private link).
 */

export type UploadField = "cv" | "licence" | "photos";

export type UploadSlot = {
  field: UploadField;
  uploadUrl: string;
  params: Record<string, string>;
};

/** What the browser reports after uploading a file. */
export type UploadedFile = {
  field: UploadField;
  publicId: string;
  resourceType: string;
  name: string;
};

const isDev = process.env.NODE_ENV !== "production";
const TICKET_LIFETIME_MS = 60 * 60 * 1000; // 1 hour to finish the form
const DOWNLOAD_LINK_SECONDS = 24 * 60 * 60; // for Resend to fetch attachments

function cloudinaryEnv() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  const folder = (process.env.CLOUDINARY_FOLDER || "uvm/dev").replace(
    /^\/+|\/+$/g,
    "",
  );
  return { cloudName, apiKey, apiSecret, folder };
}

export const uploadsEnabled = () => cloudinaryEnv() !== null;

/**
 * Secret used to sign tickets: FORM_SIGNING_SECRET if set (the automated
 * tests use it), otherwise any other server secret that is configured.
 */
function ticketSecret(): string | null {
  return (
    process.env.FORM_SIGNING_SECRET ||
    process.env.CLOUDINARY_API_SECRET ||
    process.env.TURNSTILE_SECRET_KEY ||
    process.env.RESEND_API_KEY ||
    (isDev ? "local-development-only" : null)
  );
}

type TicketData = {
  form: string;
  /** Allowed public IDs, by field. */
  ids: { field: UploadField; publicId: string }[];
  exp: number;
};

const b64 = (s: string) => Buffer.from(s).toString("base64url");
const sign = (payload: string, secret: string) =>
  createHmac("sha256", secret).update(payload).digest("base64url");

export function createTicket(
  form: string,
  fields: UploadField[],
):
  | { ok: true; ticket: string; slots: UploadSlot[] }
  | { ok: false; reason: "no-secret" | "no-storage" } {
  const secret = ticketSecret();
  if (!secret) return { ok: false, reason: "no-secret" };

  const env = cloudinaryEnv();
  if (fields.length > 0 && !env && !isDev)
    return { ok: false, reason: "no-storage" };

  const batch = `${new Date().toISOString().slice(0, 10)}-${randomUUID().slice(0, 8)}`;
  const timestamp = String(Math.floor(Date.now() / 1000));

  const ids = fields.map((field, i) => ({
    field,
    publicId: env
      ? `${env.folder}/${form}/${batch}/${field}-${i + 1}`
      : `local/${form}/${batch}/${field}-${i + 1}`,
  }));

  const slots: UploadSlot[] = env
    ? ids.map(({ field, publicId }) => {
        const params = {
          public_id: publicId,
          timestamp,
          type: "authenticated",
        };
        return {
          field,
          uploadUrl: `https://api.cloudinary.com/v1_1/${env.cloudName}/auto/upload`,
          params: {
            ...params,
            api_key: env.apiKey,
            signature: cloudinary.utils.api_sign_request(params, env.apiSecret),
          },
        };
      })
    : []; // Local development without Cloudinary: files are not uploaded.

  const data: TicketData = { form, ids, exp: Date.now() + TICKET_LIFETIME_MS };
  const payload = b64(JSON.stringify(data));
  return { ok: true, ticket: `${payload}.${sign(payload, secret)}`, slots };
}

/** Returns the ticket's data if it is genuine, unexpired and for this form. */
export function readTicket(ticket: unknown, form: string): TicketData | null {
  const secret = ticketSecret();
  if (!secret || typeof ticket !== "string") return null;
  const [payload, signature] = ticket.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload, secret));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given))
    return null;

  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString(),
    ) as TicketData;
    if (data.form !== form || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

const safeName = (name: string) =>
  name.replace(/[^\w.\- ]+/g, "_").slice(0, 100) || "file";

/**
 * Checks the uploaded files against the ticket and Cloudinary, and returns
 * them as email attachments. `null` means something did not match.
 */
export async function confirmUploads(
  ticket: TicketData,
  uploads: unknown,
): Promise<EmailAttachment[] | null> {
  if (!Array.isArray(uploads)) return null;
  // No files expected and none sent (e.g. an incident report without photos)
  if (ticket.ids.length === 0 && uploads.length === 0) return [];
  const env = cloudinaryEnv();

  // Local development without Cloudinary: nothing was uploaded.
  if (!env) return isDev && uploads.length === 0 ? [] : null;
  if (uploads.length !== ticket.ids.length) return null;

  const attachments: EmailAttachment[] = [];
  for (const upload of uploads as UploadedFile[]) {
    const allowed = ticket.ids.find(
      (id) => id.publicId === upload?.publicId && id.field === upload?.field,
    );
    if (!allowed) return null;
    if (upload.resourceType !== "image" && upload.resourceType !== "raw")
      return null;

    try {
      const resource = (await cloudinary.api.resource(upload.publicId, {
        resource_type: upload.resourceType,
        type: "authenticated",
      })) as { bytes: number; format?: string };
      if (resource.bytes > MAX_FILE_BYTES) return null;

      // A signed, expiring download link through Cloudinary's API. Unlike
      // normal delivery links it also works for PDFs, which Cloudinary
      // blocks by default. Resend downloads it once when sending.
      const url = cloudinary.utils.private_download_url(
        upload.publicId,
        resource.format ?? "",
        {
          resource_type: upload.resourceType,
          type: "authenticated",
          expires_at: Math.floor(Date.now() / 1000) + DOWNLOAD_LINK_SECONDS,
          attachment: true,
        },
      );
      attachments.push({ filename: safeName(String(upload.name)), path: url });
    } catch (error) {
      console.error("[uploads] Could not confirm file on Cloudinary", error);
      return null;
    }
  }
  return attachments;
}
