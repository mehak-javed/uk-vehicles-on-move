import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { siteConfig } from "@/config/site";
import { LEGAL_LAST_UPDATED, LEGAL_LAST_UPDATED_ISO } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms & conditions",
  description:
    "The terms that apply when you use this website or book a vehicle delivery with UK Vehicles On Move.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const { name } = siteConfig;
  const email = siteConfig.contact.email;
  const contact = email ? (
    <a href={`mailto:${email}`}>{email}</a>
  ) : (
    <Link href="/contact">our contact form</Link>
  );

  const sections: LegalSection[] = [
    {
      id: "about-these-terms",
      title: "About these terms",
      content: (
        <>
          <p>
            These terms apply when you use this website and when you book a
            vehicle collection and delivery with {name}.
          </p>
          <p>
            Please read them before booking. If you are a business customer, any
            separate written agreement we make with you takes priority over
            these terms.
          </p>
        </>
      ),
    },
    {
      id: "quotes-and-bookings",
      title: "Quotes and bookings",
      content: (
        <ul>
          <li>
            A quote request on this website is not a booking. We will reply with
            a price and how long it is valid for.
          </li>
          <li>
            A booking is confirmed only when we confirm it to you in writing
            (for example, by email).
          </li>
          <li>
            Our price is based on the details you give us. If the vehicle,
            addresses or condition are different (for example, it cannot be
            driven), we may need to change the price or the date.
          </li>
        </ul>
      ),
    },
    {
      id: "your-responsibilities",
      title: "Your responsibilities",
      content: (
        <>
          <p>When you book with us, you confirm that:</p>
          <ul>
            <li>
              you own the vehicle or have the owner&apos;s permission to have it
              moved
            </li>
            <li>
              the vehicle is roadworthy, taxed and has a valid MOT where needed,
              or you have told us that it is not
            </li>
            <li>
              personal belongings have been removed (we are not responsible for
              items left inside)
            </li>
            <li>
              someone will be available with the keys and any documents at the
              agreed collection and delivery times
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "collection-and-delivery",
      title: "Collection and delivery",
      content: (
        <>
          <p>
            We will collect and deliver your vehicle on the agreed date. Times
            are estimates: traffic, weather and other events outside our control
            can cause delays, and we will keep you updated.
          </p>
          <p>
            Our driver will check the vehicle&apos;s condition with you at
            collection and at delivery, and record it with photos. Please check
            the vehicle at delivery and tell the driver about any concern
            straight away.
          </p>
        </>
      ),
    },
    {
      id: "damage-and-insurance",
      title: "Damage and insurance",
      content: (
        <>
          <p>
            Your vehicle is covered by our insurance while it is in our care.
          </p>
          <p>
            If something goes wrong, please{" "}
            <Link href="/report-incident">report the incident</Link> as soon as
            possible after delivery, with photos if you can. We are not
            responsible for wear and tear, mechanical or electrical faults that
            were already present, or damage recorded at collection.
          </p>
        </>
      ),
    },
    {
      id: "cancellations",
      title: "Changes and cancellations",
      content: (
        <p>
          You can change or cancel a booking by contacting us. If you cancel at
          short notice, we may charge for costs we have already incurred. If we
          have to cancel, we will offer you a new date or a full refund of
          anything you have paid for that job.
        </p>
      ),
    },
    {
      id: "liability",
      title: "Our liability",
      content: (
        <p>
          Nothing in these terms limits our liability where the law does not
          allow it, including for death or personal injury caused by our
          negligence, or for fraud. If you are a consumer, these terms do not
          affect your legal rights.
        </p>
      ),
    },
    {
      id: "using-this-website",
      title: "Using this website",
      content: (
        <p>
          We try to keep the information on this website accurate and up to
          date, but it is for general information only. The text, photos and
          logo belong to us or are used with permission and may not be copied
          without our consent. How we handle your information is explained in
          our <Link href="/privacy">privacy policy</Link> and{" "}
          <Link href="/cookies">cookie policy</Link>.
        </p>
      ),
    },
    {
      id: "complaints-and-law",
      title: "Complaints and governing law",
      content: (
        <p>
          If you are unhappy with our service, contact us at {contact} and we
          will do our best to put it right. These terms are governed by the law
          of England and Wales, and the courts of England and Wales will deal
          with any dispute. If you live in Scotland or Northern Ireland, you may
          also bring a claim in your local courts.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      title="Terms & conditions"
      breadcrumb="Terms & conditions"
      intro="The terms that apply when you use this website or book a vehicle delivery with us."
      lastUpdated={LEGAL_LAST_UPDATED}
      lastUpdatedIso={LEGAL_LAST_UPDATED_ISO}
      sections={sections}
    />
  );
}
