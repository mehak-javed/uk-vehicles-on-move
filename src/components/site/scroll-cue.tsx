"use client";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * "Scroll" button with a bouncing arrow at the bottom of a page header.
 * Clicking it scrolls smoothly to just below the header (the next section
 * lines up under the navbar). Fades away as you scroll (parallax-fade).
 * Use tone="dark" on light backgrounds.
 */
export function ScrollCue({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const scrollPastHeader = (event: React.MouseEvent<HTMLButtonElement>) => {
    const hero = event.currentTarget.closest("section");
    if (!hero) return;
    const navbar = document.querySelector("header")?.offsetHeight ?? 0;
    const top = hero.getBoundingClientRect().bottom + window.scrollY - navbar;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div
      className={cn(
        "parallax-fade pointer-events-none absolute inset-x-0 bottom-4 flex justify-center",
        className,
      )}
    >
      <button
        type="button"
        onClick={scrollPastHeader}
        aria-label="Scroll down to the content"
        className={cn(
          "pointer-events-auto flex cursor-pointer flex-col items-center gap-1 rounded-full px-4 py-2 font-geo text-[0.65rem] tracking-[0.3em] uppercase transition-colors duration-300 focus-visible:ring-3 focus-visible:ring-gold/60 focus-visible:outline-none",
          tone === "light"
            ? "text-paper/60 hover:text-gold"
            : "text-ink/50 hover:text-gold-dark",
        )}
      >
        Scroll
        <ChevronDown
          className="size-4 animate-bounce motion-reduce:animate-none"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
