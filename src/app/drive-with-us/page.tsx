import type { Metadata } from "next";
import { CalendarClock, MapPinned, Route } from "lucide-react";

import { DriverApplicationForm } from "@/components/drive-with-us/driver-application-form";
import { Container } from "@/components/layout/container";
import { PhotoHero } from "@/components/site/photo-hero";

export const metadata: Metadata = {
  title: "Drive with us",
  description:
    "Apply to become a vehicle delivery driver with UK Vehicles On Move.",
  alternates: { canonical: "/drive-with-us" },
};

// Draft copy for client review.
const perks = [
  { icon: Route, text: "Varied journeys across the country" },
  { icon: CalendarClock, text: "Full-time, part-time and flexible work" },
  { icon: MapPinned, text: "Jobs offered near where you live" },
];

export default function DriveWithUsPage() {
  return (
    <>
      <PhotoHero
        title="Your next journey starts with us."
        label="Drive with us"
        description="We're always looking for reliable, professional drivers. Apply below and we'll be in touch."
        image={{ src: "/samples/photo-7.jpg" }}
      />
      <section className="py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-[1fr_18rem]">
          <DriverApplicationForm />
          <aside className="flex h-fit flex-col gap-5 rounded-2xl bg-grey-100 p-6 lg:order-last">
            <h2 className="font-sans text-base font-semibold">
              Why drive with us?
            </h2>
            <ul className="flex flex-col gap-4">
              {perks.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon
                    className="mt-0.5 size-5 shrink-0 text-gold-dark"
                    aria-hidden="true"
                  />
                  {text}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              You&apos;ll need a full UK driving licence and the right to work
              in the UK.
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
