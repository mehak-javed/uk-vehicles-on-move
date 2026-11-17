import { FileWarning } from "lucide-react";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/site/page-header";

export type LegalSection = {
  /** Anchor id, e.g. "what-we-collect". */
  id: string;
  title: string;
  content: React.ReactNode;
};

type LegalPageProps = {
  title: string;
  breadcrumb: string;
  intro: string;
  /** Human-readable date, e.g. "16 November 2026". */
  lastUpdated: string;
  /** ISO date for the <time> element, e.g. "2026-11-16". */
  lastUpdatedIso: string;
  sections: LegalSection[];
};

/**
 * Shared layout for the Privacy, Cookie and Terms pages: title band,
 * "last updated" date, draft notice, table of contents and readable text.
 */
export function LegalPage({
  title,
  breadcrumb,
  intro,
  lastUpdated,
  lastUpdatedIso,
  sections,
}: LegalPageProps) {
  return (
    <>
      <PageHeader breadcrumb={breadcrumb} title={title} description={intro} />
      <section className="py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-[16rem_minmax(0,48rem)] lg:gap-16">
          {/* Contents */}
          <nav aria-label="On this page" className="h-fit lg:sticky lg:top-28">
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              On this page
            </p>
            <ol className="flex flex-col gap-2 border-l border-border pl-4 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="rounded-sm text-muted-foreground transition-colors hover:text-gold-dark focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Body */}
          <article className="flex min-w-0 flex-col gap-8">
            <p className="text-sm text-muted-foreground">
              Last updated:{" "}
              <time dateTime={lastUpdatedIso} className="font-medium text-ink">
                {lastUpdated}
              </time>
            </p>

            <div
              role="note"
              className="flex gap-3 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm"
            >
              <FileWarning
                className="mt-0.5 size-5 shrink-0 text-gold-dark"
                aria-hidden="true"
              />
              <p>
                <strong>Draft for review.</strong> This page will be finalised
                with the company&apos;s details and checked before the website
                goes live. Items marked{" "}
                <span className="rounded bg-gold/25 px-1">[like this]</span> are
                still to be confirmed.
              </p>
            </div>

            {sections.map((s) => (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-title`}
                className="scroll-mt-28"
              >
                <h2
                  id={`${s.id}-title`}
                  className="mb-3 text-2xl font-semibold"
                >
                  {s.title}
                </h2>
                <div className="flex flex-col gap-3 leading-relaxed text-ink/85 [&_a]:font-medium [&_a]:text-gold-dark [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_strong]:text-ink [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-5">
                  {s.content}
                </div>
              </section>
            ))}
          </article>
        </Container>
      </section>
    </>
  );
}

/** Highlights a detail that the client still needs to confirm. */
export function Tbc({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-gold/25 px-1">[{children}]</span>;
}
