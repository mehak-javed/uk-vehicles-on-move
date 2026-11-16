import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AnnouncementTicker } from "@/components/site/announcement-ticker";
import { CookieBanner } from "@/components/site/cookie-banner";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { TopBar } from "@/components/site/top-bar";
import "./globals.css";

// Body text: clean sans-serif. Headings: classic serif for a premium feel.
const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${body.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        <TopBar />
        <SiteHeader />
        <AnnouncementTicker />
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
