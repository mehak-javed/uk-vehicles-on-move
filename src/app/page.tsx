import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { LocalBusinessSchema } from "@/components/site/local-business-schema";
import { ParallaxBand } from "@/components/site/parallax-band";
import {
  AboutTeaser,
  Coverage,
  Partners,
  ServicesGrid,
  Testimonials,
} from "@/components/home/sections";

export const metadata: Metadata = {
  title: { absolute: "UK Vehicles On Move | Vehicle Delivery Across the UK" },
  description:
    "Professional door-to-door car, van and motorbike delivery across the United Kingdom for dealers, businesses and private owners. Get a free quote.",
  alternates: { canonical: "/" },
};

/**
 * Home page (US-04): hero, about, services, partners, testimonials,
 * then the coverage map ("Where we
 * deliver") below it, in place of the closing CTA band (for now).
 */
export default function Home() {
  return (
    <>
      <LocalBusinessSchema />
      <Hero />
      <AboutTeaser />
      <ServicesGrid />
      <ParallaxBand
        image={{ src: "/samples/photo-2.jpg" }}
        quote="From one car to a whole fleet, delivered with care."
        caption="Across the UK"
      />
      <Partners />
      <Testimonials />
      <Coverage />
    </>
  );
}
