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
                "relative rounded-sm px-3 py-2 font-geo text-xs font-medium tracking-[0.18em] text-paper/75 uppercase transition-colors duration-300 ease-out hover:text-paper focus-visible:ring-3 focus-visible:ring-gold/60 focus-visible:outline-none header-light:text-ink/70 header-light:hover:text-ink",
                "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:scale-x-100 motion-reduce:after:transition-none",
                active && "text-paper after:scale-x-100 header-light:text-ink",
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
          className="text-paper hover:bg-paper/10 hover:text-paper lg:hidden header-light:text-ink header-light:hover:bg-ink/5 header-light:hover:text-ink"
          aria-label="Open menu"
        >
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full max-w-xs border-paper/10 bg-ink text-paper"
      >
        <SheetHeader>
          <SheetTitle className="font-geo text-sm font-medium tracking-[0.25em] text-gold uppercase">
            Menu
          </SheetTitle>
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
                        "flex border-b border-paper/10 py-3.5 font-geo text-sm font-medium tracking-[0.15em] uppercase transition-colors duration-300 ease-out hover:text-gold focus-visible:ring-3 focus-visible:ring-gold/60 focus-visible:outline-none",
                        active ? "text-gold" : "text-paper/80",
                      )}
                    >
                      {item.title}
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
