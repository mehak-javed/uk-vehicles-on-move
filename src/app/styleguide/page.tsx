import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { FieldError } from "@/components/forms/field-error";
import { FileInput } from "@/components/forms/file-input";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

// Internal page: available in development, and on deploy previews when
// ENABLE_STYLEGUIDE=true. Returns 404 on the live site.
const enabled =
  process.env.NODE_ENV !== "production" ||
  process.env.ENABLE_STYLEGUIDE === "true";

const colours = [
  {
    name: "ink",
    className: "bg-ink",
    hex: "#0B0B0C",
    use: "Text, dark sections",
  },
  {
    name: "paper",
    className: "bg-paper",
    hex: "#FAF8F3",
    use: "Page background",
  },
  {
    name: "gold",
    className: "bg-gold",
    hex: "#C9A227",
    use: "Accent on dark, buttons",
  },
  {
    name: "gold-light",
    className: "bg-gold-light",
    hex: "#E3C766",
    use: "Accent hover",
  },
  {
    name: "gold-dark",
    className: "bg-gold-dark",
    hex: "#7A5C0A",
    use: "Gold text on light",
  },
  {
    name: "grey-100",
    className: "bg-grey-100",
    hex: "#F1EEE7",
    use: "Muted surfaces",
  },
  {
    name: "grey-200",
    className: "bg-grey-200",
    hex: "#E4E0D6",
    use: "Borders",
  },
  {
    name: "grey-400",
    className: "bg-grey-400",
    hex: "#B5B2AA",
    use: "Text on dark, input borders",
  },
  {
    name: "grey-600",
    className: "bg-grey-600",
    hex: "#5C5A55",
    use: "Secondary text",
  },
  {
    name: "destructive",
    className: "bg-destructive",
    hex: "#B42318",
    use: "Errors",
  },
];

const contrast = [
  { pair: "Gold on ink", ratio: "8.1 : 1", className: "bg-ink text-gold" },
  { pair: "Ink on gold", ratio: "8.1 : 1", className: "bg-gold text-ink" },
  {
    pair: "Gold-dark on paper",
    ratio: "5.9 : 1",
    className: "bg-paper text-gold-dark",
  },
  {
    pair: "Grey-600 on paper",
    ratio: "6.5 : 1",
    className: "bg-paper text-grey-600",
  },
  {
    pair: "Grey-400 on ink",
    ratio: "9.3 : 1",
    className: "bg-ink text-grey-400",
  },
];

