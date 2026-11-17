import { expect, test } from "@playwright/test";

import { acceptCookies } from "./helpers";

const pages = [
  { path: "/", heading: /vehicle delivery/i },
  { path: "/about", heading: /moving vehicles, the right way/i },
  { path: "/services", heading: /services/i },
  { path: "/gallery", heading: /gallery/i },
  { path: "/news", heading: /news/i },
  { path: "/contact", heading: "Let's move it." },
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

test("the home quote button opens the contact page", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("main")
    .getByRole("link", { name: /get a free quote/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/contact$/);
});

test('the "Let\'s move it" band appears only on the contact page', async ({
  page,
}) => {
  const band = page.getByRole("heading", {
    name: "Let's move it.",
  });
  await page.goto("/contact");
  await expect(band).toBeVisible();
  for (const path of ["/", "/about", "/services", "/gallery", "/news"]) {
    await page.goto(path);
    await expect(band).toHaveCount(0);
  }
});

test("the home steps fill in as you scroll", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const line = page.locator(".steps-progress");
  const scaleY = () =>
    line.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).d);
  const top = await page.evaluate(
    () =>
      document.querySelector(".steps-timeline")!.getBoundingClientRect().top,
  );
  await page.evaluate((y) => window.scrollTo(0, y - 900), top);
  const before = await scaleY();
  await page.evaluate((y) => window.scrollTo(0, y), top);
  await expect.poll(scaleY).toBeGreaterThan(before);
});

test("each home step links somewhere useful", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /request a quote/i }).click();
  await expect(page).toHaveURL(/\/quote$/);
});

test("the contact page header links to the quote form", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("link", { name: /free quote/i }).click();
  await expect(page).toHaveURL(/\/quote$/);
});

test("the truck on the contact page keeps driving", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/contact");
  const truck = page.locator(".truck-drive");
  const x1 = (await truck.boundingBox())?.x ?? 0;
  await page.waitForTimeout(600);
  const x2 = (await truck.boundingBox())?.x ?? 0;
  expect(x2).not.toBe(x1);
});

test("home services move sideways as you scroll, and reset at the top", async ({
  page,
  isMobile,
}) => {
  test.skip(Boolean(isMobile), "phones get a swipeable row instead");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const section = page.locator('section[aria-label="Our services"]');
  const box = await section.evaluate((s) => ({
    top: s.getBoundingClientRect().top + window.scrollY,
    height: (s as HTMLElement).offsetHeight,
  }));
  const trackX = () =>
    section.evaluate(
      (s) =>
        new DOMMatrix(
          getComputedStyle(s.querySelector(".will-change-transform")!)
            .transform,
        ).m41,
    );
  await page.evaluate(
    (b) => window.scrollTo(0, b.top + (b.height - 900) / 2),
    box,
  );
  await expect.poll(trackX).toBeLessThan(-100);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(trackX).toBe(0);
});

test("home services are a swipeable row on phones", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const row = page.locator('section[aria-label="Our services"] .snap-x');
  const scrolls = await row.evaluate((r) => r.scrollWidth > r.clientWidth);
  expect(scrolls).toBe(true);
});
