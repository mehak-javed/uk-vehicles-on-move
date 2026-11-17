"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import {
  TURNSTILE_SITE_KEY,
  type TurnstileHandle,
} from "@/components/forms/turnstile";
import type { FormResult } from "@/lib/reference";

export const NETWORK_ERROR_MESSAGE =
  "Sorry, something went wrong while sending. Please check your connection and try again.";

/**
 * Submission state shared by the site's forms: pending flag, server error,
 * success result, the spam-check token, and focus on the success heading
 * once it appears. Spread `captcha` onto <Turnstile />.
 */
export function useFormSubmit() {
  const [result, setResult] = useState<{ reference: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [token, setToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (result) headingRef.current?.focus();
  }, [result]);

  const run = (send: (token: string | undefined) => Promise<FormResult>) => {
    setError(null);
    if (TURNSTILE_SITE_KEY && !token) {
      setError(
        "Please wait for the security check under the form to finish, then send again.",
      );
      return;
    }
    startTransition(async () => {
      let res: FormResult;
      try {
        res = await send(token ?? undefined);
      } catch {
        res = { ok: false, message: NETWORK_ERROR_MESSAGE };
      }
      if (res.ok) {
        setResult({ reference: res.reference });
      } else {
        setError(res.message);
        // Tokens work once: get a fresh one for the next attempt.
        setToken(null);
        turnstileRef.current?.reset();
      }
    });
  };

  return {
    result,
    error,
    pending,
    headingRef,
    run,
    captcha: { ref: turnstileRef, onToken: setToken },
  };
}
