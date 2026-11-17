import { afterEach, describe, expect, it, vi } from "vitest";

import { makeReference } from "@/lib/reference";
import { renderEmail } from "@/lib/server/email-template";
import { companyInbox, sendEmail } from "@/lib/server/email";
import { verifyHuman } from "@/lib/server/turnstile";
import { confirmUploads, createTicket, readTicket } from "@/lib/server/uploads";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("references", () => {
  it("look like UVM-Q-XXXXXX and are unique", () => {
    // 20, not more: 6 random hex characters means a large batch can
    // contain a duplicate by chance, which made this test fail now and then.
    const refs = new Set(
      Array.from({ length: 20 }, () => makeReference("UVM-Q")),
    );
    expect(refs.size).toBe(20);
    for (const ref of refs) expect(ref).toMatch(/^UVM-Q-[0-9A-F]{6}$/);
  });
});

describe("email template", () => {
  it("escapes anything typed by the customer", () => {
    const { html, text } = renderEmail({
      heading: "New message",
      intro: "Hello",
      rows: [["Message", '<script>alert("x")</script>']],
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(text).toContain('Message: <script>alert("x")</script>');
  });

  it("leaves out empty rows", () => {
    const { text } = renderEmail({
      heading: "H",
      intro: "I",
      rows: [
        ["Phone", ""],
        ["Name", "Sam"],
      ],
    });
    expect(text).not.toContain("Phone:");
    expect(text).toContain("Name: Sam");
  });
});

describe("sending email", () => {
  it("splits the company inbox list", () => {
    vi.stubEnv("EMAIL_COMPANY_INBOX", " a@example.com, b@example.com ,");
    expect(companyInbox()).toEqual(["a@example.com", "b@example.com"]);
  });

  it("calls Resend with a one-line subject", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);

    const ok = await sendEmail({
      to: ["a@example.com"],
      subject: "Line one\r\nBcc: someone@example.com",
      html: "<p>x</p>",
      text: "x",
    });

    expect(ok).toBe(true);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.subject).toBe("Line one Bcc: someone@example.com");
    expect(body.from).toContain("onboarding@resend.dev");
  });

  it("reports a failure when Resend rejects the email", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("bad", { status: 403 })),
    );
    expect(
      await sendEmail({
        to: ["a@example.com"],
        subject: "s",
        html: "",
        text: "",
      }),
    ).toBe(false);
  });

  it("never calls Resend in test mode", async () => {
    vi.stubEnv("EMAIL_TRANSPORT", "log");
    vi.spyOn(console, "info").mockImplementation(() => {});
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(
      await sendEmail({
        to: ["a@example.com"],
        subject: "s",
        html: "",
        text: "",
      }),
    ).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("spam check", () => {
  it("is skipped when no secret key is set", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await verifyHuman(undefined)).toBe(true);
  });

  it("fails without a token when a secret key is set", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    expect(await verifyHuman(undefined)).toBe(false);
  });

  it("uses Cloudflare's answer", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(Response.json({ success: true }))
        .mockResolvedValueOnce(Response.json({ success: false })),
    );
    expect(await verifyHuman("good")).toBe(true);
    expect(await verifyHuman("bad")).toBe(false);
  });
});

describe("upload tickets", () => {
  const withCloudinary = () => {
    vi.stubEnv("CLOUDINARY_CLOUD_NAME", "demo");
    vi.stubEnv("CLOUDINARY_API_KEY", "123");
    vi.stubEnv("CLOUDINARY_API_SECRET", "secret");
    vi.stubEnv("CLOUDINARY_FOLDER", "uvm/test");
  };

  it("signs one private upload slot per file", () => {
    withCloudinary();
    const result = createTicket("driver", ["cv", "licence"]);
    if (!result.ok) throw new Error("expected a ticket");
    expect(result.slots).toHaveLength(2);
    expect(result.slots[0].params.type).toBe("authenticated");
    expect(result.slots[0].params.public_id).toMatch(
      /^uvm\/test\/driver\/.+\/cv-1$/,
    );
    expect(result.slots[0].params.signature).toBeTruthy();
  });

  it("accepts its own ticket for the right form only", () => {
    withCloudinary();
    const result = createTicket("driver", ["cv"]);
    if (!result.ok) throw new Error("expected a ticket");
    expect(readTicket(result.ticket, "driver")).not.toBeNull();
    expect(readTicket(result.ticket, "incident")).toBeNull();
  });

  it("rejects a tampered ticket", () => {
    withCloudinary();
    const result = createTicket("driver", ["cv"]);
    if (!result.ok) throw new Error("expected a ticket");
    const [payload, signature] = result.ticket.split(".");
    const forged = Buffer.from(
      JSON.stringify({ form: "driver", ids: [], exp: Date.now() + 1e9 }),
    ).toString("base64url");
    expect(readTicket(`${forged}.${signature}`, "driver")).toBeNull();
    expect(
      readTicket(`${payload}.x${signature.slice(1)}`, "driver"),
    ).toBeNull();
  });

  it("rejects an expired ticket", () => {
    withCloudinary();
    const result = createTicket("driver", ["cv"]);
    if (!result.ok) throw new Error("expected a ticket");
    vi.spyOn(Date, "now").mockReturnValue(Date.now() + 2 * 60 * 60 * 1000);
    expect(readTicket(result.ticket, "driver")).toBeNull();
  });

  it("refuses files the ticket did not allow", async () => {
    withCloudinary();
    const result = createTicket("driver", ["cv"]);
    if (!result.ok) throw new Error("expected a ticket");
    const ticket = readTicket(result.ticket, "driver")!;
    const attachments = await confirmUploads(ticket, [
      {
        field: "cv",
        publicId: "someone/else/file",
        resourceType: "image",
        name: "cv.pdf",
      },
    ]);
    expect(attachments).toBeNull();
  });

  it("accepts a form without files even when storage is not set up", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const result = createTicket("incident", []);
    if (!result.ok) throw new Error("expected a ticket");
    const ticket = readTicket(result.ticket, "incident")!;
    expect(await confirmUploads(ticket, [])).toEqual([]);
  });
});
