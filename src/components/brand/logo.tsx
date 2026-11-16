import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import logoEmblem from "../../../public/brand/logo-emblem.png";
import logoFull from "../../../public/brand/logo-full.png";
import logoFullLightText from "../../../public/brand/logo-full-light-text.png";

const COMPANY_NAME =
  process.env.NEXT_PUBLIC_COMPANY_NAME || "UK Vehicles On Move";

type LogoProps = {
  /** "full" = truck badge with the company name; "emblem" = badge only. */
  variant?: "full" | "emblem";
  /**
   * The logo sits on a dark background: the "UK VEHICLES" lettering is
   * shown in white instead of black (truck, ring and gold kept as is).
   */
  onDark?: boolean;
  /**
   * Switches automatically with the header background: white lettering over
   * dark areas, black lettering over light ones (`header-light` variant).
   */
  adaptive?: boolean;
  /** Load immediately (use for the header logo, which is above the fold). */
  preload?: boolean;
  className?: string;
};

/** Company logo (client-supplied artwork, background removed). Links home. */
export function Logo({
  variant = "full",
  onDark = false,
  adaptive = false,
  preload = false,
  className,
}: LogoProps) {
  const src =
    variant === "emblem" ? logoEmblem : onDark ? logoFullLightText : logoFull;

  return (
    <Link
      href="/"
      aria-label={`${COMPANY_NAME} home`}
      className={cn(
        "inline-flex shrink-0 items-center rounded-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      {adaptive ? (
        <>
          {/* White lettering over dark areas (default) */}
          <Image
            src={logoFullLightText}
            alt={COMPANY_NAME}
            preload={preload}
            sizes="200px"
            className="h-full w-auto header-light:hidden"
          />
          {/* Black lettering over light areas */}
          <Image
            src={logoFull}
            alt=""
            aria-hidden="true"
            sizes="200px"
            className="hidden h-full w-auto header-light:block"
          />
        </>
      ) : (
        <Image
          src={src}
          alt={COMPANY_NAME}
          preload={preload}
          sizes="200px"
          className="h-full w-auto"
        />
      )}
    </Link>
  );
}
