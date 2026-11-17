/**
 * Sends email through Resend (https://resend.com) using its HTTP API.
 * Server-side only: the API key never reaches the browser.
 *
 * Without RESEND_API_KEY / EMAIL_FROM, emails are printed to the terminal
 * during local development, so the forms can be tried without an account.
 */

export type EmailAttachment = {
  filename: string;
  /** Public or signed URL that Resend downloads and attaches. */
  path: string;
};

export type EmailMessage = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
};

const isDev = process.env.NODE_ENV !== "production";

/** Where form notifications go: EMAIL_COMPANY_INBOX (comma-separated). */
export function companyInbox(): string[] {
  const raw =
    process.env.EMAIL_COMPANY_INBOX || process.env.NEXT_PUBLIC_COMPANY_EMAIL;
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Returns true when the email was accepted for delivery. */
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  // Resend's shared test sender until the company domain is verified.
  const from =
    process.env.EMAIL_FROM || "UK Vehicles On Move <onboarding@resend.dev>";

  // Automated tests: never send real emails, just record them in the log.
  if (process.env.EMAIL_TRANSPORT === "log") {
    console.info(
      `[email] (test) "${message.subject}" to ${message.to.join(", ")}`,
    );
    return true;
  }

  if (!apiKey || message.to.length === 0) {
    if (isDev) {
      console.info(
        `\n[email] Not sent (set RESEND_API_KEY and EMAIL_COMPANY_INBOX to send for real)\n` +
          `To: ${message.to.join(", ") || "(no recipient)"}\nSubject: ${message.subject}\n` +
          (message.attachments?.length
            ? `Attachments: ${message.attachments.map((a) => a.filename).join(", ")}\n`
            : "") +
          `\n${message.text}\n`,
      );
      return true;
    }
    console.error(
      "[email] Email is not configured: set RESEND_API_KEY and EMAIL_COMPANY_INBOX.",
    );
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: message.to,
        // Customer-typed text can appear in subjects: keep it on one line.
        subject: message.subject.replace(/[\r\n]+/g, " ").slice(0, 200),
        html: message.html,
        text: message.text,
        reply_to: message.replyTo,
        attachments: message.attachments,
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) {
      console.error(`[email] Resend error ${res.status}: ${await res.text()}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[email] Could not reach Resend", error);
    return false;
  }
}
