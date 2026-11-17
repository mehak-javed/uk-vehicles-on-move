import { siteConfig } from "@/config/site";

/**
 * A simple branded email: heading, intro, a table of details and a closing
 * line. Returns both HTML and plain-text versions. All values are escaped.
 */

export type EmailRow = [label: string, value: string | null | undefined];

type EmailContent = {
  heading: string;
  intro: string;
  rows?: EmailRow[];
  /** Links listed under the details, e.g. uploaded files. */
  links?: { label: string; href: string }[];
  outro?: string;
};

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

export function renderEmail({
  heading,
  intro,
  rows = [],
  links = [],
  outro,
}: EmailContent): { html: string; text: string } {
  const filled = rows.filter(
    (row): row is [string, string] =>
      typeof row[1] === "string" && row[1] !== "",
  );

  const rowsHtml = filled
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #ece7dc;color:#6b6b6b;font-size:14px;vertical-align:top;width:38%">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #ece7dc;color:#111;font-size:14px;white-space:pre-wrap">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  const linksHtml = links.length
    ? `<p style="margin:20px 0 8px;font-size:14px;color:#111"><strong>Files</strong></p>
       <ul style="margin:0;padding-left:20px;font-size:14px">${links
         .map(
           (l) =>
             `<li style="margin:4px 0"><a href="${escapeHtml(l.href)}" style="color:#9a7b2f">${escapeHtml(l.label)}</a></li>`,
         )
         .join("")}</ul>`
    : "";

  const html = `<!doctype html>
<html lang="en-GB">
  <body style="margin:0;padding:24px;background:#f6f3ec;font-family:Arial,Helvetica,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden">
      <tr>
        <td style="background:#0f0f0f;padding:20px 24px;color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:1px">
          ${escapeHtml(siteConfig.name.toUpperCase())}
          <div style="height:3px;width:48px;background:#c9a24a;margin-top:10px"></div>
        </td>
      </tr>
      <tr>
        <td style="padding:24px">
          <h1 style="margin:0 0 12px;font-size:22px;color:#111">${escapeHtml(heading)}</h1>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.5;color:#333">${escapeHtml(intro)}</p>
          ${filled.length ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-top:1px solid #ece7dc">${rowsHtml}</table>` : ""}
          ${linksHtml}
          ${outro ? `<p style="margin:20px 0 0;font-size:15px;line-height:1.5;color:#333">${escapeHtml(outro)}</p>` : ""}
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px;background:#faf8f3;color:#6b6b6b;font-size:12px">
          ${escapeHtml(siteConfig.name)} · ${escapeHtml(siteConfig.tagline)}
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    heading,
    "",
    intro,
    "",
    ...filled.map(([label, value]) => `${label}: ${value}`),
    ...(links.length
      ? ["", "Files:", ...links.map((l) => `- ${l.label}: ${l.href}`)]
      : []),
    ...(outro ? ["", outro] : []),
    "",
    `${siteConfig.name}`,
  ].join("\n");

  return { html, text };
}

/** "2026-11-20" → "Friday 20 November 2026". */
export function formatLongDate(iso: string) {
  const date = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(date);
}

/** Looks up the label for a select/radio value. */
export function labelFor(
  options: readonly { value: string; label: string }[],
  value: string,
) {
  return options.find((o) => o.value === value)?.label ?? value;
}
