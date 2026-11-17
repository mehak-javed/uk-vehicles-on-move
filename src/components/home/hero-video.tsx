"use client";

import { useEffect, useRef } from "react";

/**
 * Silent, looping background video (home hero, photo bands). Phones get
 * a smaller 720p file. Off screen it pauses (preload="none" there too). The still frame (rendered behind it) shows while the video
 * loads and for visitors who prefer reduced motion, who get no video.
 *
 * `muted` is also set from code: React does not put it in the server HTML,
 * and browsers only autoplay videos that are muted.
 */
export function HeroVideo({
  className,
  src = "/home/hero.mp4",
  mobileSrc = "/home/hero-mobile.mp4",
  preload = "auto",
}: {
  className?: string;
  src?: string;
  mobileSrc?: string;
  preload?: "auto" | "none" | "metadata";
}) {
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
    // Only play while on screen (saves battery and data further down the page)
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) sync();
      else video.pause();
    });
    observer.observe(video);
    sync();
    const onChange = () => visible && sync();
    reduce.addEventListener("change", onChange);
    return () => {
      observer.disconnect();
      reduce.removeEventListener("change", onChange);
    };
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
      preload={preload}
      className={className}
    >
      <source src={mobileSrc} type="video/mp4" media="(max-width: 767px)" />
      <source src={src} type="video/mp4" />
    </video>
  );
}
