/**
 * Home page content. Static for now; news, testimonials and partners move to
 * the database and admin area in US-22.
 *
 * Rule: no fabricated content goes live. Sections whose list is empty
 * (news, testimonials, partners) are hidden automatically.
 */
import type { LucideIcon } from "lucide-react";
import { Building2, Clock, DoorOpen, MapPinned } from "lucide-react";

export type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
  /** Anchor on /services (US-05). */
  href: string;
};

export const services: Service[] = [
  {
    title: "Door-to-door delivery",
    description:
      "We collect your vehicle from one address and drive it directly to the next, with no depots and no waiting around.",
    icon: DoorOpen,
    href: "/services#door-to-door",
  },
  {
    title: "Same-day delivery",
    description:
      "Need it moved today? Book early and a driver can collect and deliver your vehicle on the same day.",
    icon: Clock,
    href: "/services#same-day",
  },
  {
    title: "Nationwide coverage",
    description:
      "From city centres to rural addresses, we move vehicles the length and breadth of the country.",
    icon: MapPinned,
    href: "/services#nationwide",
  },
  {
    title: "Trade & dealer",
    description:
      "Reliable, repeatable vehicle movements for dealerships, leasing companies, auctions and fleets.",
    icon: Building2,
    href: "/services#trade",
  },
];

export type City = { name: string; lon: number; lat: number };

/** Featured cities (placeholder list until the client confirms). */
export const featuredCities: City[] = [
  { name: "London", lon: -0.13, lat: 51.51 },
  { name: "Birmingham", lon: -1.9, lat: 52.49 },
  { name: "Manchester", lon: -2.24, lat: 53.48 },
  { name: "Leeds", lon: -1.55, lat: 53.8 },
  { name: "Liverpool", lon: -2.98, lat: 53.41 },
  { name: "Bristol", lon: -2.59, lat: 51.45 },
  { name: "Newcastle", lon: -1.61, lat: 54.98 },
  { name: "Nottingham", lon: -1.15, lat: 52.95 },
  { name: "Southampton", lon: -1.4, lat: 50.9 },
  { name: "Cardiff", lon: -3.18, lat: 51.48 },
  { name: "Glasgow", lon: -4.25, lat: 55.86 },
  { name: "Edinburgh", lon: -3.19, lat: 55.95 },
];

export type NewsPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date, e.g. "2026-11-14" */
  publishedAt: string;
};

/** Real posts only. Added in US-06 / US-22. */
export const newsPosts: NewsPost[] = [];

export type Testimonial = { quote: string; name: string; role?: string };

/** Real, approved customer reviews only. */
export const testimonials: Testimonial[] = [];

export type Partner = { name: string; logo: string; href?: string };

/** Real partners with permission to show their logo only. */
export const partners: Partner[] = [];
