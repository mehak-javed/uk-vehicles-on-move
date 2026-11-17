import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Small "Scroll" hint with a bouncing arrow at the bottom of a page header.
 * Fades away as you scroll (parallax-fade). Use tone="dark" on light
 * backgrounds.
 */
export function ScrollCue({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "parallax-fade pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-1 font-geo text-[0.65rem] tracking-[0.3em] uppercase",
        tone === "light" ? "text-paper/60" : "text-ink/50",
        className,
      )}
    >
      Scroll
      <ChevronDown className="size-4 animate-bounce motion-reduce:animate-none" />
    </div>
  );
}
