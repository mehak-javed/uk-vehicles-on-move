import type { Metadata } from "next";
import { TriangleAlert } from "lucide-react";

import { Container } from "@/components/layout/container";
import { IncidentForm } from "@/components/report-incident/incident-form";
import { PageHeader } from "@/components/site/page-header";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Report an incident",
  description:
    "Report damage, an accident, a breakdown or a delay involving a vehicle we are moving.",
  alternates: { canonical: "/report-incident" },
};

export default function ReportIncidentPage() {
  const { phone } = siteConfig.contact;

  return (
    <>
      <PageHeader
        breadcrumb="Report an incident"
        title="Report an incident"
        description="Tell us about any damage, accident, breakdown or delay so we can look into it quickly."
      />
      <section className="py-12 sm:py-16">
        <Container size="narrow" className="flex flex-col gap-8">
          <div
            role="note"
            className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
          >
            <TriangleAlert
              className="mt-0.5 size-5 shrink-0 text-destructive"
              aria-hidden="true"
            />
            <p>
              <strong>In an emergency, call 999.</strong> If anyone is hurt or
              the vehicle is blocking the road, contact the emergency services
              first.
              {phone && (
                <>
                  {" "}
                  For urgent help from us, call{" "}
                  <a
                    href={phone.href}
                    className="font-semibold underline underline-offset-4"
                  >
                    {phone.label}
                  </a>
                  .
                </>
              )}
            </p>
          </div>
          <IncidentForm />
        </Container>
      </section>
    </>
  );
}
