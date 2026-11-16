import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const highlights = ["Door-to-door", "Trade & private", "Free quotes"];

/**
 * Home hero: a full-width background photo (a van driving along an open
 * road) with all text on the left over a dark gradient, so it stays
 * readable. The photo is preloaded because it is the largest element.
 */
export function Hero() {
  return (
    <section
      data-header-dark
      // Pulled up under the sticky navbar (h-20) so the photo shows behind it
      className="relative isolate -mt-20 overflow-hidden bg-ink text-paper"
    >
      <Image
        src="/home/hero-bg.jpeg"
        alt=""
        fill
        preload
        sizes="100vw"
        className="-z-20 object-cover object-[60%_center]"
      />
      {/* Darker at the top so the navbar words stand out over the sky */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-1/2 bg-linear-to-b from-ink/90 via-ink/50 to-transparent"
      />
      {/* Dark on the left for the text, clearer on the right for the road */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,color-mix(in_oklch,var(--ink)_50%,transparent)_0%,color-mix(in_oklch,var(--ink)_35%,transparent)_35%,color-mix(in_oklch,var(--ink)_10%,transparent)_70%,transparent_100%)] max-lg:bg-[linear-gradient(180deg,color-mix(in_oklch,var(--ink)_55%,transparent),color-mix(in_oklch,var(--ink)_40%,transparent)_60%,color-mix(in_oklch,var(--ink)_65%,transparent))]"
      />

      <Container className="flex min-h-svh flex-col justify-center pt-28 pb-16">
        {/* Left: text */}
        <div className="flex flex-col items-center gap-6 text-center [text-shadow:0_2px_12px_rgb(0_0_0/0.55)] lg:items-start lg:text-left">
          <h1 className="font-geo text-4xl leading-[1.05] tracking-[0.04em] uppercase sm:text-5xl xl:text-6xl 2xl:text-7xl">
            <span className="block font-light">Vehicle delivery</span>
            <span className="block font-bold">
              across the <span className="text-gold">UK</span>
            </span>
          </h1>

          <ul
            aria-label="What we offer"
            className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-geo text-xs font-medium tracking-[0.2em] text-paper uppercase lg:justify-start"
          >
            {highlights.map((item, i) => (
              <li key={item} className="flex items-center gap-5">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="size-1 rounded-full bg-gold"
                  />
                )}
                {item}
              </li>
            ))}
          </ul>

          <p className="max-w-md text-base text-pretty text-paper/80 sm:text-lg 2xl:max-w-xl 2xl:text-xl">
            Professional drivers collect your car or van and deliver it
            door-to-door, safely and on time, for dealers, businesses and
            private owners.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row lg:items-center">
            <Button
              asChild
              variant="accent"
              size="xl"
              className="rounded-full px-7 font-geo text-sm font-medium tracking-[0.15em] uppercase"
            >
              <Link href={siteConfig.quoteLink.href}>
                {siteConfig.quoteLink.title}
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
