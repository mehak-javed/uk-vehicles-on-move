"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Service } from "@/content/services";
import { cn } from "@/lib/utils";

export type ShowcaseService = Pick<Service, "id" | "title" | "description"> & {
  href: string;
  image: { src: string; alt: string };
  icon: React.ReactNode;
};

/**
 * Interactive services list. Hovering, focusing or tapping a row makes it
 * active: a gold line sweeps under it, the title turns gold and the
 * arrow turns; on large screens a photo panel beside the list cross-fades
 * to that service. Every row is a link to the service on /services.
 */
export function ServicesShowcase({ items }: { items: ShowcaseService[] }) {
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
      <ol className="border-b border-paper/15">
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <li key={item.id} className="scroll-reveal">
              <Link
                href={item.href}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-current={isActive ? "true" : undefined}
                className="group relative flex items-center gap-5 border-t border-paper/15 py-6 focus-visible:outline-none sm:gap-8 sm:py-8"
              >
                {/* Gold line that sweeps across under the active row */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 -bottom-px h-px origin-left bg-gold transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                    isActive ? "scale-x-100" : "scale-x-0",
                  )}
                />
                <span
                  className={cn(
                    "font-geo text-sm tabular-nums transition-colors duration-500",
                    isActive ? "text-gold" : "text-paper/40",
                  )}
                >
                  0{i + 1}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-2">
                  <span
                    className={cn(
                      "font-geo text-2xl font-medium tracking-tight transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:text-3xl xl:text-4xl",
                      isActive ? "translate-x-2 text-gold" : "text-paper",
                    )}
                  >
                    {item.title}
                  </span>
                  {/* Phones and tablets: no photo panel, so show the text here */}
                  <span className="text-sm text-paper/65 lg:hidden">
                    {item.description}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-500 motion-reduce:transition-none sm:size-14",
                    isActive
                      ? "rotate-45 border-gold bg-gold text-ink"
                      : "border-paper/25 text-paper",
                  )}
                >
                  <ArrowUpRight className="size-5 sm:size-6" />
                </span>
                {/* Visible keyboard focus */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-lg ring-gold/60 group-focus-visible:ring-3"
                />
              </Link>
            </li>
          );
        })}
      </ol>

      {/* Large screens: photo panel that follows the active row */}
      <div className="hidden lg:block">
        <div className="sticky top-28 overflow-hidden rounded-3xl bg-ink-soft">
          <div className="relative aspect-[4/5] max-h-[calc(100svh-9rem)] w-full">
            {items.map((item, i) => (
              <Image
                key={item.id}
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 0px"
                className={cn(
                  "object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  i === active
                    ? "scale-100 opacity-100"
                    : "scale-110 opacity-0",
                )}
              />
            ))}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-transparent"
            />
            <div
              key={current.id}
              aria-live="polite"
              className="service-panel-text absolute inset-x-0 bottom-0 flex flex-col gap-4 p-8"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-gold text-ink">
                {current.icon}
              </span>
              <p className="text-lg text-paper/85">{current.description}</p>
              <p className="font-geo text-xs tracking-[0.3em] text-paper/50 uppercase">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(items.length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
