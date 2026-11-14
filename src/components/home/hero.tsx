import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

/**
 * Hero background photo. Leave null until the client supplies a photo (or a
 * licensed stock image is chosen): the hero then uses a pure-CSS background,
 * which keeps LCP fast because the headline text is the largest element.
 * When set, put the file in /public and it is preloaded via next/image.
 */
const HERO_IMAGE: { src: string; alt: string } | null = null;

const highlights = [
  "Trade and private customers",
  "Door-to-door collection and delivery",
  "Free, no-obligation quotes",
];

export function Hero() {
  const { phone } = siteConfig.contact;

  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      {HERO_IMAGE ? (
        <>
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fill
            preload
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        </>
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklch,var(--gold)_22%,transparent),transparent_55%),radial-gradient(ellipse_at_bottom_left,var(--ink-soft),var(--ink)_70%)]"
        >
          {/* Road lane markings: a subtle motion motif */}
          <div className="absolute inset-y-0 right-[12%] hidden w-1 bg-[repeating-linear-gradient(to_bottom,color-mix(in_oklch,var(--gold)_45%,transparent)_0_40px,transparent_40px_80px)] opacity-60 md:block" />
          <div className="absolute inset-y-0 right-[28%] hidden w-px bg-paper/10 md:block" />
        </div>
      )}

      <Container className="flex flex-col gap-8 py-20 sm:py-28 lg:py-36">
        <p className="text-sm font-semibold tracking-[0.25em] text-gold uppercase">
          UK vehicle delivery specialists
        </p>
        <h1 className="max-w-3xl text-4xl leading-[1.1] font-semibold text-balance sm:text-5xl lg:text-6xl">
          Your vehicle, delivered{" "}
          <span className="text-gold">anywhere in the UK</span>
        </h1>
        <p className="max-w-xl text-lg text-pretty text-grey-400 sm:text-xl">
          Professional drivers collect your car or van and deliver it
          door-to-door, safely and on time, for dealers, businesses and private
          owners.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="accent" size="xl">
            <Link href={siteConfig.quoteLink.href}>
              {siteConfig.quoteLink.title}
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Link>
          </Button>
          {phone && (
            <Button
              asChild
              variant="outline"
              size="xl"
              className="border-paper/30 bg-transparent text-paper hover:bg-paper/10 hover:text-paper"
            >
              <a href={phone.href}>
                <Phone data-icon="inline-start" aria-hidden="true" />
                Call {phone.label}
              </a>
            </Button>
          )}
        </div>
        <ul className="flex flex-col gap-3 pt-2 text-sm text-paper/90 sm:flex-row sm:flex-wrap sm:gap-6">
          {highlights.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-gold" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
