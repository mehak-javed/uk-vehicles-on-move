"use server";

import {
  INVALID_FORM_MESSAGE,
  makeReference,
  type FormResult,
} from "@/lib/reference";
import { labelFor } from "@/lib/server/email-template";
import { sendFormEmails } from "@/lib/server/send-form";
import {
  confirmUploads,
  readTicket,
  type UploadedFile,
} from "@/lib/server/uploads";
import { UPLOAD_PROBLEM_MESSAGE } from "@/lib/server/upload-messages";
import {
  availabilityOptions,
  driverApplicationSchema,
  drivingExperience,
  type DriverApplicationInput,
} from "@/lib/validation/driver-application";

/**
 * Receives a driver application (US-15). The CV and licence were uploaded
 * to private storage first (see prepareUploads); the ticket proves the
 * spam check passed and lists the files this submission may use. Both
 * files are attached to the company email.
 */
export async function submitDriverApplication(
  values: DriverApplicationInput,
  proof: { ticket: string; uploads: UploadedFile[] },
): Promise<FormResult> {
  const parsed = driverApplicationSchema.safeParse(values);
  if (!parsed.success) return { ok: false, message: INVALID_FORM_MESSAGE };

  const ticket = readTicket(proof?.ticket, "driver");
  if (!ticket) return { ok: false, message: UPLOAD_PROBLEM_MESSAGE };
  const attachments = await confirmUploads(ticket, proof.uploads);
  if (!attachments) return { ok: false, message: UPLOAD_PROBLEM_MESSAGE };

  const a = parsed.data;
  return sendFormEmails({
    reference: makeReference("UVM-D"),
    customer: { name: a.fullName, email: a.email },
    company: {
      subject: `New driver application: ${a.fullName}`,
      heading: "New driver application",
      rows: [
        ["Name", a.fullName],
        ["Email", a.email],
        ["Phone", a.phone],
        ["Home postcode", a.postcode],
        ["Full UK licence held", labelFor(drivingExperience, a.experience)],
        ["Availability", labelFor(availabilityOptions, a.availability)],
        ["Experience", a.about],
        ["Right to work in the UK", "Confirmed"],
      ],
      attachments,
      fileNames: [...a.cv, ...a.licence].map((f) => f.name),
    },
    confirmation: {
      subject: "We've received your application",
      heading: "Thank you for applying to drive with us",
      intro: `Hi ${a.fullName}, thanks for your application. We'll review it along with your documents and contact you about the next steps.`,
      rows: [["Availability", labelFor(availabilityOptions, a.availability)]],
    },
  });
}
