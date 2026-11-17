/**
 * Cloudflare Turnstile spam protection: checks the token the browser widget
 * produced. Without TURNSTILE_SECRET_KEY the check is skipped (with a
 * warning), so the forms keep working before the keys are set up.
 */
export async function verifyHuman(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("[turnstile] TURNSTILE_SECRET_KEY is not set: check skipped.");
    return true;
  }
  if (!token) return false;

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({ secret, response: token }),
        signal: AbortSignal.timeout(10_000),
      },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("[turnstile] Verification failed", error);
    return false;
  }
}

export const HUMAN_CHECK_FAILED_MESSAGE =
  "The security check did not pass. Please complete it again and resend the form.";
