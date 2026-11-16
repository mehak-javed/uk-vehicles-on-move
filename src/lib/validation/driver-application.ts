import { z } from "zod";

import {
  email,
  fileMetaField,
  filesField,
  privacyConsent,
  ukPhone,
  ukPostcode,
} from "@/lib/validation/common";

export const drivingExperience = [
  { value: "under-3", label: "Less than 3 years" },
  { value: "3-5", label: "3 to 5 years" },
  { value: "over-5", label: "More than 5 years" },
] as const;

export const availabilityOptions = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "weekends", label: "Weekends only" },
  { value: "flexible", label: "Flexible / ad hoc" },
] as const;

const fields = {
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email,
  phone: ukPhone,
  postcode: ukPostcode,
  experience: z.enum(["under-3", "3-5", "over-5"], {
    error: "Choose how long you have held a full UK licence",
  }),
  availability: z.enum(["full-time", "part-time", "weekends", "flexible"], {
    error: "Choose your availability",
  }),
  about: z.string().trim().max(1500, "Keep this under 1,500 characters"),
  rightToWork: z.literal(true, {
    error: "Please confirm you have the right to work in the UK",
  }),
  privacyAccepted: privacyConsent,
};

/** Browser form: includes the chosen files. */
export const driverApplicationFormSchema = z.object({
  ...fields,
  cv: filesField("document", { required: true }),
  licence: filesField("documentOrImage", { required: true }),
});

/** Server action: same rules, with file details instead of files. */
export const driverApplicationSchema = z.object({
  ...fields,
  cv: fileMetaField("document", { required: true }),
  licence: fileMetaField("documentOrImage", { required: true }),
});

export type DriverApplicationFormValues = z.input<
  typeof driverApplicationFormSchema
>;
export type DriverApplicationFormOutput = z.output<
  typeof driverApplicationFormSchema
>;
export type DriverApplicationInput = z.input<typeof driverApplicationSchema>;
