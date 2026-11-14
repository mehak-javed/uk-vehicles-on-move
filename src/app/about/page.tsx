import type { Metadata } from "next";
import {
  CheckCircle2,
  Handshake,
  MessageCircle,
  ShieldCheck,
  Timer,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { CtaBand } from "@/components/site/cta-band";
import { PageHeader } from "@/components/site/page-header";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Who we are and how we work: professional vehicle delivery across the UK for dealers, businesses and private owners.",
};

// Draft copy for client review: replace with the company's own story.
const values = [
  {
    title: "Reliability",
    text: "We turn up when we say we will and keep you updated if anything changes.",
    icon: Timer,
  },
  {
    title: "Care",
    text: "Every vehicle is treated as if it were our own, from collection to handover.",
    icon: ShieldCheck,
  },
  {
    title: "Honesty",
    text: "Clear prices agreed up front, with no hidden extras.",
    icon: Handshake,
  },
  {
    title: "Communication",
    text: "One point of contact who answers your questions quickly.",
    icon: MessageCircle,
  },
];

const reasons = [
  "Door-to-door service with no depots or transfers",
  "Professional drivers who check your vehicle's condition at collection and delivery",
  "Free, no-obligation quotes with clear pricing",
  "Trade and private customers welcome",
  "Local, long-distance and same-day options",
  "Easy to reach by phone, WhatsApp or email",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        breadcrumb="About"
        title="About us"
        description="Professional vehicle delivery across the UK for dealers, businesses and private owners."
      />

      {/* Story */}
      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Our story"
            title="Moving vehicles, the right way"
          />
          <div className="flex flex-col gap-5 text-lg text-muted-foreground">
            <p>
              {siteConfig.name} was set up to make moving a vehicle simple.
              Whether you&apos;ve bought a car online, run a busy dealership or
              need a van moved between sites, you deserve a service that is easy
              to book, clearly priced and dependable.
            </p>
            <p>
              Our drivers collect your vehicle and drive it directly to its
              destination. You deal with one team from your first quote to the
              moment the keys are handed over.
            </p>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="bg-grey-100 py-20 sm:py-24">
        <Container className="flex flex-col gap-12">
          <SectionHeading
            align="center"
            eyebrow="Our values"
            title="What we stand for"
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ title, text, icon: Icon }) => (
              <li
                key={title}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
              >
                <span className="flex size-12 items-center justify-center rounded-lg bg-ink text-gold">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Why choose us */}
      <section className="py-20 sm:py-24">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Why choose us"
            title="A service built around you"
            description="Here's what you can expect when you move a vehicle with us."
          />
          <ul className="flex flex-col gap-4">
            {reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-3 text-lg">
                <CheckCircle2
                  className="mt-1 size-5 shrink-0 text-gold-dark"
                  aria-hidden="true"
                />
                {reason}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
