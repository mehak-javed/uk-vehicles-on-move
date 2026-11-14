import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

/** Gold call-to-action strip used at the bottom of marketing pages. */
export function CtaBand() {
  const { phone } = siteConfig.contact;

  return (
    <section className="bg-gold py-16 text-ink">
      <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="flex max-w-xl flex-col gap-2">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Ready to move your vehicle?
          </h2>
          <p className="text-lg text-ink/80">
            Get a free, no-obligation quote in minutes.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="xl">
            <Link href={siteConfig.quoteLink.href}>
              {siteConfig.quoteLink.title}
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Link>
          </Button>
          {phone && (
            <Button
              asChild
              variant="outline"
              size="xl"
              className="border-ink/30 bg-transparent hover:bg-ink/10"
            >
              <a href={phone.href}>
                <Phone data-icon="inline-start" aria-hidden="true" />
                Call {phone.label}
              </a>
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}
