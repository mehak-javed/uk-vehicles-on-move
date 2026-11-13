/**
 * Site-wide configuration. Contact details are never hard-coded: they come
 * from environment variables so the same code runs locally, on previews and
 * in production. Anything left empty is simply hidden on the site.
 */

const env = (value: string | undefined) => value?.trim() || undefined;

const phone = env(process.env.NEXT_PUBLIC_COMPANY_PHONE);
const whatsapp = env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);

/** "07123 456789" → "+447123456789" for tel: links. */
function toE164(uk: string) {
  const digits = uk.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("44")) return `+${digits}`;
  if (digits.startsWith("0")) return `+44${digits.slice(1)}`;
  return digits;
}

export const siteConfig = {
  name: env(process.env.NEXT_PUBLIC_COMPANY_NAME) ?? "UK Vehicles On Move",
  tagline: "Professional vehicle delivery across the United Kingdom.",

  contact: {
    phone: phone ? { label: phone, href: `tel:${toE164(phone)}` } : undefined,
    whatsapp: whatsapp
      ? {
          // wa.me needs the international number without "+" or spaces
          href: `https://wa.me/${toE164(whatsapp).replace("+", "")}`,
        }
      : undefined,
    email: env(process.env.NEXT_PUBLIC_COMPANY_EMAIL),
  },

  mainNav: [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Services", href: "/services" },
    { title: "Gallery", href: "/gallery" },
    { title: "News", href: "/news" },
    { title: "Drive With Us", href: "/drive-with-us" },
    { title: "Contact", href: "/contact" },
  ],

  quoteLink: { title: "Get a Free Quote", href: "/quote" },
  signInLink: { title: "Sign in", href: "/login" },

  footerNav: {
    company: [
      { title: "About us", href: "/about" },
      { title: "Services", href: "/services" },
      { title: "Gallery", href: "/gallery" },
      { title: "News", href: "/news" },
    ],
    help: [
      { title: "Get a quote", href: "/quote" },
      { title: "Contact us", href: "/contact" },
      { title: "Drive with us", href: "/drive-with-us" },
      { title: "Report an incident", href: "/report-incident" },
    ],
    legal: [
      { title: "Privacy policy", href: "/privacy" },
      { title: "Cookie policy", href: "/cookies" },
      { title: "Terms & conditions", href: "/terms" },
    ],
  },

  /** Only profiles with a URL set are shown. */
  social: [
    { name: "Facebook", href: env(process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK) },
    { name: "Instagram", href: env(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM) },
    { name: "TikTok", href: env(process.env.NEXT_PUBLIC_SOCIAL_TIKTOK) },
    { name: "LinkedIn", href: env(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN) },
  ].filter((s): s is { name: SocialName; href: string } => Boolean(s.href)),

  /**
   * Announcement ticker messages. Admins will edit these from the back
   * office later (US-22); until then they live here.
   */
  announcements: [
    "Vehicle delivery across the United Kingdom",
    "Trade and private customers welcome",
    "Free, no-obligation quotes",
    "Professional drivers, door-to-door service",
  ] as string[],
} as const;

export type SocialName = "Facebook" | "Instagram" | "TikTok" | "LinkedIn";
export type NavItem = { title: string; href: string };
