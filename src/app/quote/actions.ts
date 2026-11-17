"use server";

import {
  INVALID_FORM_MESSAGE,
  makeReference,
  type FormResult,
} from "@/lib/reference";
import { formatLongDate, labelFor } from "@/lib/server/email-template";
import { sendFormEmails } from "@/lib/server/send-form";
import {
  HUMAN_CHECK_FAILED_MESSAGE,
  verifyHuman,
} from "@/lib/server/turnstile";
import {
  quoteRequestSchema,
  vehicleTypes,
  type QuoteFormValues,
} from "@/lib/validation/quote";

/**
 * Receives a quote request (US-13). The data is validated again on the
 * server with the same schema as the browser, because browser checks can be
 * bypassed. The company is emailed the request and the customer gets a
 * confirmation with their reference.
 */
export async function submitQuote(
  values: QuoteFormValues,
  turnstileToken?: string,
): Promise<FormResult> {
  const parsed = quoteRequestSchema.safeParse(values);
  if (!parsed.success) return { ok: false, message: INVALID_FORM_MESSAGE };
  if (!(await verifyHuman(turnstileToken)))
    return { ok: false, message: HUMAN_CHECK_FAILED_MESSAGE };

  const q = parsed.data;
  const reference = makeReference("UVM-Q");
  const vehicle = `${q.make} ${q.model}`;
  const date = `${formatLongDate(q.preferredDate)}${q.dateFlexible ? " (flexible)" : ""}`;
  const route = `${q.collectionPostcode} to ${q.deliveryPostcode}`;

  return sendFormEmails({
    reference,
    customer: { name: q.fullName, email: q.email },
    company: {
      subject: `New quote request: ${vehicle}, ${route}`,
      heading: "New quote request",
      rows: [
        ["Name", q.fullName],
        ["Email", q.email],
        ["Phone", q.phone],
        [
          "Customer",
          q.customerType === "trade"
            ? `Trade${q.companyName ? ` (${q.companyName})` : ""}`
            : "Private",
        ],
        ["Vehicle type", labelFor(vehicleTypes, q.vehicleType)],
        ["Make and model", vehicle],
        ["Registration", q.registration],
        ["Can be driven", q.driveable === "yes" ? "Yes" : "No"],
        ["Collection", q.collectionPostcode],
        ["Delivery", q.deliveryPostcode],
        ["Preferred date", date],
        ["Notes", q.notes],
      ],
    },
    confirmation: {
      subject: "We've received your quote request",
      heading: "Thank you for your quote request",
      intro: `Hi ${q.fullName}, thanks for asking us to move your ${vehicle}. We'll review the details and get back to you with a price as soon as possible.`,
      rows: [
        ["Vehicle", vehicle],
        ["Route", route],
        ["Preferred date", date],
      ],
    },
  });
}
