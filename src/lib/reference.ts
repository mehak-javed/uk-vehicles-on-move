/** Short, readable reference a customer can quote, e.g. "UVM-I-7K3QH2". */
export function makeReference(prefix: string) {
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `${prefix}-${id}`;
}

export type FormResult =
  { ok: true; reference: string } | { ok: false; message: string };

export const INVALID_FORM_MESSAGE =
  "Some details are missing or invalid. Please check the form and try again.";
