/**
 * Gallery photos. Static for now; managed from the admin area later (US-22).
 * Add real photos to /public/gallery and list them in `galleryImages`.
 */
import { showSampleContent } from "@/content/sample";

export type GalleryImage = {
  src: string;
  /** Describe what the photo shows, for screen readers. */
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

/** Real photos only. */
const galleryImages: GalleryImage[] = [];

const sampleImages: GalleryImage[] = Array.from({ length: 8 }, (_, i) => {
  const n = i + 1;
  const portrait = n % 3 === 0;
  return {
    src: `/samples/gallery-${n}.jpg`,
    alt: `Sample placeholder photo ${n}`,
    width: portrait ? 800 : 1200,
    height: portrait ? 1000 : 800,
    caption: `Sample photo ${n}`,
  };
});

export function getGalleryImages(): GalleryImage[] {
  if (galleryImages.length > 0) return galleryImages;
  return showSampleContent ? sampleImages : [];
}
