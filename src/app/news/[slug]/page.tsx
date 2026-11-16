import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/components/layout/container";
import { CtaBand } from "@/components/site/cta-band";
import { formatNewsDate, getNewsPost, getNewsPosts } from "@/content/news";

/**
 * Prerender every article at build time. Cache Components requires at least
 * one param, so when there are no articles a placeholder is returned and the
 * page responds with 404 for it.
 */
const PLACEHOLDER = "__no-posts__";

export function generateStaticParams() {
  const posts = getNewsPosts();
  return posts.length > 0
    ? posts.map((p) => ({ slug: p.slug }))
    : [{ slug: PLACEHOLDER }];
}

export async function generateMetadata({
  params,
}: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/news/${post.slug}` },
    // Used by Facebook, LinkedIn, WhatsApp etc. when the article is shared
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/news/${post.slug}`,
      publishedTime: post.publishedAt,
      images: post.image
        ? [
            {
              url: post.image.src,
              width: post.image.width,
              height: post.image.height,
              alt: post.image.alt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: post.image ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default function NewsArticlePage({ params }: PageProps<"/news/[slug]">) {
  return (
    <>
      {/* Streams the article so navigation stays instant (Cache Components) */}
      <Suspense fallback={<ArticleSkeleton />}>
        <Article params={params} />
      </Suspense>
      <CtaBand />
    </>
  );
}

function ArticleSkeleton() {
  return (
    <div
      className="py-14 sm:py-20"
      aria-busy="true"
      aria-label="Loading article"
    >
      <Container size="narrow" className="flex flex-col gap-6">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-12 w-3/4 animate-pulse rounded bg-muted" />
        <div className="aspect-[3/2] w-full animate-pulse rounded-xl bg-muted" />
      </Container>
    </div>
  );
}

async function Article({ params }: Pick<PageProps<"/news/[slug]">, "params">) {
  const { slug } = await params;
  const post = getNewsPost(slug);
  if (!post) notFound();

  return (
    <article className="py-14 sm:py-20">
      <Container size="narrow" className="flex flex-col gap-8">
        <nav aria-label="Breadcrumb">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-gold-dark hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All news
          </Link>
        </nav>
        <header className="flex flex-col gap-4">
          <time
            dateTime={post.publishedAt}
            className="text-sm text-muted-foreground"
          >
            {formatNewsDate(post.publishedAt)}
          </time>
          <h1 className="text-4xl font-semibold text-balance sm:text-5xl">
            {post.title}
          </h1>
          <p className="text-xl text-muted-foreground">{post.excerpt}</p>
        </header>
        {post.image && (
          <Image
            src={post.image.src}
            alt={post.image.alt}
            width={post.image.width}
            height={post.image.height}
            sizes="(min-width: 768px) 768px, 100vw"
            preload
            className="h-auto w-full rounded-xl"
          />
        )}
        <div className="flex flex-col gap-5 text-lg leading-relaxed">
          {post.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </Container>
    </article>
  );
}
