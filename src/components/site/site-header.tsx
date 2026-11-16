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
 * Sticky dark header: logo and uppercase navigation.
 * Solid with a bottom border on most pages. On the homepage it sits over
 * the hero photo with no background or border (the photo's dark top fade
 * keeps the links readable); the dark bar and border appear as soon as the
 * page is scrolled (see the `transparent-header` and `scrolled` variants).
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-paper/10 bg-ink text-paper transition-colors duration-300 transparent-header:border-transparent transparent-header:bg-transparent transparent-header:scrolled:border-paper/10 transparent-header:scrolled:bg-ink/90 transparent-header:scrolled:backdrop-blur-sm">
      <HeaderScrollState />
      <Container className="flex h-20 items-center justify-between gap-6">
        <Logo preload className="h-16" />
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
