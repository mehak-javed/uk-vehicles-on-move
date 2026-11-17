import {
  companyInbox,
  sendEmail,
  type EmailAttachment,
} from "@/lib/server/email";
import { renderEmail, type EmailRow } from "@/lib/server/email-template";
import { siteConfig } from "@/config/site";
import type { FormResult } from "@/lib/reference";

export const SEND_FAILED_MESSAGE =
  "Sorry, we couldn't send your form just now. Please try again in a few minutes, or contact us directly.";

/**
 * Emails a form submission to the company (with the customer as reply-to)
 * and sends the customer a confirmation. The form only counts as sent when
 * the company email goes through; the confirmation is best effort.
 */
export async function sendFormEmails({
  reference,
  customer,
  company,
  confirmation,
}: {
  reference: string;
  customer: { name: string; email: string };
  company: {
    subject: string;
    heading: string;
    rows: EmailRow[];
    attachments?: EmailAttachment[];
    /** File names listed in the email when they could not be attached. */
    fileNames?: string[];
  };
  confirmation: {
    subject: string;
    heading: string;
    intro: string;
    rows: EmailRow[];
  };
}): Promise<FormResult> {
  const attachments = company.attachments ?? [];
  const companyEmail = renderEmail({
    heading: company.heading,
    intro: `Reference ${reference}. Reply to this email to answer ${customer.name} directly.`,
    rows: [
      ...company.rows,
      ...(attachments.length
        ? [
            [
              "Attached files",
              attachments.map((a) => a.filename).join(", "),
            ] as EmailRow,
          ]
        : company.fileNames?.length
          ? [["Files (not attached)", company.fileNames.join(", ")] as EmailRow]
          : []),
    ],
    links: attachments.map((a) => ({ label: a.filename, href: a.path })),
  });

  const sent = await sendEmail({
    to: companyInbox(),
    subject: `${company.subject} · ${reference}`,
    replyTo: customer.email,
    attachments,
    ...companyEmail,
  });
  if (!sent) return { ok: false, message: SEND_FAILED_MESSAGE };

  const inbox = companyInbox()[0];
  const confirmationEmail = renderEmail({
    heading: confirmation.heading,
    intro: confirmation.intro,
    rows: [["Your reference", reference], ...confirmation.rows],
    outro: `If anything is wrong, just reply to this email. Thank you, the ${siteConfig.name} team.`,
  });
  await sendEmail({
    to: [customer.email],
    subject: `${confirmation.subject} (${reference})`,
    replyTo: inbox,
    ...confirmationEmail,
  });

  return { ok: true, reference };
}
