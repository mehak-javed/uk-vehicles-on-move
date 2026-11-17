import Image from "next/image";

import { Container } from "@/components/layout/container";

type ParallaxBandProps = {
  image: { src: string; alt?: string };
  /** Short statement shown over the photo. */
  quote: string;
  /** Optional small gold label under the statement. */
  caption?: string;
};

/** Full-width photo band with a parallax effect and a short statement. */
export function ParallaxBand({ image, quote, caption }: ParallaxBandProps) {
  return (
    <section
      data-header-dark
      // overflow-clip (not hidden): hidden would make this section its own
      // scroll container and freeze the parallax
      className="relative isolate overflow-clip bg-ink text-paper"
    >
      {/* Taller than the band so it has room to drift */}
      <div className="parallax-view absolute inset-x-0 -top-[12%] -z-20 h-[124%]">
        <Image
          src={image.src}
          alt={image.alt ?? ""}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/60" />

      <Container className="flex min-h-[55svh] flex-col items-center justify-center gap-5 py-24 text-center">
        <p className="max-w-3xl font-heading text-3xl leading-tight text-balance sm:text-5xl">
          &ldquo;{quote}&rdquo;
        </p>
        {caption && (
          <p className="flex items-center gap-3 font-geo text-xs tracking-[0.3em] text-gold uppercase">
            <span aria-hidden="true" className="h-px w-8 bg-gold" />
            {caption}
            <span aria-hidden="true" className="h-px w-8 bg-gold" />
          </p>
        )}
      </Container>
    </section>
  );
}
