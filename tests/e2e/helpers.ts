import type { Page } from "@playwright/test";

/** Pretend the visitor already answered the cookie banner. */
export async function acceptCookies(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "uvm-cookie-consent",
      JSON.stringify({ necessary: true, analytics: false, decidedAt: "test" }),
    );
  });
}

/** YYYY-MM-DD, `days` from today. */
export function isoDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
