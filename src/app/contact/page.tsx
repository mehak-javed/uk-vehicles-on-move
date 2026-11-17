import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { ContactHero } from "@/components/contact/contact-hero";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Get in touch with UK Vehicles On Move by phone, WhatsApp, email or the contact form.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { phone, whatsapp, email } = siteConfig.contact;

  // Only show the contact options that are configured.
  const options = [
    phone && {
      icon: Phone,
      title: "Call us",
      detail: phone.label,
      href: phone.href,
      external: false,
    },
    whatsapp && {
      icon: MessageCircle,
      title: "WhatsApp",
      detail: "Chat with us",
      href: whatsapp.href,
      external: true,
    },
    email && {
      icon: Mail,
      title: "Email",
      detail: email,
      href: `mailto:${email}`,
      external: false,
    },
  ].filter((o) => !!o);

  return (
    <>
      <ContactHero />
      <section className="py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-[18rem_1fr]">
          <aside className="flex flex-col gap-4">
            <h2 className="font-sans text-base font-semibold">
              Other ways to reach us
            </h2>
            <ul className="flex flex-col gap-3">
              {options.map(({ icon: Icon, title, detail, href, external }) => (
                <li key={title}>
                  <a
                    href={href}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-gold-dark focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-ink text-gold">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="font-semibold">{title}</span>
                      <span className="truncate text-sm text-muted-foreground">
                        {detail}
                      </span>
                    </span>
                    {external && (
                      <span className="sr-only"> (opens in a new tab)</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              Looking for a price?{" "}
              <Link
                href="/quote"
                className="font-medium text-gold-dark underline underline-offset-4"
              >
                Request a free quote
              </Link>
              .
            </p>
          </aside>
          <ContactForm />
        </Container>
      </section>
    </>
  );
}
