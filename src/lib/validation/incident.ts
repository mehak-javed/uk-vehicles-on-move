import { z } from "zod";

import {
  email,
  fileMetaField,
  filesField,
  privacyConsent,
  todayInUk,
  ukPhone,
} from "@/lib/validation/common";

export const incidentTypes = [
  { value: "damage", label: "Damage to a vehicle" },
  { value: "accident", label: "Road traffic accident" },
  { value: "breakdown", label: "Breakdown" },
  { value: "delay", label: "Delay or missed collection" },
  { value: "other", label: "Something else" },
] as const;

export const MAX_INCIDENT_PHOTOS = 5;

const fields = {
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email,
  phone: ukPhone,
  jobReference: z
    .string()
    .trim()
    .max(20, "Reference is too long")
    .transform((v) => v.toUpperCase()),
  incidentType: z.enum(["damage", "accident", "breakdown", "delay", "other"], {
    error: "Choose the type of incident",
  }),
  incidentDate: z
    .string()
    .min(1, "Choose the date of the incident")
    .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), "Choose a valid date")
    .refine((v) => v <= todayInUk(), "The date cannot be in the future"),
  location: z
    .string()
    .trim()
    .min(3, "Enter where it happened, e.g. a road, town or postcode")
    .max(200),
  vehicleRegistration: z
    .string()
    .trim()
    .max(10, "Registration is too long")
    .transform((v) => v.toUpperCase()),
  description: z
    .string()
    .trim()
    .min(20, "Describe what happened in at least 20 characters")
    .max(3000, "Keep the description under 3,000 characters"),
  privacyAccepted: privacyConsent,
};

/** Browser form: includes the chosen photos. */
export const incidentFormSchema = z.object({
  ...fields,
  photos: filesField("image", { max: MAX_INCIDENT_PHOTOS }),
});

/** Server action: same rules, with photo details instead of files. */
export const incidentSchema = z.object({
  ...fields,
  photos: fileMetaField("image", { max: MAX_INCIDENT_PHOTOS }),
});

export type IncidentFormValues = z.input<typeof incidentFormSchema>;
export type IncidentFormOutput = z.output<typeof incidentFormSchema>;
export type IncidentInput = z.input<typeof incidentSchema>;
