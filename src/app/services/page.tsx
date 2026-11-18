import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, MessageCircleQuestion } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ServicesNav } from "@/components/services/services-nav";
import { PhotoHero } from "@/components/site/photo-hero";
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
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PhotoHero
        eyebrow="Our services"
        title="Every move"
        emphasis="handled with care"
        description="Whatever you need moving, from a single car to regular trade movements."
        image={{ src: "/gallery/cotswolds.jpg" }}
      />

      <ServicesNav items={services.map(({ id, title }) => ({ id, title }))} />

      {services.map((service, i) => {
        const Icon = service.icon;
        const number = String(i + 1).padStart(2, "0");
        const flipped = i % 2 === 1;
        return (
          <section
            key={service.id}
            id={service.id}
            aria-labelledby={`${service.id}-title`}
            // Keep the heading clear of the sticky header and services menu
            className={cn(
              "scroll-mt-36 overflow-clip py-16 sm:py-24",
              flipped && "bg-grey-100",
            )}
          >
            <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Photo: opens up as it scrolls in, then drifts (parallax) */}
              <div
                className={cn(
                  "image-reveal group relative aspect-[4/3] overflow-clip rounded-2xl bg-ink shadow-xl shadow-ink/15",
                  flipped && "lg:order-last",
                )}
              >
                <div className="parallax-view absolute inset-x-0 -top-[12%] h-[124%]">
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-ink/60 via-transparent to-transparent"
                />
                <span className="absolute bottom-5 left-5 flex size-14 items-center justify-center rounded-xl bg-ink/80 text-gold ring-1 ring-gold/40 backdrop-blur-sm">
                  <Icon className="size-7" aria-hidden="true" />
                </span>
                <span
                  aria-hidden="true"
                  className="absolute right-5 bottom-3 font-geo text-6xl font-bold text-paper/90 tabular-nums sm:text-7xl"
                >
                  {number}
                </span>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-6">
                <p className="scroll-reveal flex items-center gap-3 font-geo text-xs font-medium tracking-[0.3em] text-gold-dark uppercase">
                  <span aria-hidden="true" className="h-px w-10 bg-gold-dark" />
                  Service {number} / {String(services.length).padStart(2, "0")}
                </p>
                <h2
                  id={`${service.id}-title`}
                  className="scroll-reveal text-3xl font-semibold text-balance sm:text-4xl"
                >
                  {service.title}
                </h2>
                <p className="scroll-reveal text-lg text-pretty text-muted-foreground">
                  {service.details}
                </p>
                <ul className="flex flex-col gap-3">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className="scroll-reveal flex items-center gap-4 rounded-xl border border-ink/5 bg-card px-5 py-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-md"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                        <Check className="size-4" aria-hidden="true" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant="accent"
                  size="xl"
                  className="scroll-reveal w-fit rounded-full px-7 font-geo text-sm font-medium tracking-[0.15em] uppercase"
                >
                  <Link href={siteConfig.quoteLink.href} className="group/cta">
                    Get a quote
                    <span className="sr-only">
                      {" "}
                      for {service.title.toLowerCase()}
                    </span>
                    <ArrowRight
                      data-icon="inline-end"
                      aria-hidden="true"
                      className="transition-transform group-hover/cta:translate-x-1"
                    />
                  </Link>
                </Button>
              </div>
            </Container>
          </section>
        );
      })}

      {/* FAQ: heading on the left (stays in view), questions on the right */}
      <section
        id="faq"
        aria-labelledby="faq-title"
        className="scroll-mt-36 bg-grey-100 py-20 sm:py-28"
      >
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div className="scroll-reveal flex flex-col gap-5 lg:sticky lg:top-32 lg:self-start">
            <p className="flex items-center gap-3 font-geo text-xs font-medium tracking-[0.3em] text-gold-dark uppercase">
              <span aria-hidden="true" className="h-px w-10 bg-gold-dark" />
              FAQ
            </p>
            <h2
              id="faq-title"
              className="text-3xl font-semibold text-balance sm:text-4xl"
            >
              Frequently asked questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Can&apos;t find what you&apos;re looking for? We&apos;re happy to
              help.
            </p>
            <Link
              href="/contact"
              className="group inline-flex w-fit items-center gap-2 font-medium text-gold-dark underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <MessageCircleQuestion className="size-5" aria-hidden="true" />
              Ask us a question
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
          <Accordion
            type="single"
            collapsible
            className="flex w-full flex-col gap-3"
          >
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.question}
                value={`faq-${i}`}
                className="scroll-reveal rounded-xl border border-ink/10 bg-card px-5 shadow-sm transition-all last:border-b hover:border-gold/60 data-[state=open]:border-gold-dark data-[state=open]:shadow-md"
              >
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline [&>svg]:text-gold-dark">
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
    </>
  );
}
