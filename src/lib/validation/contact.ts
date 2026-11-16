import { z } from "zod";

import {
  email,
  optionalUkPhone,
  privacyConsent,
} from "@/lib/validation/common";

export const contactSubjects = [
  { value: "general", label: "General enquiry" },
  { value: "booking", label: "An existing booking" },
  { value: "trade", label: "Trade or business account" },
  { value: "other", label: "Something else" },
] as const;

/** Contact form: shared by the browser form and the server action. */
export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email,
  phone: optionalUkPhone,
  subject: z.enum(["general", "booking", "trade", "other"], {
    error: "Choose what your message is about",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Enter a message of at least 10 characters")
    .max(2000, "Keep your message under 2,000 characters"),
  privacyAccepted: privacyConsent,
});

export type ContactFormValues = z.input<typeof contactSchema>;
export type ContactMessage = z.output<typeof contactSchema>;
