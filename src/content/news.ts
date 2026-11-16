/**
 * News articles. Static for now; moved to the database and admin area in
 * US-22. The site is currently a draft for client review, so these are
 * dummy articles. Replace them with real company news before launch.
 */

export type NewsPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date, e.g. "2026-11-14" */
  publishedAt: string;
  /** Paragraphs of the article. */
  body: string[];
  /** Cover image (also used when shared on social media). */
  image?: { src: string; alt: string; width: number; height: number };
};

const sampleBody = [
  "This is a sample article used to preview the news layout. It will be replaced with real company news before the website goes live.",
  "Articles can cover company updates, new services, coverage areas or helpful advice for customers moving a vehicle.",
];

const newsPosts: NewsPost[] = [
  {
    slug: "sample-article-one",
    title: "Sample article: our new website",
    excerpt: "A placeholder article showing how news posts appear on the site.",
    publishedAt: "2026-11-10",
    body: sampleBody,
    image: {
      src: "/samples/photo-3.jpg",
      alt: "Car transporter truck driving along a highway",
      width: 1200,
      height: 752,
    },
  },
  {
    slug: "sample-article-two",
    title: "Sample article: tips before your vehicle is collected",
    excerpt: "A placeholder article showing a second post in the list.",
    publishedAt: "2026-11-03",
    body: sampleBody,
    image: {
      src: "/samples/photo-6.jpg",
      alt: "Red hatchback driving on an open country road",
      width: 1200,
      height: 899,
    },
  },
  {
    slug: "sample-article-three",
    title: "Sample article: trade deliveries explained",
    excerpt: "A placeholder article without a cover image.",
    publishedAt: "2026-10-27",
    body: sampleBody,
  },
];

/** All posts, newest first. */
export function getNewsPosts(): NewsPost[] {
  return [...newsPosts].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

export function getNewsPost(slug: string): NewsPost | undefined {
  return getNewsPosts().find((p) => p.slug === slug);
}

export const formatNewsDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
