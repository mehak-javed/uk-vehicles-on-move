"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export type ScrollerService = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: { src: string; alt: string };
  icon: React.ReactNode;
};

/** Pinned (horizontal) mode: large screens, motion allowed. */
const PIN_QUERY =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * Services as a horizontal row of cards.
 *
 * Large screens: the section pins to the top of the screen and scrolling
 * down moves the cards to the left (1 px down = 1 px left), with a gold
 * progress bar. The section's height is measured from the track's width,
 * so the speed stays natural at any size. Scrolling back up moves the
 * cards back; at the top everything is back at the start.
 *
 * Phones, tablets and reduced motion: a normal swipeable row instead.
 */
export function ServicesScroller({
  heading,
  items,
}: {
  heading: React.ReactNode;
  items: ScrollerService[];
}) {
  const outer = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const total = items.length;

  useEffect(() => {
    const section = outer.current;
    const frame = viewport.current;
    const row = track.current;
    if (!section || !frame || !row) return;
    const mq = window.matchMedia(PIN_QUERY);
    let distance = 0;

    const measure = () => {
      if (!mq.matches) {
        section.style.height = "";
        row.style.transform = "";
        distance = 0;
        return;
      }
      distance = Math.max(0, row.scrollWidth - frame.clientWidth);
      section.style.height = `${window.innerHeight + distance}px`;
    };

    const update = () => {
      if (!mq.matches) return;
      const top = section.getBoundingClientRect().top;
      const progress = distance ? Math.min(1, Math.max(0, -top / distance)) : 0;
      row.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
      if (counter.current)
        counter.current.textContent = String(
          Math.min(total, Math.round(progress * (total - 1)) + 1),
        ).padStart(2, "0");
    };

    const refresh = () => {
      measure();
      update();
    };

    refresh();
    const resize = new ResizeObserver(refresh);
    resize.observe(row);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", refresh);
    mq.addEventListener("change", refresh);
    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", refresh);
      mq.removeEventListener("change", refresh);
    };
  }, [total]);

  return (
    <section
      ref={outer}
      aria-label="Our services"
      // Warm light sand: the dark photo cards stand out on it, and the
      // header switches to dark text automatically.
      className="relative bg-[color-mix(in_oklch,var(--gold)_14%,var(--paper))] text-ink"
    >
      <div className="flex flex-col gap-10 py-20 sm:py-24 lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:h-svh lg:motion-safe:justify-center lg:motion-safe:gap-12 lg:motion-safe:overflow-hidden lg:motion-safe:py-0 lg:motion-safe:pt-20">
        {heading}

        {/* The track: swipeable on small screens, moved by scroll when pinned */}
        <div
          ref={viewport}
          className="scrollbar-none snap-x snap-mandatory scroll-px-5 overflow-x-auto sm:scroll-px-8 lg:motion-safe:snap-none lg:motion-safe:overflow-visible"
        >
          <div
            ref={track}
            className="flex w-max gap-5 px-5 will-change-transform sm:px-8 lg:gap-6 lg:px-12 xl:px-16"
          >
            {items.map((item, i) => (
              <Link
                key={item.id}
                href={item.href}
                className="group relative isolate flex h-[26rem] w-[80vw] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl border border-ink/10 bg-ink p-7 text-paper shadow-lg transition-[border-color] duration-500 hover:border-gold focus-visible:border-gold focus-visible:ring-3 focus-visible:ring-gold/50 focus-visible:outline-none sm:w-[24rem] lg:h-[min(60svh,34rem)] lg:w-[clamp(20rem,30vw,28rem)]"
              >
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, 80vw"
                  className="-z-20 object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/60 to-ink/20 transition-colors duration-500 group-hover:via-ink/50"
                />
                <div className="flex items-start justify-between">
                  <span className="font-geo text-sm tracking-[0.2em] text-paper/70 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex size-12 items-center justify-center rounded-xl bg-gold text-ink">
                    {item.icon}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="font-geo text-2xl font-medium sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="text-paper/75">{item.description}</p>
                  <span className="mt-2 flex items-center gap-2 text-sm font-medium text-gold">
                    Learn more
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            ))}

            {/* Last card: a call to action */}
            <Link
              href="/quote"
              className="group flex h-[26rem] w-[80vw] shrink-0 snap-start flex-col justify-between rounded-3xl bg-gold p-7 text-ink shadow-lg focus-visible:ring-3 focus-visible:ring-ink/40 focus-visible:outline-none sm:w-[24rem] lg:h-[min(60svh,34rem)] lg:w-[clamp(20rem,30vw,28rem)]"
            >
              <span className="font-geo text-sm tracking-[0.2em] uppercase">
                Not sure which?
              </span>
              <div className="flex flex-col gap-6">
                <p className="font-geo text-3xl leading-tight font-medium sm:text-4xl">
                  Tell us what you need moving.
                </p>
                <span className="flex items-center gap-4">
                  <span className="font-geo text-sm font-medium tracking-[0.15em] uppercase">
                    Get a free quote
                  </span>
                  <span className="flex size-14 items-center justify-center rounded-full bg-ink text-gold transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none">
                    <ArrowUpRight className="size-6" aria-hidden="true" />
                  </span>
                </span>
              </div>
            </Link>
            {/* Room after the last card so it can scroll fully into view */}
            <span aria-hidden="true" className="w-px shrink-0" />
          </div>
        </div>

        {/* Progress (pinned mode only) */}
        <div
          aria-hidden="true"
          className="mx-auto hidden w-full max-w-[1760px] items-center gap-6 px-5 sm:px-8 lg:px-12 lg:motion-safe:flex xl:px-16"
        >
          <span className="font-geo text-xs tracking-[0.3em] text-ink/60 tabular-nums">
            <span ref={counter}>01</span> / {String(total).padStart(2, "0")}
          </span>
          <span className="relative h-px flex-1 bg-ink/15">
            <span
              ref={bar}
              // Width set from scroll progress (transform, see update())
              style={{ transform: "scaleX(0)" }}
              className="absolute inset-0 origin-left bg-gold-dark"
            />
          </span>
        </div>
      </div>
    </section>
  );
}
