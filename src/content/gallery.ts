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

/** Most photos are 1408 x 768; pass the size for any that differ. */
const photo = (
  file: string,
  alt: string,
  [width, height] = [1408, 768],
): GalleryImage => ({ src: `/gallery/${file}.jpg`, alt, width, height });

const galleryImages: GalleryImage[] = [
  photo(
    "westminster",
    "Our car transporter on Westminster Bridge in front of Big Ben",
  ),
  photo(
    "highlands",
    "Our car transporter on a winding road through the Scottish Highlands",
  ),
  photo("liverpool", "Our truck driving along the Liverpool waterfront"),
  photo(
    "classic-car-cottage",
    "Our driver delivering a classic green sports car to a couple at their thatched cottage",
  ),
  photo("ferry", "Our car transporter driving off a ferry onto the quay"),
  photo(
    "angel-of-the-north",
    "Our truck passing the Angel of the North near Gateshead",
  ),
  photo(
    "enclosed-supercar",
    "An orange supercar being loaded into an enclosed transporter",
  ),
  photo(
    "family-delivery",
    "A family receiving their car from our driver outside their home",
  ),
  photo(
    "clifton-bridge",
    "Our loaded car transporter crossing the Clifton Suspension Bridge in Bristol",
    [1024, 572],
  ),
  photo(
    "electric-car-inspection",
    "Our driver inspecting an electric car with a tablet before loading",
  ),
  photo("cotswolds", "Our car transporter on a narrow Cotswolds village lane"),
  photo(
    "edinburgh",
    "Our car transporter on a cobbled street below Edinburgh Castle",
  ),
  photo(
    "securing-straps",
    "Close-up of a driver tightening a wheel strap on the transporter deck",
  ),
  photo(
    "dealership",
    "Two of our team checking paperwork beside the truck at a car dealership",
  ),
  photo(
    "fleet-sunrise",
    "Our fleet of trucks and drivers lined up at the depot at sunrise",
  ),
  photo(
    "handover",
    "Our driver shaking hands with a customer as their car is handed over",
  ),
  photo(
    "driver",
    "Our driver with car keys and a clipboard in front of a loaded transporter",
  ),
  photo(
    "night-services",
    "Our driver with a coffee in the cab at a motorway services at night",
  ),
  photo("in-the-cab", "Smiling driver at the wheel of the truck on a motorway"),
];

export function getGalleryImages(): GalleryImage[] {
  return galleryImages;
}
