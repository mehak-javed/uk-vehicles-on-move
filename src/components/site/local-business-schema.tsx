import { siteConfig } from "@/config/site";
import { absoluteUrl, SITE_URL } from "@/lib/site-url";

/**
 * LocalBusiness structured data (JSON-LD) so search engines can show the
 * company's name, logo, contact details and service area. Contact details
 * come from the same environment variables as the rest of the site.
 */
export function LocalBusinessSchema() {
  const { phone, email } = siteConfig.contact;

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: siteConfig.name,
    description: siteConfig.tagline,
    url: SITE_URL,
    logo: absoluteUrl("/brand/logo-full.png"),
    image: absoluteUrl("/opengraph-image.png"),
    areaServed: { "@type": "Country", name: "United Kingdom" },
    ...(phone && { telephone: phone.href.replace("tel:", "") }),
    ...(email && { email }),
    ...(siteConfig.social.length > 0 && {
      sameAs: siteConfig.social.map((s) => s.href),
    }),
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; "<" is escaped to avoid </script> issues.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
