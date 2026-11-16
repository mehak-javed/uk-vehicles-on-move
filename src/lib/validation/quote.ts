import { z } from "zod";

import {
  email,
  privacyConsent,
  todayInUk,
  ukPhone,
  ukPostcode,
} from "@/lib/validation/common";

export { todayInUk };

/**
 * Quote request validation, shared by the browser form and the server
 * action, so both apply exactly the same rules.
 */

export const vehicleTypes = [
  { value: "car", label: "Car" },
  { value: "van", label: "Van" },
  { value: "suv", label: "4x4 / SUV" },
  { value: "motorbike", label: "Motorbike" },
  { value: "other", label: "Other" },
] as const;

export const quoteRequestSchema = z.object({
  // Step 1: vehicle
  vehicleType: z.enum(["car", "van", "suv", "motorbike", "other"], {
    error: "Choose a vehicle type",
  }),
  make: z.string().trim().min(1, "Enter the make, e.g. Ford").max(50),
  model: z.string().trim().min(1, "Enter the model, e.g. Focus").max(50),
  registration: z
    .string()
    .trim()
    .max(10, "Registration is too long")
    .transform((v) => v.toUpperCase()),
  driveable: z.enum(["yes", "no"], {
    error: "Tell us whether the vehicle can be driven",
  }),

  // Step 2: route and date
  collectionPostcode: ukPostcode,
  deliveryPostcode: ukPostcode,
  preferredDate: z
    .string()
    .min(1, "Choose a date")
    .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), "Choose a valid date")
    .refine((v) => v >= todayInUk(), "Choose today or a later date"),
  dateFlexible: z.boolean(),
  notes: z.string().trim().max(1000, "Keep notes under 1,000 characters"),

  // Step 3: contact details
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email,
  phone: ukPhone,
  customerType: z.enum(["private", "trade"], {
    error: "Choose private or trade",
  }),
  companyName: z.string().trim().max(100),
  privacyAccepted: privacyConsent,
});

/** What the form holds while the user types. */
export type QuoteFormValues = z.input<typeof quoteRequestSchema>;
/** Clean, normalised data after validation. */
export type QuoteRequest = z.output<typeof quoteRequestSchema>;

/** Which fields belong to each step, for step-by-step validation. */
export const quoteSteps = [
  {
    title: "Vehicle",
    fields: ["vehicleType", "make", "model", "registration", "driveable"],
  },
  {
    title: "Route & date",
    fields: [
      "collectionPostcode",
      "deliveryPostcode",
      "preferredDate",
      "dateFlexible",
      "notes",
    ],
  },
  {
    title: "Contact details",
    fields: [
      "fullName",
      "email",
      "phone",
      "customerType",
      "companyName",
      "privacyAccepted",
    ],
  },
  { title: "Review", fields: [] },
] as const satisfies readonly {
  title: string;
  fields: readonly (keyof QuoteFormValues)[];
}[];
