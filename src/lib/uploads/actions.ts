"use server";

import { INVALID_FORM_MESSAGE } from "@/lib/reference";
import {
  HUMAN_CHECK_FAILED_MESSAGE,
  verifyHuman,
} from "@/lib/server/turnstile";
import {
  createTicket,
  type UploadField,
  type UploadSlot,
} from "@/lib/server/uploads";
import { driverApplicationSchema } from "@/lib/validation/driver-application";
import { incidentSchema } from "@/lib/validation/incident";

type FileDetails = { name: string; size: number; type: string };

/** Which file fields each form has, with the same rules as the form. */
const rules = {
  driver: {
    cv: driverApplicationSchema.shape.cv,
    licence: driverApplicationSchema.shape.licence,
  },
  incident: {
    photos: incidentSchema.shape.photos,
  },
} as const;

export type UploadForm = keyof typeof rules;

export type PrepareResult =
  | { ok: true; ticket: string; slots: UploadSlot[] }
  | { ok: false; message: string };

/**
 * Step 1 of a form with files: checks the spam protection and the file
 * details, then returns signed upload slots and a ticket for the submit.
 */
export async function prepareUploads(input: {
  form: UploadForm;
  files: Partial<Record<UploadField, FileDetails[]>>;
  turnstileToken?: string;
}): Promise<PrepareResult> {
  const formRules = rules[input.form] as Record<
    string,
    { safeParse: (v: unknown) => { success: boolean } }
  >;
  if (!formRules) return { ok: false, message: INVALID_FORM_MESSAGE };

  const fields: UploadField[] = [];
  for (const [field, schema] of Object.entries(formRules)) {
    const files = input.files[field as UploadField] ?? [];
    if (!schema.safeParse(files).success)
      return { ok: false, message: INVALID_FORM_MESSAGE };
    files.forEach(() => fields.push(field as UploadField));
  }

  if (!(await verifyHuman(input.turnstileToken)))
    return { ok: false, message: HUMAN_CHECK_FAILED_MESSAGE };

  const result = createTicket(input.form, fields);
  if (!result.ok) {
    console.error(
      `[uploads] Cannot accept the ${input.form} form: ${result.reason === "no-storage" ? "Cloudinary is not configured" : "no server secret is configured"}.`,
    );
    return {
      ok: false,
      message:
        "Sorry, we can't accept files right now. Please try again later or contact us directly.",
    };
  }
  return { ok: true, ticket: result.ticket, slots: result.slots };
}
