import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Quote } from "lucide-react";

import { UkCoverageMap } from "@/components/home/uk-coverage-map";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  },
  {
    title: "We collect",
    text: "A professional driver collects your vehicle at the agreed time and checks its condition.",
  },
  {
    title: "We deliver",
    text: "Your vehicle is driven straight to its destination and handed over in person.",
  },
];

export function AboutTeaser() {
  return (
    <section className="py-20 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="About us"
            title="Moving vehicles, the right way"
            description={`${siteConfig.name} delivers cars and vans across the UK for dealers, businesses and private owners. One point of contact, a clear price and a driver who treats your vehicle as their own.`}
          />
          <Button asChild variant="outline" size="lg" className="w-fit px-4">
            <Link href="/about">
              More about us <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
        <ol className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="flex gap-5 rounded-xl border border-border bg-card p-6"
            >
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink font-heading text-lg text-gold"
              >
                {i + 1}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export function ServicesGrid() {
  return (
    <section className="bg-grey-100 py-20 sm:py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          align="center"
          eyebrow="Our services"
          title="Whatever you need moving"
          description="Flexible vehicle delivery for one car or a whole fleet."
        />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const { title, description, icon: Icon } = service;
            const href = serviceHref(service);
            return (
              <li key={title}>
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardHeader className="gap-4">
                    <span className="flex size-12 items-center justify-center rounded-lg bg-ink text-gold">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <CardTitle className="font-heading text-xl">
                      <h3>{title}</h3>
                    </CardTitle>
                    <CardDescription className="text-base">
                      {description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto">
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-gold-dark hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      Learn more
                      <span className="sr-only">
                        {" "}
                        about {title.toLowerCase()}
                      </span>
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </CardFooter>
                </Card>
              </li>
            );
          })}
        </ul>
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
    <section className="bg-ink py-20 text-paper sm:py-24">
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
