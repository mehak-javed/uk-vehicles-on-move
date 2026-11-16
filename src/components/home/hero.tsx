import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

import heroPoster from "../../../public/home/hero-drive-poster.jpg";

const highlights = [
  "Trade and private customers",
  "Door-to-door collection and delivery",
  "Free, no-obligation quotes",
];

/**
 * Home hero with a looping background video of a car driving (licensed
 * stock footage). A still frame (the poster) shows first and loads fast;
 * the video plays on top once ready. Visitors who prefer reduced motion
 * only see the still frame.
 */
export function Hero() {
  const { phone } = siteConfig.contact;

  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      {/* Still frame: shown while the video loads, and instead of it for
          reduced-motion visitors */}
      <Image
        src={heroPoster}
        alt=""
        fill
        preload
        sizes="100vw"
        placeholder="blur"
        className="-z-30 object-cover object-[70%_center]"
      />
      <video
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={heroPoster.src}
        className="absolute inset-0 -z-20 size-full object-cover object-[70%_center] motion-reduce:hidden"
      >
        <source src="/home/hero-drive.mp4" type="video/mp4" />
      </video>

      {/* Darken the left side so the text stays readable over the footage */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--ink)_0%,color-mix(in_oklch,var(--ink)_88%,transparent)_35%,color-mix(in_oklch,var(--ink)_45%,transparent)_70%,color-mix(in_oklch,var(--ink)_25%,transparent)_100%)] max-lg:bg-[linear-gradient(180deg,color-mix(in_oklch,var(--ink)_70%,transparent),color-mix(in_oklch,var(--ink)_90%,transparent))]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-linear-to-t from-ink to-transparent"
      />

      <Container className="flex min-h-[560px] flex-col justify-center gap-6 py-20 sm:min-h-[620px] lg:min-h-[680px]">
        <p className="text-sm font-semibold tracking-[0.25em] text-gold uppercase">
          UK vehicle delivery specialists
        </p>
        <h1 className="max-w-2xl text-4xl leading-[1.1] font-semibold text-balance sm:text-5xl lg:text-6xl">
          Your vehicle, delivered{" "}
          <span className="text-gold">anywhere in the UK</span>
        </h1>
        <p className="max-w-xl text-lg text-pretty text-paper/80 sm:text-xl">
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
              className="border-paper/40 bg-ink/30 text-paper backdrop-blur-sm hover:bg-paper/10 hover:text-paper"
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
              <CheckCircle2
                className="size-4 shrink-0 text-gold"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
