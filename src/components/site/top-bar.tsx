import Link from "next/link";
import { Phone, UserRound } from "lucide-react";

import { Container } from "@/components/layout/container";
import { WhatsAppIcon } from "@/components/site/social-icons";
import { siteConfig } from "@/config/site";

/** Thin black bar above the header with click-to-call and WhatsApp. */
export function TopBar() {
  const { phone, whatsapp } = siteConfig.contact;

  return (
    <div className="bg-ink text-sm text-paper">
      <Container className="flex h-10 items-center justify-between gap-4">
        <ul className="flex items-center gap-4 sm:gap-6">
          {phone && (
            <li>
              <a
                href={phone.href}
                className="flex items-center gap-2 rounded-sm hover:text-gold focus-visible:ring-3 focus-visible:ring-gold/60 focus-visible:outline-none"
              >
                <Phone className="size-4 text-gold" aria-hidden="true" />
                <span className="sr-only">Call us on </span>
                {phone.label}
              </a>
            </li>
          )}
          {whatsapp && (
            <li>
              <a
                href={whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-sm hover:text-gold focus-visible:ring-3 focus-visible:ring-gold/60 focus-visible:outline-none"
              >
                <WhatsAppIcon className="size-4 text-gold" aria-hidden="true" />
                Chat with us
                <span className="sr-only">
                  {" "}
                  on WhatsApp (opens in a new tab)
                </span>
              </a>
            </li>
          )}
        </ul>
        <Link
          href={siteConfig.signInLink.href}
          className="flex items-center gap-2 rounded-sm hover:text-gold focus-visible:ring-3 focus-visible:ring-gold/60 focus-visible:outline-none"
        >
          <UserRound className="size-4" aria-hidden="true" />
          {siteConfig.signInLink.title}
        </Link>
      </Container>
    </div>
  );
}
