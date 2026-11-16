"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import type { FormResult } from "@/lib/reference";

/**
 * Submission state shared by the site's forms: pending flag, server error,
 * success result, and focus on the success heading once it appears.
 */
export function useFormSubmit() {
  const [result, setResult] = useState<{ reference: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (result) headingRef.current?.focus();
  }, [result]);

  const run = (send: () => Promise<FormResult>) => {
    setError(null);
    startTransition(async () => {
      const res = await send();
      if (res.ok) setResult({ reference: res.reference });
      else setError(res.message);
    });
  };

  return { result, error, pending, headingRef, run };
}
