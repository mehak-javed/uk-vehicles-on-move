import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";

import { Container } from "@/components/layout/container";
import { CtaBand } from "@/components/site/cta-band";
import { PageHeader } from "@/components/site/page-header";
import { formatNewsDate, getNewsPosts } from "@/content/news";

export const metadata: Metadata = {
  title: "News",
  description: "Company updates and helpful advice from UK Vehicles On Move.",
};

export default function NewsPage() {
  const posts = getNewsPosts(); // newest first

  return (
    <>
      <PageHeader
        breadcrumb="News"
        title="News"
        description="Company updates and helpful advice for moving your vehicle."
      />
      <section className="py-16 sm:py-20">
        <Container>
          {posts.length > 0 ? (
            <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.slug}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
                    {post.image ? (
                      <Image
                        src={post.image.src}
                        alt=""
                        width={post.image.width}
                        height={post.image.height}
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="aspect-[3/2] w-full object-cover"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex aspect-[3/2] items-center justify-center bg-ink text-gold"
                      >
                        <Newspaper className="size-10" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <time
                        dateTime={post.publishedAt}
                        className="text-sm text-muted-foreground"
                      >
                        {formatNewsDate(post.publishedAt)}
                      </time>
                      <h2 className="text-xl font-semibold">
                        {/* The whole card is clickable via the stretched link */}
                        <Link
                          href={`/news/${post.slug}`}
                          className="group-focus-within:underline after:absolute after:inset-0 focus-visible:outline-none"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-muted-foreground">{post.excerpt}</p>
                      <span
                        aria-hidden="true"
                        className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-gold-dark"
                      >
                        Read more <ArrowRight className="size-4" />
                      </span>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-20 text-center">
              <Newspaper
                className="size-10 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="text-lg font-medium">No news yet</p>
              <p className="max-w-md text-muted-foreground">
                Company updates will appear here soon.
              </p>
            </div>
          )}
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
