"use client";

import { useSyncExternalStore } from "react";

/**
 * Cookie-consent choice stored in the visitor's browser. US-03 builds the
 * banner; US-28 uses `analytics` to decide which scripts may load.
 */
export type Consent = {
  necessary: true;
  analytics: boolean;
  decidedAt: string;
};

const STORAGE_KEY = "uvm-cookie-consent";
const CHANGE_EVENT = "uvm-consent-change";

function read(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // storage blocked: treat as undecided
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function saveConsent(choice: { analytics: boolean }) {
  const value: Consent = {
    necessary: true,
    analytics: choice.analytics,
    decidedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage blocked: the choice applies to this page view only.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * The saved choice: `undefined` while rendering on the server,
 * `null` when the visitor has not decided yet.
 */
export function useConsent(): Consent | null | undefined {
  const raw = useSyncExternalStore(subscribe, read, () => undefined);
  if (raw === undefined) return undefined;
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as Consent;
  } catch {
    return null;
  }
}
