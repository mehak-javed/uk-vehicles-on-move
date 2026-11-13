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

/** Sticky header: logo, main navigation and the quote call-to-action. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <Container className="flex h-18 items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Main" className="flex items-center gap-2">
          {/* The active link needs the URL; the fallback keeps the links in the static shell. */}
          <Suspense fallback={<DesktopNavLinks />}>
            <DesktopNav />
          </Suspense>
          <Button
            asChild
            variant="accent"
            size="lg"
            className="hidden px-4 sm:inline-flex lg:ml-4"
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
