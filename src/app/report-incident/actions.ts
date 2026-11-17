"use server";

import {
  INVALID_FORM_MESSAGE,
  makeReference,
  type FormResult,
} from "@/lib/reference";
import { formatLongDate, labelFor } from "@/lib/server/email-template";
import { sendFormEmails } from "@/lib/server/send-form";
import {
  confirmUploads,
  readTicket,
  type UploadedFile,
} from "@/lib/server/uploads";
import { UPLOAD_PROBLEM_MESSAGE } from "@/lib/server/upload-messages";
import {
  incidentSchema,
  incidentTypes,
  type IncidentInput,
} from "@/lib/validation/incident";

/**
 * Receives an incident report (US-16). Any photos were uploaded to private
 * storage first (see prepareUploads) and are attached to the company email.
 */
export async function submitIncidentReport(
  values: IncidentInput,
  proof: { ticket: string; uploads: UploadedFile[] },
): Promise<FormResult> {
  const parsed = incidentSchema.safeParse(values);
  if (!parsed.success) return { ok: false, message: INVALID_FORM_MESSAGE };

  const ticket = readTicket(proof?.ticket, "incident");
  if (!ticket) return { ok: false, message: UPLOAD_PROBLEM_MESSAGE };
  const attachments = await confirmUploads(ticket, proof.uploads);
  if (!attachments) return { ok: false, message: UPLOAD_PROBLEM_MESSAGE };

  const r = parsed.data;
  const type = labelFor(incidentTypes, r.incidentType);
  const date = formatLongDate(r.incidentDate);

  return sendFormEmails({
    reference: makeReference("UVM-I"),
    customer: { name: r.fullName, email: r.email },
    company: {
      subject: `Incident report: ${type}${r.vehicleRegistration ? `, ${r.vehicleRegistration}` : ""}`,
      heading: "New incident report",
      rows: [
        ["Name", r.fullName],
        ["Email", r.email],
        ["Phone", r.phone],
        ["Type", type],
        ["Date", date],
        ["Location", r.location],
        ["Job reference", r.jobReference],
        ["Vehicle registration", r.vehicleRegistration],
        ["What happened", r.description],
      ],
      attachments,
      fileNames: r.photos.map((f) => f.name),
    },
    confirmation: {
      subject: "We've received your incident report",
      heading: "Your incident report has been received",
      intro: `Hi ${r.fullName}, thank you for letting us know. A member of our team will contact you about the incident.`,
      rows: [
        ["Type", type],
        ["Date", date],
        ["Location", r.location],
      ],
    },
  });
}
