"use server";

import {
  INVALID_FORM_MESSAGE,
  makeReference,
  type FormResult,
} from "@/lib/reference";
import { labelFor } from "@/lib/server/email-template";
import { sendFormEmails } from "@/lib/server/send-form";
import {
  HUMAN_CHECK_FAILED_MESSAGE,
  verifyHuman,
} from "@/lib/server/turnstile";
import {
  contactSchema,
  contactSubjects,
  type ContactFormValues,
} from "@/lib/validation/contact";

/**
 * Receives a contact message (US-14), validates it again on the server and
 * emails it to the company inbox, with a confirmation to the sender.
 */
export async function sendContactMessage(
  values: ContactFormValues,
  turnstileToken?: string,
): Promise<FormResult> {
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) return { ok: false, message: INVALID_FORM_MESSAGE };
  if (!(await verifyHuman(turnstileToken)))
    return { ok: false, message: HUMAN_CHECK_FAILED_MESSAGE };

  const m = parsed.data;
  const subject = labelFor(contactSubjects, m.subject);

  return sendFormEmails({
    reference: makeReference("UVM-C"),
    customer: { name: m.fullName, email: m.email },
    company: {
      subject: `New message: ${subject}`,
      heading: "New contact message",
      rows: [
        ["Name", m.fullName],
        ["Email", m.email],
        ["Phone", m.phone],
        ["Subject", subject],
        ["Message", m.message],
      ],
    },
    confirmation: {
      subject: "We've received your message",
      heading: "Thank you for getting in touch",
      intro: `Hi ${m.fullName}, thanks for your message. A member of our team will reply as soon as possible.`,
      rows: [
        ["Subject", subject],
        ["Your message", m.message],
      ],
    },
  });
}
