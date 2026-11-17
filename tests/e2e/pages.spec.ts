import { expect, test } from "@playwright/test";

import { acceptCookies } from "./helpers";

const pages = [
  { path: "/", heading: /vehicle delivery/i },
  { path: "/about", heading: /moving vehicles, the right way/i },
  { path: "/services", heading: /services/i },
  { path: "/gallery", heading: /gallery/i },
  { path: "/news", heading: /news/i },
  { path: "/contact", heading: "Contact us" },
  { path: "/quote", heading: /quote/i },
  { path: "/drive-with-us", heading: /drive with us/i },
  { path: "/report-incident", heading: /report an incident/i },
  { path: "/privacy", heading: "Privacy policy" },
  { path: "/cookies", heading: "Cookie policy" },
  { path: "/terms", heading: "Terms & conditions" },
];

test.beforeEach(async ({ page }) => acceptCookies(page));

for (const { path, heading } of pages) {
  test(`${path} loads with its heading and no sideways scroll`, async ({
    page,
  }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
}

test("unknown pages show the branded 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /wrong turn/i,
  );
});

test("the hero video is silent and loops", async ({ page }) => {
  await page.goto("/");
  const video = page.locator("video");
  await expect(video).toHaveJSProperty("muted", true);
  await expect(video).toHaveJSProperty("loop", true);
});

test("first visit shows the cookie banner, and the choice is remembered", async ({
  browser,
}) => {
  const page = await browser.newPage();
  await page.goto("/");
  const banner = page.getByRole("region", { name: "Cookie consent" });
  await expect(banner).toBeVisible();
  await banner.getByRole("button", { name: "Decline" }).click();
  await expect(banner).toBeHidden();
  await page.reload();
  await expect(banner).toBeHidden();
  await page.close();
});

test("search engine files and security headers are in place", async ({
  request,
}) => {
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Sitemap:");

  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("/quote</loc>");

  const home = await request.get("/");
  const headers = home.headers();
  expect(headers["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-powered-by"]).toBeUndefined();
});
