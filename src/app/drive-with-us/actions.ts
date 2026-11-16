"use server";

import {
  INVALID_FORM_MESSAGE,
  makeReference,
  type FormResult,
} from "@/lib/reference";
import {
  driverApplicationSchema,
  type DriverApplicationInput,
} from "@/lib/validation/driver-application";

/**
 * Receives a driver application. Only file details (name, size, type) are
 * sent here, and they are checked against the same limits as the browser.
 * MOCKED (US-08): nothing is saved yet. US-15 uploads the CV and licence to
 * Cloudinary as private files and stores the application.
 */
export async function submitDriverApplication(
  values: DriverApplicationInput,
): Promise<FormResult> {
  if (!driverApplicationSchema.safeParse(values).success) {
    return { ok: false, message: INVALID_FORM_MESSAGE };
  }
  return { ok: true, reference: makeReference("UVM-D") };
}
