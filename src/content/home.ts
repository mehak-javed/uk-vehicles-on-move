/**
 * Home page content. Static for now; news, testimonials and partners move to
 * the database and admin area in US-22.
 *
 * Rule: no fabricated content goes live. Sections whose list is empty
 * (news, testimonials, partners) are hidden automatically.
 */
export { featuredServices as services, serviceHref } from "./services";

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

export type Testimonial = { quote: string; name: string; role?: string };

/** Real, approved customer reviews only. */
export const testimonials: Testimonial[] = [];

export type Partner = { name: string; logo: string; href?: string };

/** Real partners with permission to show their logo only. */
export const partners: Partner[] = [];
