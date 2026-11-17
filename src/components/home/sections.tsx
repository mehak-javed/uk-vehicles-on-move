import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  KeyRound,
  MapPin,
  MapPinned,
  Quote,
} from "lucide-react";

import { ServicesShowcase } from "@/components/home/services-showcase";
import { UkCoverageMap } from "@/components/home/uk-coverage-map";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import {
  featuredCities,
  partners,
  serviceHref,
  services,
  testimonials,
} from "@/content/home";
import { formatNewsDate, getNewsPosts } from "@/content/news";

const steps = [
  {
    title: "Request a quote",
    text: "Tell us the vehicle, collection and delivery addresses. We reply with a clear price.",
    icon: FileText,
    href: "/quote",
    action: "Get a quote",
  },
  {
    title: "We collect",
    text: "A professional driver collects your vehicle at the agreed time and checks its condition.",
    icon: KeyRound,
    href: "/services#door-to-door",
    action: "How collection works",
  },
  {
    title: "We deliver",
    text: "Your vehicle is driven straight to its destination and handed over in person.",
    icon: MapPinned,
    href: "/services#nationwide",
    action: "Where we deliver",
  },
];

/**
 * Home "About us" teaser with scroll animations: the text slides in, the
 * three steps appear one by one while a gold line fills down the timeline,
 * and each step's number turns gold as you reach it. Every step is a link
 * that lifts and reveals an arrow on hover or keyboard focus. Without
 * scroll-animation support, or with reduced motion, everything is static.
 */
