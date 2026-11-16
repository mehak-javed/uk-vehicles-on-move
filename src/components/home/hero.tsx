import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

import heroCar from "../../../public/home/hero-car-top.png";

const highlights = [
  "Trade and private customers",
  "Door-to-door collection and delivery",
  "Free, no-obligation quotes",
];

/**
 * Car stage: a top-down view of the road with the car standing upright in
 * the middle, lane markings on each side and a gold ring around the car.
 * Only the car is an image (transparent PNG); the road is CSS/SVG.
 */
function CarStage() {
  return (
    <div className="relative mx-auto flex h-[420px] w-[280px] items-center justify-center sm:h-[520px] sm:w-[340px]">
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
          className={`absolute inset-y-0 ${side} w-[3px] bg-gold/60 [mask-image:repeating-linear-gradient(to_bottom,black_0_28px,transparent_28px_52px),linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] [mask-composite:intersect]`}
        />
      ))}

      {/* Ring around the car */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="absolute top-1/2 left-1/2 size-[86%] -translate-x-1/2 -translate-y-1/2"
      >
        <circle
          cx="100"
          cy="100"
          r="97"
          fill="none"
          className="stroke-gold/40"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx="100"
          cy="100"
          r="97"
          fill="none"
          className="origin-center stroke-gold motion-safe:animate-[spin_14s_linear_infinite]"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="70 540"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Glow and shadow under the car */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 h-[62%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-[40%] bg-gold/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 h-[54%] w-[30%] -translate-x-1/2 -translate-y-[48%] rounded-[40%] bg-black/70 blur-lg"
      />

      {/* The car, seen from above */}
      <Image
        src={heroCar}
        alt=""
        preload
        sizes="(min-width: 640px) 120px, 100px"
        className="relative h-[52%] w-auto animate-in drop-shadow-[0_18px_22px_rgba(0,0,0,0.65)] duration-700 fade-in slide-in-from-bottom-6 motion-reduce:animate-none"
      />
    </div>
  );
}

/**
 * Home hero. On large screens: headline on the left, the car in the
 * middle, call to action on the right. On smaller screens these stack.
 */
export function Hero() {
  const { phone } = siteConfig.contact;

  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      {/* Soft gold light behind the car */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_45%_60%_at_50%_50%,color-mix(in_oklch,var(--gold)_14%,transparent),transparent_70%)]"
      />

      <Container className="grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-[1fr_auto_1fr] lg:gap-8 lg:py-20">
        {/* Left: headline */}
        <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
          <p className="text-sm font-semibold tracking-[0.25em] text-gold uppercase">
            UK vehicle delivery specialists
          </p>
          <h1 className="max-w-xl text-4xl leading-[1.1] font-semibold text-balance sm:text-5xl xl:text-6xl">
            Your vehicle, delivered{" "}
            <span className="text-gold">anywhere in the UK</span>
          </h1>
        </div>

        {/* Middle: the car */}
        <CarStage />

        {/* Right: details and call to action */}
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <p className="max-w-md text-lg text-pretty text-grey-400">
            Professional drivers collect your car or van and deliver it
            door-to-door, safely and on time, for dealers, businesses and
            private owners.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
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
          <ul className="flex flex-col gap-3 text-sm text-paper/90">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2
                  className="size-4 shrink-0 text-gold"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
