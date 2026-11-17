"use client";

import { useEffect, useRef } from "react";

/**
 * Silent, looping background video for the home hero. Phones get a smaller
 * 720p file. The still frame (rendered behind it) shows while the video
 * loads and for visitors who prefer reduced motion, who get no video.
 *
 * `muted` is also set from code: React does not put it in the server HTML,
 * and browsers only autoplay videos that are muted.
 */
export function HeroVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (reduce.matches) video.pause();
      else {
        video.muted = true;
        video.play().catch(() => {
          // Autoplay blocked (e.g. Low Power Mode): the still frame stays.
        });
      }
    };
    sync();
    reduce.addEventListener("change", sync);
    return () => reduce.removeEventListener("change", sync);
  }, []);

  return (
    <video
      ref={ref}
      aria-hidden="true"
      tabIndex={-1}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      className={className}
    >
      <source
        src="/home/hero-mobile.mp4"
        type="video/mp4"
        media="(max-width: 767px)"
      />
      <source src="/home/hero.mp4" type="video/mp4" />
    </video>
  );
}
