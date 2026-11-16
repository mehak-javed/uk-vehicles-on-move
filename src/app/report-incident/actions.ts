"use server";

import {
  INVALID_FORM_MESSAGE,
  makeReference,
  type FormResult,
} from "@/lib/reference";
import { incidentSchema, type IncidentInput } from "@/lib/validation/incident";

/**
 * Receives an incident report. Only photo details (name, size, type) are
 * sent here, and they are checked against the same limits as the browser.
 * MOCKED (US-08): nothing is saved yet. US-16 uploads the photos to
 * Cloudinary as private files and stores the report.
 */
export async function submitIncidentReport(
  values: IncidentInput,
): Promise<FormResult> {
  if (!incidentSchema.safeParse(values).success) {
    return { ok: false, message: INVALID_FORM_MESSAGE };
  }
  return { ok: true, reference: makeReference("UVM-I") };
}
