import Link from "next/link";

import { Container } from "@/components/layout/container";

type PageHeaderProps = {
  title: string;
  description?: string;
  /** Current page name for the breadcrumb, e.g. "About". */
  breadcrumb: string;
};

/** Dark title band at the top of inner pages, with a breadcrumb. */
export function PageHeader({
  title,
  description,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <section className="bg-ink text-paper">
      <Container className="flex flex-col gap-4 py-14 sm:py-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-grey-400">
            <li>
              <Link
                href="/"
                className="rounded-sm hover:text-gold focus-visible:ring-3 focus-visible:ring-gold/60 focus-visible:outline-none"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-paper">
              {breadcrumb}
            </li>
          </ol>
        </nav>
        <h1 className="max-w-3xl text-4xl font-semibold text-balance sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-lg text-pretty text-grey-400">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
