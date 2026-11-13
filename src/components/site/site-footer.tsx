import Link from "next/link";
import { Mail, Phone } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { CurrentYear } from "@/components/site/current-year";
import { SocialIcons, WhatsAppIcon } from "@/components/site/social-icons";
import { siteConfig, type NavItem } from "@/config/site";

const linkClass =
  "rounded-sm text-grey-400 transition-colors hover:text-gold focus-visible:ring-3 focus-visible:ring-gold/60 focus-visible:outline-none";

function FooterColumn({ title, links }: { title: string; links: NavItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-sans text-sm font-semibold tracking-[0.2em] text-gold uppercase">
        {title}
      </h2>
      <ul className="flex flex-col gap-3 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClass}>
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const { phone, whatsapp, email } = siteConfig.contact;

  return (
    <footer className="bg-ink text-paper">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <Logo tone="dark" />
          <p className="max-w-sm text-sm text-grey-400">{siteConfig.tagline}</p>
          <SocialIcons />
        </div>

        <FooterColumn
          title="Company"
          links={[...siteConfig.footerNav.company]}
        />
        <FooterColumn title="Help" links={[...siteConfig.footerNav.help]} />

        <div className="flex flex-col gap-4">
          <h2 className="font-sans text-sm font-semibold tracking-[0.2em] text-gold uppercase">
            Contact
          </h2>
          <ul className="flex flex-col gap-3 text-sm">
            {phone && (
              <li>
                <a href={phone.href} className={`${linkClass} flex gap-2`}>
                  <Phone className="size-4 text-gold" aria-hidden="true" />
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
                  className={`${linkClass} flex gap-2`}
                >
                  <WhatsAppIcon
                    className="size-4 text-gold"
                    aria-hidden="true"
                  />
                  WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            )}
            {email && (
              <li>
                <a
                  href={`mailto:${email}`}
                  className={`${linkClass} flex gap-2`}
                >
                  <Mail className="size-4 text-gold" aria-hidden="true" />
                  {email}
                </a>
              </li>
            )}
            <li>
              <Link href="/contact" className={linkClass}>
                Contact form
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-paper/10">
        <Container className="flex flex-col gap-4 py-6 text-sm text-grey-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {siteConfig.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {siteConfig.footerNav.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
