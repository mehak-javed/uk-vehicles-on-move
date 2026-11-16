import { Hero } from "@/components/home/hero";
import { AnnouncementTicker } from "@/components/site/announcement-ticker";
import {
  AboutTeaser,
  Coverage,
  LatestNews,
  Partners,
  ServicesGrid,
  Testimonials,
} from "@/components/home/sections";

/**
 * Home page (US-04): hero, about, services, news, partners, testimonials,
 * then the gold announcement banner with the coverage map ("Where we
 * deliver") below it, in place of the closing CTA band (for now).
 */
export default function Home() {
  return (
    <>
      <Hero />
      <AboutTeaser />
      <ServicesGrid />
      <LatestNews />
      <Partners />
      <Testimonials />
      <AnnouncementTicker />
      <Coverage />
    </>
  );
}
