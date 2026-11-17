import type { Metadata } from "next";
import { Clock, PhoneCall, ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { QuoteForm } from "@/components/quote/quote-form";
import { PageHeader } from "@/components/site/page-header";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Get a free quote",
  description:
    "Request a free, no-obligation quote to move your car, van or motorbike anywhere in the UK. It takes under two minutes.",
  alternates: { canonical: "/quote" },
};

const reassurances = [
  { icon: Clock, text: "Takes under two minutes" },
  { icon: ShieldCheck, text: "Free and no obligation" },
  { icon: PhoneCall, text: "Prefer to talk? Call or WhatsApp us" },
];

export default function QuotePage() {
  const { phone } = siteConfig.contact;

  return (
    <>
      <PageHeader
        breadcrumb="Get a quote"
        title="Get a free quote"
        description="Tell us about the vehicle and the journey, and we'll reply with a clear price."
      />
      <section className="py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-[1fr_18rem]">
          <QuoteForm />
          <aside className="flex h-fit flex-col gap-5 rounded-2xl bg-grey-100 p-6">
            <h2 className="font-sans text-base font-semibold">
              Why request a quote?
            </h2>
            <ul className="flex flex-col gap-4">
              {reassurances.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon
                    className="mt-0.5 size-5 shrink-0 text-gold-dark"
                    aria-hidden="true"
                  />
                  {text}
                </li>
              ))}
            </ul>
            {phone && (
              <a
                href={phone.href}
                className="font-semibold text-gold-dark underline underline-offset-4"
              >
                {phone.label}
              </a>
            )}
          </aside>
        </Container>
      </section>
    </>
  );
}
