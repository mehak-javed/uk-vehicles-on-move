import type { Metadata } from "next";
import Link from "next/link";

import { CookieSettings } from "@/components/legal/cookie-settings";
import {
  LegalPage,
  Tbc,
  type LegalSection,
} from "@/components/legal/legal-page";
import { siteConfig } from "@/config/site";
import { LEGAL_LAST_UPDATED, LEGAL_LAST_UPDATED_ISO } from "@/content/legal";

export const metadata: Metadata = {
  title: "Cookie policy",
  description:
    "Which cookies and similar technologies UK Vehicles On Move uses, and how to change your choice.",
};

const cellClass = "border-b border-border px-3 py-2 align-top";

function CookieTable({
  rows,
}: {
  rows: { name: string; provider: string; purpose: string; expiry: string }[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-xl text-left text-sm">
        <thead className="bg-muted">
          <tr>
            <th scope="col" className={cellClass}>
              Name
            </th>
            <th scope="col" className={cellClass}>
              Provider
            </th>
            <th scope="col" className={cellClass}>
              Purpose
            </th>
            <th scope="col" className={cellClass}>
              Expires
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="last:[&>td]:border-b-0">
              <td className={`${cellClass} font-mono text-xs`}>{row.name}</td>
              <td className={cellClass}>{row.provider}</td>
              <td className={cellClass}>{row.purpose}</td>
              <td className={cellClass}>{row.expiry}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Draft wording for client review. Not legal advice: to be checked before launch.
export default function CookiesPage() {
  const { name } = siteConfig;
  const email = siteConfig.contact.email;
  const contact = email ? (
    <a href={`mailto:${email}`}>{email}</a>
  ) : (
    <Tbc>contact email</Tbc>
  );

  const sections: LegalSection[] = [
    {
      id: "your-choice",
      title: "Your cookie choice",
      content: (
        <>
          <p>
            You can change or withdraw your choice at any time. Pressing the
            button below brings the cookie banner back so you can choose again.
          </p>
          <CookieSettings />
        </>
      ),
    },
    {
      id: "what-are-cookies",
      title: "What cookies are",
      content: (
        <p>
          Cookies are small files that a website saves on your device. Similar
          technologies, such as your browser&apos;s local storage, work in the
          same way. In this policy we call them all &quot;cookies&quot;.
        </p>
      ),
    },
    {
      id: "strictly-necessary",
      title: "Strictly necessary cookies",
      content: (
        <>
          <p>
            These are needed for the website to work and to keep it secure, so
            they cannot be switched off. They do not need your consent.
          </p>
          <CookieTable
            rows={[
              {
                name: "uvm-cookie-consent",
                provider: name,
                purpose:
                  "Remembers your cookie choice so we do not ask again on every page. Stored in your browser's local storage.",
                expiry: "Until you clear it",
              },
              {
                name: "cf_clearance / __cf_bm",
                provider: "Cloudflare",
                purpose: "Protects our forms from spam and automated abuse.",
                expiry: "Up to 30 minutes",
              },
            ]}
          />
          <p>
            <Tbc>Confirm the final list once spam protection is live</Tbc>
          </p>
        </>
      ),
    },
    {
      id: "analytics",
      title: "Analytics",
      content: (
        <>
          <p>
            Only if you accept, we measure how the website is used (for example,
            which pages are visited most) so we can improve it. These statistics
            are anonymous and are not used to identify you or for advertising.
          </p>
          <p>
            Provider: <Tbc>analytics provider and cookie names</Tbc>
          </p>
        </>
      ),
    },
    {
      id: "advertising",
      title: "Advertising cookies",
      content: (
        <p>
          We do not use advertising or tracking cookies, and we do not sell your
          information.
        </p>
      ),
    },
    {
      id: "managing-cookies",
      title: "Managing cookies in your browser",
      content: (
        <p>
          Most browsers let you see, block and delete cookies in their settings.
          If you block strictly necessary cookies, some parts of the website,
          such as our forms, may not work. You can find guidance at{" "}
          <a
            href="https://ico.org.uk/for-the-public/online/cookies/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ico.org.uk
          </a>
          .
        </p>
      ),
    },
    {
      id: "more-information",
      title: "More information",
      content: (
        <p>
          For how we handle personal information, read our{" "}
          <Link href="/privacy">privacy policy</Link>. For any questions,
          contact us at {contact}.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      title="Cookie policy"
      breadcrumb="Cookie policy"
      intro="Which cookies we use, why, and how to change your choice."
      lastUpdated={LEGAL_LAST_UPDATED}
      lastUpdatedIso={LEGAL_LAST_UPDATED_ISO}
      sections={sections}
      draft
    />
  );
}
