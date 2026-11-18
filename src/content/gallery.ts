/**
 * Gallery photos, in display order. Images live in /public/gallery.
 * To add or replace photos, see docs/EDITING-CONTENT.md.
 */
export type GalleryImage = {
  src: string;
  /** Describe what the photo shows, for screen readers. */
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

const photo = (file: string, alt: string): GalleryImage => ({
  src: `/gallery/${file}.jpg`,
  alt,
  width: 1408,
  height: 768,
});

const galleryImages: GalleryImage[] = [
  photo(
    "westminster",
    "Our car transporter on Westminster Bridge in front of Big Ben",
  ),
  photo(
    "highlands",
    "Our car transporter on a winding road through the Scottish Highlands",
  ),
  photo("ferry", "Our car transporter driving off a ferry onto the quay"),
  photo(
    "dealership",
    "Two of our team checking paperwork beside the truck at a car dealership",
  ),
  photo(
    "driver",
    "Our driver with car keys and a clipboard in front of a loaded transporter",
  ),
  photo(
    "handover",
    "Our driver shaking hands with a customer as their car is handed over",
  ),
  photo("in-the-cab", "Smiling driver at the wheel of the truck on a motorway"),
];

export function getGalleryImages(): GalleryImage[] {
  return galleryImages;
}
