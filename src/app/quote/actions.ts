"use server";

import {
  quoteRequestSchema,
  type QuoteFormValues,
} from "@/lib/validation/quote";

export type SubmitQuoteResult =
  { ok: true; reference: string } | { ok: false; message: string };

/**
 * Receives a quote request. The data is validated again on the server with
 * the same schema as the browser, because browser checks can be bypassed.
 *
 * MOCKED (US-07): nothing is saved or emailed yet. US-13 will store the
 * request in the database, email the company and the customer, and add
 * Turnstile bot protection.
 */
export async function submitQuote(
  values: QuoteFormValues,
): Promise<SubmitQuoteResult> {
  const parsed = quoteRequestSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Some details are missing or invalid. Please check the form.",
    };
  }

  // Short, readable reference the customer can quote, e.g. "UVM-7K3QH2".
  const reference = `UVM-${crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()}`;
  return { ok: true, reference };
}
