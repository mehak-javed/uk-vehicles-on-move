import Image from "next/image";

import { Container } from "@/components/layout/container";

type PhotoHeroProps = {
  /** Small gold label under the headline, between two gold lines. */
  label: string;
  /** The page's main heading (h1). */
  title: string;
  description?: string;
  image: { src: string; alt?: string };
};

/**
 * Centred photo header for inner pages, in place of the title band and
 * breadcrumb. The photo drifts slower than the page as you scroll
 * (parallax) and the text fades away; both stay still with reduced motion.
 */
export function PhotoHero({
  label,
  title,
  description,
  image,
}: PhotoHeroProps) {
  return (
    <section
      data-header-dark
      // Pulled up under the transparent header (h-20) so the photo shows behind it
      className="relative isolate -mt-20 flex min-h-[72svh] items-center overflow-hidden bg-ink pt-20 text-paper"
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
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/60" />

      <Container className="parallax-fade flex flex-col items-center gap-6 py-24 text-center [text-shadow:0_2px_12px_rgb(0_0_0/0.5)]">
        <h1 className="max-w-4xl text-4xl leading-tight font-light text-balance sm:text-6xl">
          {title}
        </h1>
        <p className="flex items-center gap-3 font-geo text-xs tracking-[0.3em] text-gold uppercase">
          <span aria-hidden="true" className="h-px w-8 bg-gold" />
          {label}
          <span aria-hidden="true" className="h-px w-8 bg-gold" />
        </p>
        {description && (
          <p className="max-w-xl text-lg text-pretty text-paper/80">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
