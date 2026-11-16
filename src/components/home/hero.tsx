import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

import heroCar from "../../../public/home/hero-car-top.png";

const highlights = ["Door-to-door", "Trade & private", "Free quotes"];

/**
 * Car stage: a top-down view of the road with the car standing upright in
 * the middle and lane markings on each side.
 * Only the car is an image (transparent PNG); the road is CSS/SVG.
 */
function CarStage() {
  return (
    <div className="relative mx-auto flex h-[480px] w-[340px] items-center justify-center sm:h-[600px] sm:w-[520px] lg:h-[640px] lg:w-[560px]">
      {/* Road surface */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 w-[78%] -translate-x-1/2 bg-[linear-gradient(to_right,transparent,color-mix(in_oklch,var(--ink-soft)_90%,transparent)_12%,var(--ink-soft)_50%,color-mix(in_oklch,var(--ink-soft)_90%,transparent)_88%,transparent)] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]"
      />
      {/* Lane markings either side of the car */}
      {["left-[18%]", "right-[18%]"].map((side) => (
        <div
          key={side}
          aria-hidden="true"
          className={`absolute inset-y-0 ${side} w-[3px] bg-gold/60 [mask-image:repeating-linear-gradient(to_bottom,black_0_28px,transparent_28px_52px),linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] [mask-composite:intersect] motion-safe:animate-road`}
        />
      ))}
      {/* Faint streaks on the road surface rushing past the car */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 w-[60%] -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,transparent_0_40px,color-mix(in_oklch,var(--paper)_7%,transparent)_40px_44px,transparent_44px_110px,color-mix(in_oklch,var(--paper)_4%,transparent)_110px_112px,transparent_112px_160px)] [mask-image:linear-gradient(to_right,transparent,black_20%,transparent_42%,transparent_58%,black_80%,transparent),linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] [mask-composite:intersect] motion-safe:animate-road-surface motion-reduce:hidden"
      />

      {/* Glow and shadow under the car */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 h-[70%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-[40%] bg-gold/15 blur-3xl"
      />
      {/* The car (and its shadow) drift gently while the road moves past */}
      <div className="relative flex h-[76%] items-center justify-center motion-safe:animate-drive">
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 h-[104%] w-[90%] -translate-x-1/2 -translate-y-[48%] rounded-[40%] bg-black/70 blur-lg"
        />

        {/* The car, seen from above, facing up the road */}
        <Image
          src={heroCar}
          alt=""
          preload
          sizes="(min-width: 640px) 220px, 160px"
          className="relative h-full w-auto animate-in drop-shadow-[0_18px_22px_rgba(0,0,0,0.65)] duration-700 fade-in slide-in-from-bottom-6 motion-reduce:animate-none"
        />
      </div>
    </div>
  );
}

/**
 * Home hero: all text on the left (uppercase headline, service words,
 * description and buttons), the red car driving along the road on the right.
 * On smaller screens the text comes first, then the car.
 */
export function Hero() {
  const { phone } = siteConfig.contact;

  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      {/* Soft light behind the car, like a lit garage floor */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_40%_70%_at_72%_50%,color-mix(in_oklch,var(--paper)_9%,transparent),transparent_70%)]"
      />

      <Container className="grid items-center gap-8 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10 lg:py-16">
        {/* Left: text */}
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <h1 className="font-geo text-4xl leading-[1.05] tracking-[0.04em] uppercase sm:text-5xl xl:text-6xl">
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

          <p className="max-w-md text-base text-pretty text-grey-400 sm:text-lg">
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
            {phone && (
              <a
                href={phone.href}
                className="inline-flex items-center gap-2 rounded-sm font-geo text-sm tracking-[0.1em] text-paper/80 uppercase transition-colors hover:text-gold focus-visible:ring-3 focus-visible:ring-gold/60 focus-visible:outline-none"
              >
                <Phone className="size-4" aria-hidden="true" />
                {phone.label}
              </a>
            )}
          </div>
        </div>

        {/* Right: the car driving along the road */}
        <CarStage />
      </Container>
    </section>
  );
}
