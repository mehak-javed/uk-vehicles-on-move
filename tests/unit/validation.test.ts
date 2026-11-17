import { describe, expect, it } from "vitest";

import { contactSchema } from "@/lib/validation/contact";
import { ukPhone, ukPostcode } from "@/lib/validation/common";
import { driverApplicationSchema } from "@/lib/validation/driver-application";
import { incidentSchema } from "@/lib/validation/incident";
import { quoteRequestSchema } from "@/lib/validation/quote";

const nextWeek = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
};

describe("UK postcode", () => {
  it.each([
    ["sw1a1aa", "SW1A 1AA"],
    ["M1 1AE", "M1 1AE"],
    ["b338th", "B33 8TH"],
  ])("normalises %s to %s", (input, output) => {
    expect(ukPostcode.parse(input)).toBe(output);
  });

  it.each(["", "12345", "ABC", "SW1A"])("rejects %j", (input) => {
    expect(ukPostcode.safeParse(input).success).toBe(false);
  });
});

describe("UK phone", () => {
  it.each([
    ["07700 900123", "+447700900123"],
    ["+44 7700 900123", "+447700900123"],
    ["0044 20 7946 0958", "+442079460958"],
    ["(020) 7946-0958", "+442079460958"],
  ])("normalises %s to %s", (input, output) => {
    expect(ukPhone.parse(input)).toBe(output);
  });

  it.each(["", "12345", "+1 202 555 0143", "0770090"])(
    "rejects %j",
    (input) => {
      expect(ukPhone.safeParse(input).success).toBe(false);
    },
  );
});

describe("quote request", () => {
  const valid = {
    vehicleType: "car",
    make: "Ford",
    model: "Focus",
    registration: "ab12 cde",
    driveable: "yes",
    collectionPostcode: "sw1a1aa",
    deliveryPostcode: "M1 1AE",
    preferredDate: nextWeek(),
    dateFlexible: false,
    notes: "",
    fullName: "Test Person",
    email: "test@example.com",
    phone: "07700 900123",
    customerType: "private",
    companyName: "",
    privacyAccepted: true,
  } as const;

  it("accepts a complete request and cleans it up", () => {
    const result = quoteRequestSchema.parse(valid);
    expect(result.registration).toBe("AB12 CDE");
    expect(result.collectionPostcode).toBe("SW1A 1AA");
    expect(result.phone).toBe("+447700900123");
  });

  it("rejects a date in the past", () => {
    const r = quoteRequestSchema.safeParse({
      ...valid,
      preferredDate: "2020-01-01",
    });
    expect(r.success).toBe(false);
  });

  it("requires the privacy policy to be accepted", () => {
    const r = quoteRequestSchema.safeParse({
      ...valid,
      privacyAccepted: false,
    });
    expect(r.success).toBe(false);
  });

  it("rejects values outside the allowed options", () => {
    const r = quoteRequestSchema.safeParse({ ...valid, vehicleType: "plane" });
    expect(r.success).toBe(false);
  });
});

describe("contact message", () => {
  const valid = {
    fullName: "Test Person",
    email: "test@example.com",
    phone: "",
    subject: "general",
    message: "Hello, I have a question.",
    privacyAccepted: true,
  } as const;

  it("accepts a message with no phone number", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a message that is too short", () => {
    expect(contactSchema.safeParse({ ...valid, message: "Hi" }).success).toBe(
      false,
    );
  });

  it("rejects an invalid email", () => {
    expect(
      contactSchema.safeParse({ ...valid, email: "not-an-email" }).success,
    ).toBe(false);
  });
});

describe("file rules (server side)", () => {
  const driver = {
    fullName: "Test Person",
    email: "test@example.com",
    phone: "07700 900123",
    postcode: "M1 1AE",
    experience: "3-5",
    availability: "flexible",
    about: "",
    rightToWork: true,
    privacyAccepted: true,
    cv: [{ name: "cv.pdf", size: 1000, type: "application/pdf" }],
    licence: [{ name: "licence.jpg", size: 1000, type: "image/jpeg" }],
  } as const;

  it("accepts a CV and licence within the limits", () => {
    expect(driverApplicationSchema.safeParse(driver).success).toBe(true);
  });

  it("requires a CV", () => {
    expect(
      driverApplicationSchema.safeParse({ ...driver, cv: [] }).success,
    ).toBe(false);
  });

  it("rejects a file type that is not allowed", () => {
    const r = driverApplicationSchema.safeParse({
      ...driver,
      cv: [{ name: "cv.exe", size: 1000, type: "application/x-msdownload" }],
    });
    expect(r.success).toBe(false);
  });

  it("rejects a file over 5 MB", () => {
    const r = driverApplicationSchema.safeParse({
      ...driver,
      cv: [{ name: "cv.pdf", size: 6 * 1024 * 1024, type: "application/pdf" }],
    });
    expect(r.success).toBe(false);
  });

  it("allows at most 5 incident photos", () => {
    const photo = { name: "p.jpg", size: 1000, type: "image/jpeg" };
    const base = {
      fullName: "Test Person",
      email: "test@example.com",
      phone: "07700 900123",
      jobReference: "",
      incidentType: "damage",
      incidentDate: "2026-01-10",
      location: "Manchester",
      vehicleRegistration: "",
      description: "A scratch was found on the rear bumper.",
      privacyAccepted: true,
    } as const;
    expect(
      incidentSchema.safeParse({ ...base, photos: Array(5).fill(photo) })
        .success,
    ).toBe(true);
    expect(
      incidentSchema.safeParse({ ...base, photos: Array(6).fill(photo) })
        .success,
    ).toBe(false);
  });
});
