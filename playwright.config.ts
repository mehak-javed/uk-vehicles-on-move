import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;

/**
 * Browser tests against a production build (run `npm run build` first).
 * The server runs in email test mode, so no real emails are sent.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      EMAIL_TRANSPORT: "log",
      EMAIL_COMPANY_INBOX: "inbox@example.test",
      // The spam check needs a real browser token, so tests skip it.
      TURNSTILE_SECRET_KEY: "",
    },
  },
});
