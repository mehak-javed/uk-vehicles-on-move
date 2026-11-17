import Image from "next/image";

import { HeroVideo } from "@/components/home/hero-video";
import { Container } from "@/components/layout/container";

type ParallaxBandProps = {
  /** Photo (also the still frame shown before/instead of a video). */
  image: { src: string; alt?: string };
  /** Optional background video, played over the photo. */
  video?: { src: string; mobileSrc: string };
  /** Short statement shown over the photo. */
  quote: string;
  /** Optional small gold label under the statement. */
  caption?: string;
};

/**
 * Full-width photo band with a short statement. The photo stays fixed to
 * the screen like a window while the page scrolls, so the sections above
 * and below slide over it. Works on phones too (no background-attachment).
 */
export function ParallaxBand({
  image,
  video,
  quote,
  caption,
}: ParallaxBandProps) {
  return (
    <section
      data-header-dark
      // clip-path keeps the fixed photo inside this band only
      className="relative isolate bg-ink text-paper [clip-path:inset(0)]"
    >
      {/* Fixed to the screen; the band shows it through like a window */}
      <div className="fixed inset-0 -z-20 h-svh w-full">
        <Image
          src={image.src}
          alt={image.alt ?? ""}
          fill
          sizes="100vw"
          className="object-cover"
        />
        {video && (
          <HeroVideo
            src={video.src}
            mobileSrc={video.mobileSrc}
            preload="none"
            className="absolute inset-0 size-full object-cover motion-reduce:hidden"
          />
        )}
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/60" />

      <Container className="flex min-h-[80svh] flex-col items-center justify-center gap-5 py-24 text-center">
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
