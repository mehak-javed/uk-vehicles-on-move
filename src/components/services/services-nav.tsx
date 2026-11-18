"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type ServicesNavProps = {
  items: { id: string; title: string }[];
};

/**
 * Menu of the services on the page. It sticks under the site header while
 * you scroll, and the service you are reading is highlighted in gold.
 */
export function ServicesNav({ items }: ServicesNavProps) {
  const [active, setActive] = useState<string | null>(null);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = items
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    // A section counts as "current" while it crosses the middle of the screen
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) setActive(id);
          // Past the last service (e.g. in the FAQ): nothing is highlighted
          else setActive((current) => (current === id ? null : current));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  // On phones the menu scrolls sideways: keep the current service in view
  useEffect(() => {
    if (!active || !list.current) return;
    const link = list.current.querySelector<HTMLElement>(
      `a[href="#${active}"]`,
    );
    if (!link) return;
    const { offsetLeft, offsetWidth } = link;
    const { clientWidth } = list.current;
    list.current.scrollTo({
      left: offsetLeft - (clientWidth - offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <nav
      aria-label="Services on this page"
      className="sticky top-20 z-30 border-b border-ink/10 bg-paper/95 backdrop-blur-md"
    >
      <ul
        ref={list}
        className="mx-auto scrollbar-none flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:justify-center lg:px-8"
      >
        {items.map(({ id, title }, i) => {
          const current = active === id;
          return (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                aria-current={current ? "true" : undefined}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  current
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 bg-card text-ink hover:border-gold-dark",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "font-geo text-xs tabular-nums transition-colors",
                    current ? "text-gold" : "text-gold-dark",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
