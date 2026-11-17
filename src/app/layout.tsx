import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import { CookieBanner } from "@/components/site/cookie-banner";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import "./globals.css";

// Body text: clean sans-serif. Headings: classic serif for a premium feel.
const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// Geometric sans for the navbar and hero headline.
const geo = Montserrat({
  variable: "--font-geo",
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  display: "swap",
});

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Makes Open Graph image URLs absolute (required for social sharing)
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "UK Vehicles On Move",
    template: "%s | UK Vehicles On Move",
  },
  description: "Professional vehicle delivery across the United Kingdom.",
  // Shared Open Graph details; each page's own title and description are
  // used for the rest (and app/opengraph-image.png as the default image).
  openGraph: {
    type: "website",
    siteName: "UK Vehicles On Move",
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${body.variable} ${display.variable} ${geo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main
          id="main"
          tabIndex={-1}
          className="flex flex-1 flex-col outline-none"
        >
          {children}
        </main>
        <SiteFooter />
        <CookieBanner />
      </body>
    </html>
  );
}
