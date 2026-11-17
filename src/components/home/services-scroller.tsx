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

/** Large screens: the mouse wheel moves the cards while over them. */
const WHEEL_QUERY = "(min-width: 1024px)";

/**
 * Services as a horizontal row of cards.
 *
 * The page never locks. With the mouse over the cards, scrolling moves
 * them sideways until the row ends, then the page carries on scrolling;
 * anywhere else the page scrolls normally. Trackpads and phones can also
 * swipe the row sideways (with snap points on touch screens). A gold bar
 * and counter show how far along the row you are.
 */
export function ServicesScroller({
  heading,
  items,
}: {
  heading: React.ReactNode;
  items: ScrollerService[];
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const total = items.length;

  useEffect(() => {
    const row = viewport.current;
    if (!row) return;
    const mq = window.matchMedia(WHEEL_QUERY);

    const update = () => {
      const max = row.scrollWidth - row.clientWidth;
      const progress = max > 0 ? Math.min(1, row.scrollLeft / max) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
      if (counter.current)
        counter.current.textContent = String(
          Math.min(total, Math.round(progress * (total - 1)) + 1),
        ).padStart(2, "0");
    };

    // Turn vertical wheel movement into sideways movement, but only while
    // the row can still move that way; at either end the page scrolls.
    const onWheel = (event: WheelEvent) => {
      if (!mq.matches || Math.abs(event.deltaX) > Math.abs(event.deltaY))
        return;
      const max = row.scrollWidth - row.clientWidth;
      const canMove =
        (event.deltaY > 0 && row.scrollLeft < max - 1) ||
        (event.deltaY < 0 && row.scrollLeft > 1);
      if (!canMove) return;
      event.preventDefault();
      row.scrollLeft = Math.min(
        max,
        Math.max(0, row.scrollLeft + event.deltaY),
      );
    };

    update();
    row.addEventListener("scroll", update, { passive: true });
    row.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", update);
    return () => {
      row.removeEventListener("scroll", update);
      row.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", update);
    };
  }, [total]);

  return (
    <section
      aria-label="Our services"
      // Warm light sand: the dark photo cards stand out on it, and the
      // header switches to dark text automatically.
      className="relative bg-[color-mix(in_oklch,var(--gold)_14%,var(--paper))] text-ink"
    >
      <div className="flex flex-col gap-10 py-20 sm:py-24 lg:gap-12">
        {heading}

        {/* The row: swipe or trackpad anywhere; mouse wheel while over it */}
        <div
          ref={viewport}
          // Vertical padding leaves room for the card shadows
          className="-my-8 scrollbar-none snap-x snap-mandatory scroll-px-5 overflow-x-auto py-8 sm:scroll-px-8 lg:snap-none"
        >
          <div className="flex w-max gap-5 px-5 sm:px-8 lg:gap-6 lg:px-12 xl:px-16">
            {items.map((item, i) => (
              <Link
                key={item.id}
                href={item.href}
                className="group relative isolate flex h-[26rem] w-[80vw] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl bg-ink p-7 text-paper shadow-[0_18px_40px_-14px_rgb(11_11_12/0.45)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-16px_rgb(11_11_12/0.55)] focus-visible:-translate-y-1.5 focus-visible:ring-3 focus-visible:ring-gold/50 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-[24rem] lg:h-[min(60svh,34rem)] lg:w-[clamp(20rem,30vw,28rem)]"
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
              className="group flex h-[26rem] w-[80vw] shrink-0 snap-start flex-col justify-between rounded-3xl bg-gold p-7 text-ink shadow-[0_18px_40px_-14px_rgb(11_11_12/0.45)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-16px_rgb(11_11_12/0.55)] focus-visible:-translate-y-1.5 focus-visible:ring-3 focus-visible:ring-ink/40 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-[24rem] lg:h-[min(60svh,34rem)] lg:w-[clamp(20rem,30vw,28rem)]"
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

        {/* How far along the row you are */}
        <div
          aria-hidden="true"
          className="mx-auto flex w-full max-w-[1760px] items-center gap-6 px-5 sm:px-8 lg:px-12 xl:px-16"
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
