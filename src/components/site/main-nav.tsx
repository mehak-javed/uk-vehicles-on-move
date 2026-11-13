"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

function isActive(href: string, pathname?: string | null) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** Desktop links. `pathname` is optional so it can render as a static fallback. */
export function DesktopNavLinks({ pathname }: { pathname?: string | null }) {
  return (
    <ul className="hidden items-center gap-1 lg:flex">
      {siteConfig.mainNav.map((item) => {
        const active = isActive(item.href, pathname);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative rounded-md px-3 py-2 text-sm font-medium text-ink/80 transition-colors hover:text-ink focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-gold after:transition-transform hover:after:scale-x-100",
                active && "text-ink after:scale-x-100",
              )}
            >
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function DesktopNav() {
  return <DesktopNavLinks pathname={usePathname()} />;
}

/** Hamburger menu for small screens (Radix Dialog: focus trap, Esc to close). */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs bg-paper">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation
          </SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col gap-6 px-4">
          <ul className="flex flex-col">
            {siteConfig.mainNav.map((item) => {
              const active = isActive(item.href, pathname);
              return (
                <li key={item.href}>
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex border-b border-border py-3 text-base font-medium focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                        active ? "text-gold-dark" : "text-ink",
                      )}
                    >
                      {item.title}
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
          <SheetClose asChild>
            <Button asChild variant="accent" size="xl">
              <Link href={siteConfig.quoteLink.href}>
                {siteConfig.quoteLink.title}
              </Link>
            </Button>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
