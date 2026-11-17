import Image from "next/image";
import { ChevronDown } from "lucide-react";

import { Container } from "@/components/layout/container";

type AboutHeroProps = {
  /** Small gold label, used instead of a breadcrumb. */
  eyebrow: string;
  title: string;
  description: string;
  image: { src: string; alt?: string };
};

/**
 * Tall photo header for the About page: the photo drifts slower than the
 * page (parallax) and the text fades away as you scroll. A gold label with
 * a line replaces the breadcrumb.
 */
export function AboutHero({
  eyebrow,
  title,
  description,
  image,
}: AboutHeroProps) {
  return (
    <section
      data-header-dark
      // Pulled up under the transparent header (h-20) so the photo shows behind it
      className="relative isolate -mt-20 flex min-h-[78svh] items-end overflow-hidden bg-ink pt-20 text-paper"
    >
      {/* Taller than the section so it has room to drift down */}
      <div className="parallax-top absolute inset-x-0 -top-1/4 -z-20 h-[125%]">
        <Image
          src={image.src}
          alt={image.alt ?? ""}
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-ink/85 via-ink/45 to-ink/90"
      />
      {/* Extra shade on the left, behind the text */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-ink/60 via-ink/25 to-transparent"
      />

      <Container className="parallax-fade flex flex-col gap-6 pt-24 pb-20 [text-shadow:0_2px_12px_rgb(0_0_0/0.55)] sm:pb-24">
        <p className="flex items-center gap-4 font-geo text-xs font-medium tracking-[0.3em] text-gold uppercase sm:text-sm">
          <span aria-hidden="true" className="h-px w-10 bg-gold sm:w-14" />
          {eyebrow}
        </p>
        <h1 className="max-w-4xl font-geo text-4xl leading-[1.05] font-light tracking-[0.02em] text-balance uppercase sm:text-6xl xl:text-7xl">
          {title}
        </h1>
        <p className="max-w-xl text-lg text-pretty text-paper/80 sm:text-xl">
          {description}
        </p>
      </Container>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="parallax-fade absolute inset-x-0 bottom-6 flex flex-col items-center gap-1 font-geo text-[0.65rem] tracking-[0.3em] text-paper/60 uppercase"
      >
        Scroll
        <ChevronDown className="size-4 animate-bounce motion-reduce:animate-none" />
      </div>
    </section>
  );
}