const buttonVariants = [
  "default",
  "accent",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const;

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6 border-t border-border py-12">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  if (!enabled) notFound();

  return (
    <div className="py-16">
      <Container className="flex flex-col">
        <SectionHeading
          as="h1"
          eyebrow="Design system · US-02"
          title="Styleguide"
          description="Every colour, type style and UI primitive used on the site, with its interactive states."
          className="pb-12"
        />

        <Section title="Logo">
          <div className="flex flex-wrap gap-6">
            <div className="rounded-lg border border-border bg-paper p-6">
              <Logo />
            </div>
            <div className="rounded-lg bg-ink p-6">
              <Logo tone="dark" />
            </div>
          </div>
        </Section>

        <Section title="Colours">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {colours.map((c) => (
              <li key={c.name} className="flex flex-col gap-2">
                <span
                  className={`h-16 rounded-lg border border-border ${c.className}`}
                />
                <span className="text-sm font-medium">{c.name}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {c.hex} · {c.use}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="Contrast (WCAG 2.2 AA)"
          hint="Normal text needs 4.5 : 1. Plain gold on light backgrounds is only 2.3 : 1, so it is never used for text there — use gold-dark instead."
        >
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {contrast.map((c) => (
              <li
                key={c.pair}
                className={`flex items-center justify-between rounded-lg border border-border p-4 ${c.className}`}
              >
                <span className="font-medium">{c.pair}</span>
                <span className="font-mono text-sm">{c.ratio}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="Typography"
          hint="Headings: Playfair Display. Body: Inter."
        >
          <div className="flex flex-col gap-4">
            <p className="font-heading text-5xl font-semibold tracking-tight">
              Heading 1 — Vehicle delivery
            </p>
            <p className="font-heading text-4xl font-semibold tracking-tight">
              Heading 2 — Across the UK
            </p>
            <p className="font-heading text-2xl font-semibold tracking-tight">
              Heading 3 — Trade and private
            </p>
            <p className="max-w-2xl text-lg">
              Lead paragraph. Fully insured drivers collect and deliver your
              vehicle safely, on time, anywhere in the United Kingdom.
            </p>
            <p className="max-w-2xl">
              Body text. Regular paragraph copy is set in Inter at 16px for
              comfortable reading on every screen size.
            </p>
            <p className="text-sm text-muted-foreground">
              Small / muted text for captions and hints.
            </p>
          </div>
        </Section>

        <Section title="Section heading">
          <SectionHeading
            eyebrow="Our services"
            title="Moving vehicles, the right way"
            description="Light background variant with an eyebrow, title and description."
          />
          <div className="rounded-xl bg-ink p-10">
            <SectionHeading
              tone="dark"
              align="center"
              eyebrow="Why choose us"
              title="Trusted by dealers and owners"
              description="Dark background variant, centred."
            />
          </div>
        </Section>

        <Section
          title="Buttons"
          hint="Hover each button and press Tab to see the focus ring. The last row shows the disabled state."
        >
          <div className="flex flex-wrap items-center gap-3">
            {buttonVariants.map((v) => (
              <Button key={v} variant={v}>
                {v}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="accent" size="xl">
              Get a Free Quote <ArrowRight data-icon="inline-end" />
            </Button>
            <Button size="xl">
              <Phone data-icon="inline-start" /> Call us
            </Button>
            <Button size="lg" variant="outline">
              Large
            </Button>
            <Button size="sm" variant="outline">
              Small
            </Button>
            <Button size="icon" variant="outline" aria-label="Call us">
              <Phone />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {buttonVariants.map((v) => (
              <Button key={v} variant={v} disabled>
                {v}
              </Button>
            ))}
          </div>
        </Section>

        <Section title="Badges">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </Section>

        <Section title="Cards">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Trade deliveries</CardTitle>
                <CardDescription>
                  For dealers, leasing and fleet companies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Card content area for supporting copy.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  Learn more
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <Badge variant="accent">Popular</Badge>
                <CardTitle>Private customers</CardTitle>
                <CardDescription>
                  Bought a car online? We bring it home.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-ink text-paper">
              <CardHeader>
                <CardTitle className="text-gold">Dark card</CardTitle>
                <CardDescription className="text-grey-400">
                  For highlight sections.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Section>

        <Section
          title="Form primitives"
          hint="Default, focus (Tab into a field), disabled and error states."
        >
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="sg-name">Full name</Label>
              <Input id="sg-name" placeholder="Jane Smith" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sg-disabled">Disabled input</Label>
              <Input id="sg-disabled" placeholder="Not editable" disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sg-email">Email (error state)</Label>
              <Input
                id="sg-email"
                type="email"
                defaultValue="jane@"
                aria-invalid="true"
                aria-describedby="sg-email-error"
              />
              <FieldError
                id="sg-email-error"
                message="Enter a valid email address."
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sg-vehicle">Vehicle type</Label>
              <Select>
                <SelectTrigger id="sg-vehicle" className="w-full">
                  <SelectValue placeholder="Select a vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="motorbike">Motorbike</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sg-vehicle-disabled">Select (disabled)</Label>
              <Select disabled>
                <SelectTrigger id="sg-vehicle-disabled" className="w-full">
                  <SelectValue placeholder="Unavailable" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="sg-docs">Upload documents</Label>
              <FileInput id="sg-docs" accept="image/*,application/pdf" />
              <p className="text-sm text-muted-foreground">
                JPG, PNG or PDF, up to 10 MB.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="sg-message">Message</Label>
              <Textarea
                id="sg-message"
                placeholder="Tell us about the vehicle and the journey…"
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="sg-message-error">Message (error state)</Label>
              <Textarea
                id="sg-message-error"
                aria-invalid="true"
                aria-describedby="sg-message-error-text"
              />
              <FieldError
                id="sg-message-error-text"
                message="Please enter a message."
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Checkbox id="sg-terms" />
                <Label htmlFor="sg-terms">I agree to the terms</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="sg-checked" defaultChecked />
                <Label htmlFor="sg-checked">Checked</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="sg-check-disabled" disabled />
                <Label htmlFor="sg-check-disabled">Disabled</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="sg-check-error" aria-invalid="true" />
                <Label htmlFor="sg-check-error">Error state</Label>
              </div>
            </div>
          </div>
        </Section>
      </Container>
    </div>
  );
}
