import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site-url";

/** robots.txt: allow everything except internal pages, and point to the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/styleguide"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
