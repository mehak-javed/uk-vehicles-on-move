import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Logo slot. Until the client supplies a logo file this renders a
 * text wordmark. To switch, add the file to /public and set LOGO_SRC.
 */
const LOGO_SRC: string | null = null;
const COMPANY_NAME =
  process.env.NEXT_PUBLIC_COMPANY_NAME || "UK Vehicles On Move";

type LogoProps = {
  tone?: "light" | "dark";
  className?: string;
};

export function Logo({ tone = "light", className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${COMPANY_NAME} — home`}
      className={cn(
        "inline-flex items-center gap-2 rounded-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      {LOGO_SRC ? (
        <Image
          src={LOGO_SRC}
          alt=""
          width={160}
          height={40}
          className="h-10 w-auto"
        />
      ) : (
        <span className="flex flex-col leading-none" aria-hidden="true">
          <span
            className={cn(
              "font-heading text-xl font-semibold",
              tone === "dark" ? "text-paper" : "text-ink",
            )}
          >
            UK Vehicles
          </span>
          <span
            className={cn(
              "text-[0.7rem] font-semibold tracking-[0.3em] uppercase",
              tone === "dark" ? "text-gold" : "text-gold-dark",
            )}
          >
            On Move
          </span>
        </span>
      )}
    </Link>
  );
}
