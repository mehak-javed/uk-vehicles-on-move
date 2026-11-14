import { Hero } from "@/components/home/hero";
import { CtaBand } from "@/components/site/cta-band";
import {
  AboutTeaser,
  Coverage,
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
