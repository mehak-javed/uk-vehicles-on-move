import { z } from "zod";

/**
 * Quote request validation, shared by the browser form and the server
 * action, so both apply exactly the same rules.
 */

// UK postcode, e.g. "SW1A 1AA", "m1 1ae", "B338TH". Normalised to "B33 8TH".
const UK_POSTCODE = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})$/i;

export const ukPostcode = z
  .string()
  .trim()
  .min(1, "Enter a postcode")
  .regex(UK_POSTCODE, "Enter a valid UK postcode, like SW1A 1AA")
  .transform((v) => v.toUpperCase().replace(UK_POSTCODE, "$1 $2"));

// UK phone: 07…, 01…, 02…, +44… or 0044…, spaces/dashes/brackets allowed.
// Normalised to international format, e.g. "+447700900123".
export const ukPhone = z
  .string()
  .trim()
  .min(1, "Enter a phone number")
  .transform((v) => v.replace(/[\s\-().]/g, ""))
  .refine((v) => /^(?:(?:\+|00)44|0)[1-9]\d{8,9}$/.test(v), {
    message: "Enter a valid UK phone number, like 07700 900123",
  })
  .transform((v) => `+44${v.replace(/^(?:\+44|0044|0)/, "")}`);

/** Today's date in the UK as YYYY-MM-DD. */
export function todayInUk(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
  }).format(new Date());
}

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
  email: z.email("Enter a valid email address, like name@example.com"),
  phone: ukPhone,
  customerType: z.enum(["private", "trade"], {
    error: "Choose private or trade",
  }),
  companyName: z.string().trim().max(100),
  privacyAccepted: z.literal(true, {
    error: "Please confirm you have read the privacy policy",
  }),
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
