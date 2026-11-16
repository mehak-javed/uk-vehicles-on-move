import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import logoEmblem from "../../../public/brand/logo-emblem.png";
import logoFull from "../../../public/brand/logo-full.png";
import logoFullLight from "../../../public/brand/logo-full-light.png";

const COMPANY_NAME =
  process.env.NEXT_PUBLIC_COMPANY_NAME || "UK Vehicles On Move";

type LogoProps = {
  /** "full" = truck badge with the company name; "emblem" = badge only. */
  variant?: "full" | "emblem";
  /**
   * On dark backgrounds the logo's black lettering disappears, so it sits on
   * a light panel instead.
   */
  onDark?: boolean;
  /** Light artwork (off-white lettering, gold kept) for dark backgrounds. */
  light?: boolean;
  /** Load immediately (use for the header logo, which is above the fold). */
  preload?: boolean;
  className?: string;
};

/** Company logo (client-supplied artwork, background removed). Links home. */
export function Logo({
  variant = "full",
  onDark = false,
  light = false,
  preload = false,
  className,
}: LogoProps) {
  const src =
    variant === "emblem" ? logoEmblem : light ? logoFullLight : logoFull;

  return (
    <Link
      href="/"
      aria-label={`${COMPANY_NAME} home`}
      className={cn(
        "inline-flex shrink-0 items-center rounded-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        onDark && "rounded-xl bg-paper p-3",
        className,
      )}
    >
      <Image
        src={src}
        alt={COMPANY_NAME}
        preload={preload}
        sizes="200px"
        className="h-full w-auto"
      />
    </Link>
  );
}
