"use client";

import { Button } from "@/components/ui/button";
import { clearConsent, useConsent } from "@/lib/consent";

/**
 * Shows the visitor's current cookie choice and lets them change it:
 * clearing the saved choice brings the cookie banner back.
 */
export function CookieSettings() {
  const consent = useConsent();

  const status =
    consent === undefined
      ? "Checking your cookie choice…"
      : consent === null
        ? "You have not made a choice yet."
        : consent.analytics
          ? "You have accepted analytics cookies."
          : "You have declined analytics cookies.";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <p aria-live="polite" className="text-sm">
        <strong>Your current choice:</strong> {status}
      </p>
      <Button
        variant="accent"
        size="lg"
        disabled={!consent}
        onClick={() => clearConsent()}
      >
        Change cookie settings
      </Button>
    </div>
  );
}
