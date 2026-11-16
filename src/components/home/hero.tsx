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

      <Container className="grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-[minmax(0,16rem)_1fr_minmax(0,16rem)] lg:gap-6 lg:py-20 xl:grid-cols-[minmax(0,19rem)_1fr_minmax(0,19rem)]">
        {/* Left: headline */}
        <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
          <p className="text-sm font-semibold tracking-[0.25em] text-gold uppercase">
            UK vehicle delivery specialists
          </p>
          <h1 className="max-w-xl text-4xl leading-[1.1] font-semibold text-balance sm:text-5xl lg:text-4xl xl:text-5xl">
            Your vehicle, delivered{" "}
            <span className="text-gold">anywhere in the UK</span>
          </h1>
        </div>

        {/* Middle: the car */}
        <CarStage />

        {/* Right: details and call to action */}
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <p className="max-w-md text-lg text-pretty text-grey-400 lg:text-base">
            Professional drivers collect your car or van and deliver it
            door-to-door, safely and on time, for dealers, businesses and
            private owners.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:w-full lg:flex-col">
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
