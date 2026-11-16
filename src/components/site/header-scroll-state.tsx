"use client";

import { useEffect } from "react";

/**
 * Marks <html data-scrolled> as soon as the page is scrolled. On the
 * homepage the header uses this to switch from fully transparent over the
 * photo to a dark bar with a bottom border.
 */
export function HeaderScrollState() {
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      root.toggleAttribute("data-scrolled", window.scrollY > 10);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      root.removeAttribute("data-scrolled");
    };
  }, []);

  return null;
}
