"use client";

import { useEffect } from "react";

/**
 * Keeps two flags on <html> up to date for the transparent header:
 *
 * - `data-scrolled`: the page has been scrolled (shows the border and blur).
 * - `data-header-light`: the area directly under the header is light, so the
 *   header switches to dark text and the black-lettering logo. Dark areas are
 *   marked with `data-header-dark` (hero photo, page title bands, footer…).
 */
export function HeaderScrollState() {
  useEffect(() => {
    const root = document.documentElement;

    const update = () => {
      root.toggleAttribute("data-scrolled", window.scrollY > 10);

      const header = document.querySelector("header");
      const y = (header?.offsetHeight ?? 80) / 2;
      // What sits under the middle of the header (ignoring the header itself)?
      const under = document
        .elementsFromPoint(window.innerWidth / 2, y)
        .find((el) => !header?.contains(el));
      const dark = Boolean(under?.closest("[data-header-dark]"));
      root.toggleAttribute("data-header-light", !dark);
    };

    update();
    // Cheap checks, so they run directly on each event (no animation-frame
    // throttling, which browsers pause in background tabs).
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // Re-check when the page content changes (e.g. moving to another page).
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return null;
}
