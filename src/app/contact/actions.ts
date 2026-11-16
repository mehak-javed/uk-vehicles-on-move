"use server";

import {
  INVALID_FORM_MESSAGE,
  makeReference,
  type FormResult,
} from "@/lib/reference";
import {
  contactSchema,
  type ContactFormValues,
} from "@/lib/validation/contact";

/**
 * Receives a contact message and validates it again on the server.
 * MOCKED (US-08): nothing is saved or emailed yet. US-14 stores the message
 * and emails the company inbox.
 */
export async function sendContactMessage(
  values: ContactFormValues,
): Promise<FormResult> {
  if (!contactSchema.safeParse(values).success) {
    return { ok: false, message: INVALID_FORM_MESSAGE };
  }
  return { ok: true, reference: makeReference("UVM-C") };
}
