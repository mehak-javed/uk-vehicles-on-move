import { Suspense } from "react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import {
  DesktopNav,
  DesktopNavLinks,
  MobileNav,
} from "@/components/site/main-nav";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

/** Sticky dark header: logo, uppercase navigation and the quote button. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-paper/10 bg-ink text-paper">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Logo preload light className="h-16" />
        <nav aria-label="Main" className="flex items-center gap-2">
          {/* The active link needs the URL; the fallback keeps the links in the static shell. */}
          <Suspense fallback={<DesktopNavLinks />}>
            <DesktopNav />
          </Suspense>
          <Button
            asChild
            variant="accent"
            size="lg"
            className="hidden rounded-full px-5 font-geo text-xs font-medium tracking-[0.15em] uppercase sm:inline-flex lg:ml-4"
          >
            <Link href={siteConfig.quoteLink.href}>
              {siteConfig.quoteLink.title}
            </Link>
          </Button>
          <Suspense>
            <MobileNav />
          </Suspense>
        </nav>
      </Container>
    </header>
  );
}
