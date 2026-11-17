import type { FormResult } from "@/lib/reference";
import type { UploadField, UploadedFile } from "@/lib/server/uploads";
import { prepareUploads, type UploadForm } from "@/lib/uploads/actions";
import { toFileMeta } from "@/lib/validation/common";

export const UPLOAD_FAILED_MESSAGE =
  "Your files could not be uploaded. Please check your connection and try again.";

/**
 * Sends a form that has files: gets signed upload slots, uploads each file
 * straight to secure storage, then calls `submit` with the ticket and the
 * uploaded files. Used by the Drive With Us and Report an Incident forms.
 */
export async function submitWithFiles(
  form: UploadForm,
  files: Partial<Record<UploadField, File[]>>,
  turnstileToken: string | undefined,
  submit: (proof: {
    ticket: string;
    uploads: UploadedFile[];
  }) => Promise<FormResult>,
): Promise<FormResult> {
  const entries = Object.entries(files) as [UploadField, File[]][];

  const prepared = await prepareUploads({
    form,
    files: Object.fromEntries(
      entries.map(([field, list]) => [field, toFileMeta(list)]),
    ),
    turnstileToken,
  });
  if (!prepared.ok) return prepared;

  // Same order as the server created the slots: field by field.
  const queue = entries.flatMap(([field, list]) =>
    list.map((file) => ({ field, file })),
  );

  const uploads: UploadedFile[] = [];
  if (prepared.slots.length > 0) {
    try {
      for (const [i, slot] of prepared.slots.entries()) {
        const { field, file } = queue[i];
        if (slot.field !== field)
          return { ok: false, message: UPLOAD_FAILED_MESSAGE };

        const body = new FormData();
        body.append("file", file);
        for (const [key, value] of Object.entries(slot.params))
          body.append(key, value);

        const res = await fetch(slot.uploadUrl, { method: "POST", body });
        if (!res.ok) return { ok: false, message: UPLOAD_FAILED_MESSAGE };
        const data = (await res.json()) as {
          public_id: string;
          resource_type: string;
        };
        uploads.push({
          field,
          publicId: data.public_id,
          resourceType: data.resource_type,
          name: file.name,
        });
      }
    } catch {
      return { ok: false, message: UPLOAD_FAILED_MESSAGE };
    }
  }

  return submit({ ticket: prepared.ticket, uploads });
}
