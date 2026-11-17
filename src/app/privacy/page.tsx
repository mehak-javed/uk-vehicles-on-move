import type { Metadata } from "next";
import Link from "next/link";

import {
  LegalPage,
  Tbc,
  type LegalSection,
} from "@/components/legal/legal-page";
import { siteConfig } from "@/config/site";
import { LEGAL_LAST_UPDATED, LEGAL_LAST_UPDATED_ISO } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How UK Vehicles On Move collects, uses and protects your personal information.",
};

// Draft wording for client review. Not legal advice: to be checked before launch.
export default function PrivacyPage() {
  const { name } = siteConfig;
  const email = siteConfig.contact.email;
  const contact = email ? (
    <a href={`mailto:${email}`}>{email}</a>
  ) : (
    <Tbc>contact email</Tbc>
  );

  const sections: LegalSection[] = [
    {
      id: "who-we-are",
      title: "Who we are",
      content: (
        <>
          <p>
            {name} (<Tbc>registered company name</Tbc>, company number{" "}
            <Tbc>number</Tbc>) is the controller of the personal information
            described in this policy. We are registered with the Information
            Commissioner&apos;s Office (ICO) under number{" "}
            <Tbc>ICO registration number</Tbc>.
          </p>
          <p>For any privacy question or request, contact us at {contact}.</p>
        </>
      ),
    },
    {
      id: "what-we-collect",
      title: "What we collect",
      content: (
        <>
          <p>We only collect what we need for each request:</p>
          <ul>
            <li>
              <strong>Quote requests:</strong> your name, email, phone number,
              whether you are a private or trade customer (and company name),
              vehicle details (type, make, model, registration, whether it can
              be driven), collection and delivery postcodes, preferred date and
              any notes.
            </li>
            <li>
              <strong>Contact messages:</strong> your name, email, phone number
              (optional), subject and message.
            </li>
            <li>
              <strong>Driver applications:</strong> your name, email, phone
              number, home postcode, driving experience, availability, your CV
              and a copy of your driving licence, and confirmation of your right
              to work in the UK.
            </li>
            <li>
              <strong>Incident reports:</strong> your name, email, phone number,
              job reference, vehicle registration, date and location, a
              description and any photos you upload.
            </li>
            <li>
              <strong>Website use:</strong> if you accept analytics cookies,
              anonymous statistics about how pages are used. See our{" "}
              <Link href="/cookies">cookie policy</Link>.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "how-we-use-it",
      title: "How we use it and why",
      content: (
        <ul>
          <li>
            <strong>To quote for and deliver your vehicle</strong>, and to keep
            you updated. This is necessary to take steps at your request before
            entering into a contract, and to perform that contract.
          </li>
          <li>
            <strong>To answer your messages</strong>, based on our legitimate
            interest in responding to enquiries.
          </li>
          <li>
            <strong>To assess driver applications</strong>, including checking
            your licence and right to work. This is needed before entering into
            an agreement with you and to meet our legal obligations.
          </li>
          <li>
            <strong>To investigate incidents</strong> and handle any insurance
            claims, based on our legitimate interests and, where relevant, to
            establish or defend legal claims.
          </li>
          <li>
            <strong>To improve the website</strong> using anonymous statistics,
            only with your consent.
          </li>
        </ul>
      ),
    },
    {
      id: "who-we-share-with",
      title: "Who we share it with",
      content: (
        <>
          <p>
            We do not sell your information. We use trusted service providers
            who process it on our behalf and only as we instruct:
          </p>
          <ul>
            <li>Website hosting (Netlify)</li>
            <li>Sending emails (Resend) and our business email (Zoho Mail)</li>
            <li>Secure storage of uploaded files (Cloudinary)</li>
            <li>Database hosting (Neon)</li>
            <li>Spam protection and privacy-friendly analytics (Cloudflare)</li>
          </ul>
          <p>
            Where needed, we may also share information with our insurers{" "}
            <Tbc>insurer details</Tbc>, the drivers handling your job, or the
            authorities when the law requires it.
          </p>
          <p>
            Some providers process data outside the UK. Where this happens, we
            make sure appropriate safeguards are in place, such as UK adequacy
            regulations or the UK International Data Transfer Agreement.
          </p>
        </>
      ),
    },
    {
      id: "how-long-we-keep-it",
      title: "How long we keep it",
      content: (
        <ul>
          <li>
            Quote requests that do not go ahead: <Tbc>12 months</Tbc>
          </li>
          <li>
            Contact messages: <Tbc>12 months</Tbc>
          </li>
          <li>
            Unsuccessful driver applications, including CV and licence copies:{" "}
            <Tbc>6 months</Tbc>
          </li>
          <li>
            Completed jobs and incident reports: <Tbc>6 years</Tbc>, for
            accounting and legal claims
          </li>
        </ul>
      ),
    },
    {
      id: "keeping-it-safe",
      title: "Keeping it safe",
      content: (
        <p>
          The website uses encrypted connections (HTTPS). Uploaded documents and
          photos are stored as private files that can only be opened through
          short-lived secure links, and access to your information is limited to
          the people who need it.
        </p>
      ),
    },
    {
      id: "your-rights",
      title: "Your rights",
      content: (
        <>
          <p>Under UK data protection law you have the right to:</p>
          <ul>
            <li>ask for a copy of the information we hold about you</li>
            <li>ask us to correct or delete it</li>
            <li>object to, or ask us to restrict, how we use it</li>
            <li>ask for it to be transferred to you or another organisation</li>
            <li>withdraw your consent at any time, where we rely on consent</li>
          </ul>
          <p>
            To use any of these rights, contact us at {contact}. If you are
            unhappy with how we have handled your information, you can complain
            to the ICO at{" "}
            <a
              href="https://ico.org.uk"
              target="_blank"
              rel="noopener noreferrer"
            >
              ico.org.uk
            </a>
            .
          </p>
        </>
      ),
    },
    {
      id: "changes",
      title: "Changes to this policy",
      content: (
        <p>
          We may update this policy from time to time. The date at the top of
          this page shows when it was last changed.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      title="Privacy policy"
      breadcrumb="Privacy policy"
      intro="How we collect, use and protect your personal information."
      lastUpdated={LEGAL_LAST_UPDATED}
      lastUpdatedIso={LEGAL_LAST_UPDATED_ISO}
      sections={sections}
    />
  );
}
