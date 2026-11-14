import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { CtaBand } from "@/components/site/cta-band";
import { PageHeader } from "@/components/site/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { faqs, services } from "@/content/services";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Door-to-door, same-day, insured, nationwide and trade vehicle delivery across the UK. Get a free, no-obligation quote.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Services"
        title="Our services"
        description="Whatever you need moving, from a single car to regular trade movements."
      />

      {/* Quick links to each service */}
      <nav
        aria-label="Services on this page"
        className="border-b border-border"
      >
        <Container>
          <ul className="flex gap-2 overflow-x-auto py-4">
            {services.map((s) => (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-gold-dark focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {services.map((service, i) => {
        const Icon = service.icon;
        return (
          <section
            key={service.id}
            id={service.id}
            aria-labelledby={`${service.id}-title`}
            // Keep the heading visible below the sticky header when jumped to
            className={cn(
              "scroll-mt-24 py-16 sm:py-20",
              i % 2 === 1 && "bg-grey-100",
            )}
          >
            <Container className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
              <div className="flex flex-col gap-5">
                <span className="flex size-14 items-center justify-center rounded-xl bg-ink text-gold">
                  <Icon className="size-7" aria-hidden="true" />
                </span>
                <h2
                  id={`${service.id}-title`}
                  className="text-3xl font-semibold sm:text-4xl"
                >
                  {service.title}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {service.details}
                </p>
                <Button
                  asChild
                  variant="accent"
                  size="lg"
                  className="w-fit px-5"
                >
                  <Link href={siteConfig.quoteLink.href}>
                    Get a quote
                    <span className="sr-only">
                      {" "}
                      for {service.title.toLowerCase()}
                    </span>
                    <ArrowRight data-icon="inline-end" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
              <ul className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 sm:p-8">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-gold-dark"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        );
      })}

      {/* FAQ */}
      <section
        id="faq"
        aria-label="Frequently asked questions"
        className="scroll-mt-24 border-t border-border py-20 sm:py-24"
      >
        <Container size="narrow" className="flex flex-col gap-10">
          <SectionHeading
            align="center"
            eyebrow="FAQ"
            title="Frequently asked questions"
          />
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.question} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
