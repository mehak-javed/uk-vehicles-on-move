import type { Metadata } from "next";
import { ImageIcon } from "lucide-react";

import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { Container } from "@/components/layout/container";
import { CtaBand } from "@/components/site/cta-band";
import { PageHeader } from "@/components/site/page-header";
import { getGalleryImages } from "@/content/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos of vehicles we have collected and delivered across the UK.",
};

export default function GalleryPage() {
  const images = getGalleryImages();

  return (
    <>
      <PageHeader
        breadcrumb="Gallery"
        title="Gallery"
        description="A look at some of the vehicles we've moved. Select a photo to view it full size."
      />
      <section className="py-16 sm:py-20">
        <Container>
          {images.length > 0 ? (
            <GalleryGrid images={images} />
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-20 text-center">
              <ImageIcon
                className="size-10 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="text-lg font-medium">Photos coming soon</p>
              <p className="max-w-md text-muted-foreground">
                We&apos;re putting together photos of our recent work. Check
                back shortly.
              </p>
            </div>
          )}
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
