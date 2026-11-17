import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";

import { Container } from "@/components/layout/container";
import { RoadAnimation } from "@/components/site/road-animation";
import { TransporterTruck } from "@/components/site/transporter-truck";
import { siteConfig } from "@/config/site";

/**
 * Contact page header, in place of the usual title band and breadcrumb:
 * light warm background, big "Let's move it." headline, a dashed road
 * where a car transporter drives across and loops round, a call button
 * and a round "Get a free quote" button.
 */
export function ContactHero() {
  const { phone } = siteConfig.contact;

  return (
    <section
      // Pulled up under the transparent header (h-20); light, so the
      // header switches to dark text automatically.
      className="-mt-20 overflow-hidden bg-[color-mix(in_oklch,var(--gold)_16%,var(--paper))] pt-20 text-ink"
    >
      <Container className="flex flex-col pt-14 pb-12 sm:pt-20 sm:pb-16">
        <p className="flex items-center gap-4 font-geo text-xs font-medium tracking-[0.3em] text-gold-dark uppercase sm:text-sm">
          <span aria-hidden="true" className="h-px w-10 bg-gold-dark sm:w-14" />
          Contact us
        </p>
        <h1 className="mt-4 font-geo text-5xl leading-none font-medium tracking-[0.02em] uppercase sm:text-7xl xl:text-8xl">
          Let&apos;s move it.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-pretty text-ink/75">
          Questions about a delivery, a booking or a trade account? We&apos;re
          happy to help.
        </p>

        {/* The road: a dashed line with a truck driving along it */}
        <RoadAnimation className="road relative my-8 h-14 sm:my-10 sm:h-20">
          <span className="absolute inset-x-0 bottom-1.5 border-t-[3px] border-dashed border-ink/80" />
          <TransporterTruck className="truck-drive absolute bottom-2.5 w-28 sm:w-40" />
        </RoadAnimation>

        <div className="flex flex-wrap items-center justify-between gap-6">
          {phone ? (
            <a
              href={phone.href}
              className="inline-flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 font-medium transition-colors hover:bg-ink hover:text-paper focus-visible:ring-3 focus-visible:ring-gold/60 focus-visible:outline-none"
            >
              <Phone className="size-4" aria-hidden="true" />
              Call {phone.label}
            </a>
          ) : (
            <span />
          )}

          <Link
            href={siteConfig.quoteLink.href}
            className="group flex items-center gap-4 rounded-full focus-visible:ring-3 focus-visible:ring-gold/60 focus-visible:outline-none"
          >
            <span className="font-geo text-sm font-medium tracking-[0.15em] uppercase">
              {siteConfig.quoteLink.title}
            </span>
            <span className="flex size-16 items-center justify-center rounded-full bg-ink text-gold transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none sm:size-20">
              <ArrowUpRight className="size-7 sm:size-8" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