export function AboutTeaser() {
  return (
    <section className="overflow-x-clip py-20 sm:py-28">
      <Container className="grid items-start gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <div className="scroll-reveal flex flex-col gap-8 lg:sticky lg:top-32">
          <SectionHeading
            eyebrow="About us"
            title="Moving vehicles, the right way"
            description={`${siteConfig.name} delivers cars and vans across the UK for dealers, businesses and private owners. One point of contact, a clear price and a driver who treats your vehicle as their own.`}
          />
          <Link
            href="/about"
            className="group flex w-fit items-center gap-4 rounded-full focus-visible:ring-3 focus-visible:ring-gold/60 focus-visible:outline-none"
          >
            <span className="font-geo text-sm font-medium tracking-[0.15em] uppercase">
              More about us
            </span>
            <span className="flex size-14 items-center justify-center rounded-full bg-ink text-gold transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none">
              <ArrowUpRight className="size-6" aria-hidden="true" />
            </span>
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          <p className="scroll-reveal font-geo text-xs font-medium tracking-[0.3em] text-gold-dark uppercase">
            How it works
          </p>
          <ol className="steps-timeline relative flex flex-col gap-5">
            {/* Timeline track, with a gold line that fills as you scroll */}
            <span
              aria-hidden="true"
              className="absolute top-8 bottom-8 left-[2.45rem] w-px bg-border sm:left-[2.7rem]"
            >
              <span className="steps-progress absolute inset-0 origin-top bg-gold" />
            </span>
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="step-reveal relative">
                  <Link
                    href={step.href}
                    className="group relative flex gap-5 overflow-clip rounded-2xl border border-border bg-card p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-xl focus-visible:-translate-y-1 focus-visible:border-gold focus-visible:ring-3 focus-visible:ring-gold/40 focus-visible:outline-none motion-reduce:transition-none sm:p-6"
                  >
                    {/* Big faint number behind the card */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-2 -bottom-8 font-geo text-[7rem] leading-none font-bold text-ink/[0.04] transition-colors duration-300 group-hover:text-gold/15"
                    >
                      0{i + 1}
                    </span>
                    <span
                      aria-hidden="true"
                      className="step-number relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-ink font-geo text-sm font-medium text-gold ring-4 ring-card transition-transform duration-300 group-hover:scale-110 sm:size-11"
                    >
                      {i + 1}
                    </span>
                    <div className="relative flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <Icon
                          className="size-5 text-gold-dark"
                          aria-hidden="true"
                        />
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{step.text}</p>
                      <span className="mt-1 flex items-center gap-2 text-sm font-medium text-gold-dark opacity-70 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                        {step.action}
                        <ArrowRight
                          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}

/** Photo for each service in the showcase (sample photos for now). */
const serviceImages: Record<string, { src: string; alt: string }> = {
  "door-to-door": {
    src: "/samples/photo-6.jpg",
    alt: "Red hatchback driving on an open country road",
  },
  "same-day": {
    src: "/samples/photo-3.jpg",
    alt: "Car transporter truck driving along a highway",
  },
  insured: {
    src: "/samples/photo-4.jpg",
    alt: "Black car secured inside a transport truck",
  },
  nationwide: {
    src: "/samples/photo-1.jpg",
    alt: "Car carrier truck transporting vehicles on a road",
  },
  trade: {
    src: "/samples/photo-2.jpg",
    alt: "Two cars loaded onto a car carrier truck",
  },
};

/**
 * Home "Our services": dark section with an interactive list of services
 * and, on large screens, a photo panel that changes with the active one.
 */
export function ServicesGrid() {
  const items = services.map((service) => {
    const Icon = service.icon;
    return {
      id: service.id,
      title: service.title,
      description: service.description,
      href: serviceHref(service),
      image: serviceImages[service.id] ?? serviceImages["door-to-door"],
      icon: <Icon className="size-6" aria-hidden="true" />,
    };
  });

  return (
    <section
      data-header-dark
      className="overflow-x-clip bg-ink py-20 text-paper sm:py-28"
    >
      <Container className="flex flex-col gap-14">
        <div className="scroll-reveal flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            tone="dark"
            eyebrow="Our services"
            title="Whatever you need moving"
            description="Flexible vehicle delivery for one car or a whole fleet."
          />
          <Link
            href="/services"
            className="group flex w-fit shrink-0 items-center gap-4 rounded-full focus-visible:ring-3 focus-visible:ring-gold/60 focus-visible:outline-none"
          >
            <span className="font-geo text-sm font-medium tracking-[0.15em] uppercase">
              All services
            </span>
            <span className="flex size-14 items-center justify-center rounded-full bg-gold text-ink transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none">
              <ArrowUpRight className="size-6" aria-hidden="true" />
            </span>
          </Link>
        </div>
        <ServicesShowcase items={items} />
      </Container>
    </section>
  );
}

/** Hidden until posts exist (real, or samples on previews). */
export function LatestNews() {
  const latest = getNewsPosts().slice(0, 3);
  if (latest.length === 0) return null;

  return (
    <section className="py-20 sm:py-24">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Latest news" title="Company updates" />
          <Button asChild variant="outline" size="lg" className="w-fit px-4">
            <Link href="/news">All news</Link>
          </Button>
        </div>
        <ul className="grid gap-6 md:grid-cols-3">
          {latest.map((post) => (
            <li key={post.slug}>
              <Card className="h-full">
                <CardHeader>
                  <time
                    dateTime={post.publishedAt}
                    className="text-sm text-muted-foreground"
                  >
                    {formatNewsDate(post.publishedAt)}
                  </time>
                  <CardTitle className="font-heading text-xl">
                    <h3>
                      <Link
                        href={`/news/${post.slug}`}
                        className="hover:underline"
                      >
                        {post.title}
                      </Link>
                    </h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** Featured cities followed by the UK coverage map. */
export function Coverage() {
  return (
    <section data-header-dark className="bg-ink py-20 text-paper sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <SectionHeading
            tone="dark"
            eyebrow="Where we deliver"
            title="Coverage across the United Kingdom"
            description="We collect and deliver nationwide. These are some of the cities we serve most often. Not listed? Ask us for a quote."
          />
          <ul className="flex flex-wrap gap-2" aria-label="Featured cities">
            {featuredCities.map((city) => (
              <li
                key={city.name}
                className="flex items-center gap-1.5 rounded-full border border-paper/15 px-3 py-1.5 text-sm"
              >
                <MapPin className="size-3.5 text-gold" aria-hidden="true" />
                {city.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center">
          <UkCoverageMap cities={featuredCities} />
        </div>
      </Container>
    </section>
  );
}

/** Hidden until real partner logos (with permission) exist. */
export function Partners() {
  if (partners.length === 0) return null;

  return (
    <section className="py-16" aria-labelledby="partners-heading">
      <Container className="flex flex-col items-center gap-10">
        <h2
          id="partners-heading"
          className="font-sans text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase"
        >
          Trusted by
        </h2>
        <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {partners.map((p) => (
            <li key={p.name}>
              <Image
                src={p.logo}
                alt={p.name}
                width={140}
                height={48}
                className="h-12 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** Hidden until real, approved reviews exist. */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-grey-100 py-20 sm:py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          align="center"
          eyebrow="Testimonials"
          title="What our customers say"
        />
        <ul className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.name}>
              <figure className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6">
                <Quote className="size-6 text-gold-dark" aria-hidden="true" />
                <blockquote className="flex-1 text-lg">“{t.quote}”</blockquote>
                <figcaption className="text-sm">
                  <span className="font-semibold">{t.name}</span>
                  {t.role && (
                    <span className="text-muted-foreground"> · {t.role}</span>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
