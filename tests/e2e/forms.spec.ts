import { expect, test } from "@playwright/test";

import { acceptCookies, isoDate } from "./helpers";

test.beforeEach(async ({ page }) => acceptCookies(page));

test("a visitor sends the contact form and gets a reference", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByLabel("Full name").fill("Test Customer");
  await page.getByLabel("Email address").fill("customer@example.test");
  await page.getByRole("combobox", { name: "What is it about?" }).click();
  await page.getByRole("option", { name: "General enquiry" }).click();
  await page
    .getByRole("textbox", { name: "Message" })
    .fill("Hello, I would like to ask about moving a van.");
  await page.getByRole("checkbox", { name: /privacy policy/i }).check();
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText(/UVM-C-[A-Z0-9]{6}/)).toBeVisible();
});

test("the contact form explains what is missing", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Enter your full name")).toBeVisible();
  await expect(page.getByText(/valid email address/i)).toBeVisible();
});

test("a visitor completes the quote request step by step", async ({ page }) => {
  await page.goto("/quote");

  // Step 1: vehicle
  await page.getByRole("combobox", { name: "Vehicle type" }).click();
  await page.getByRole("option", { name: "Car" }).click();
  await page.getByLabel("Make").fill("Ford");
  await page.getByLabel("Model").fill("Focus");
  await page.getByRole("radio", { name: "Yes" }).check();
  await page.getByRole("button", { name: /continue/i }).click();

  // Step 2: route and date
  await page.getByLabel("Collection postcode").fill("sw1a1aa");
  await page.getByLabel("Delivery postcode").fill("M1 1AE");
  await page.getByLabel("Preferred collection date").fill(isoDate(7));
  await page.getByRole("button", { name: /continue/i }).click();

  // Step 3: contact details
  await page.getByLabel("Full name").fill("Test Customer");
  await page.getByLabel("Email address").fill("customer@example.test");
  await page.getByLabel("Phone number").fill("07700 900123");
  await page.getByRole("radio", { name: "Private customer" }).check();
  await page.getByRole("checkbox", { name: /privacy policy/i }).check();
  await page.getByRole("button", { name: /continue/i }).click();

  // Step 4: review shows cleaned-up values, then send
  await expect(page.getByText("SW1A 1AA")).toBeVisible();
  await page.getByRole("button", { name: "Send quote request" }).click();

  await expect(page.getByText(/UVM-Q-[A-Z0-9]{6}/)).toBeVisible();
});

test("an incident can be reported without photos", async ({ page }) => {
  await page.goto("/report-incident");
  await page.getByRole("combobox", { name: "Type of incident" }).click();
  await page
    .getByRole("option", { name: "Delay or missed collection" })
    .click();
  await page.getByLabel("Date of the incident").fill(isoDate(-1));
  await page.getByLabel("Where did it happen?").fill("M1 1AE, Manchester");
  await page
    .getByLabel("Describe what happened")
    .fill("The collection was two hours later than agreed.");
  await page.getByLabel("Full name").fill("Test Customer");
  await page.getByLabel("Email address").fill("customer@example.test");
  await page.getByLabel("Phone number").fill("07700 900123");
  await page.getByRole("checkbox", { name: /privacy policy/i }).check();
  await page.getByRole("button", { name: "Send report" }).click();

  await expect(page.getByText(/UVM-I-[A-Z0-9]{6}/)).toBeVisible();
});

test("the driver form refuses a file type that is not allowed", async ({
  page,
}) => {
  await page.goto("/drive-with-us");
  await page.getByLabel("CV").setInputFiles({
    name: "cv.exe",
    mimeType: "application/octet-stream",
    buffer: Buffer.from("not a document"),
  });
  await page.getByRole("button", { name: "Submit application" }).click();
  await expect(page.getByText(/cv\.exe is not allowed/i)).toBeVisible();
});
