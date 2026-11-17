import type { MetadataRoute } from "next";

import { getNewsPosts } from "@/content/news";
import { absoluteUrl } from "@/lib/site-url";

/** sitemap.xml: every public page, plus each news article. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: {
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly" | "yearly";
  }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/quote", priority: 0.9, changeFrequency: "monthly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/gallery", priority: 0.6, changeFrequency: "monthly" },
    { path: "/news", priority: 0.6, changeFrequency: "weekly" },
    { path: "/drive-with-us", priority: 0.6, changeFrequency: "monthly" },
    { path: "/report-incident", priority: 0.4, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  ];

  return [
    ...pages.map(({ path, priority, changeFrequency }) => ({
      url: absoluteUrl(path),
      changeFrequency,
      priority,
    })),
    ...getNewsPosts().map((post) => ({
      url: absoluteUrl(`/news/${post.slug}`),
      lastModified: post.publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
