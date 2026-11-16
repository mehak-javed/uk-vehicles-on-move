"use client";

import { useSyncExternalStore } from "react";

import { todayInUk } from "@/lib/validation/common";

const noopSubscribe = () => () => {};

/**
 * Today's UK date (YYYY-MM-DD) for date-picker min/max limits. Read in the
 * browser only: Next.js pre-builds pages ahead of time, and a date baked in
 * at build time would go stale. Undefined during the pre-build.
 */
export function useTodayInUk(): string | undefined {
  return useSyncExternalStore(noopSubscribe, todayInUk, () => undefined);
}
