import { Suspense } from "react";

import { Logo } from "@/components/brand/logo";
import { HeaderScrollState } from "@/components/site/header-scroll-state";
import { Container } from "@/components/layout/container";
import {
  DesktopNav,
  DesktopNavLinks,
  MobileNav,
} from "@/components/site/main-nav";

/**
 * Sticky, transparent header: logo and uppercase navigation. White text and
 * the white-lettering logo over dark areas (photo, title bands, footer);
 * dark text and the black-lettering logo over light areas. A border and a
 * light blur appear once the page is scrolled. See HeaderScrollState and
 * the `scrolled` / `header-light` variants in globals.css.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-transparent bg-transparent text-paper transition-[color,background-color,border-color] duration-300 scrolled:border-paper/10 scrolled:bg-ink/15 scrolled:backdrop-blur-md header-light:text-ink header-light:scrolled:border-ink/10 header-light:scrolled:bg-paper/60">
      <HeaderScrollState />
      <Container className="flex h-20 items-center justify-between gap-6">
        <Logo preload adaptive className="h-16" />
        <nav aria-label="Main" className="flex items-center gap-2">
          {/* The active link needs the URL; the fallback keeps the links in the static shell. */}
          <Suspense fallback={<DesktopNavLinks />}>
            <DesktopNav />
          </Suspense>
          <Suspense>
            <MobileNav />
          </Suspense>
        </nav>
      </Container>
    </header>
  );
}
