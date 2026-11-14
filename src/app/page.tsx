import { Hero } from "@/components/home/hero";
import {
  AboutTeaser,
  Coverage,
  CtaBand,
  LatestNews,
  Partners,
  ServicesGrid,
  Testimonials,
} from "@/components/home/sections";

/**
 * Home page (US-04). Section order is part of the acceptance criteria:
 * hero, about, services, news, cities + map, partners, testimonials, CTA.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <AboutTeaser />
      <ServicesGrid />
      <LatestNews />
      <Coverage />
      <Partners />
      <Testimonials />
      <CtaBand />
    </>
  );
}
