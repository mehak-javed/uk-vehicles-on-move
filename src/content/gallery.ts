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

const photo = (
  n: string,
  width: number,
  height: number,
  alt: string,
): GalleryImage => ({ src: `/gallery/truck-${n}.jpg`, alt, width, height });

const galleryImages: GalleryImage[] = [
  photo(
    "02",
    831,
    561,
    "Red car transporter crossing Westminster Bridge by Big Ben",
  ),
  photo(
    "03",
    792,
    561,
    "Car transporter on a winding road through misty hills",
  ),
  photo("10", 831, 549, "Loaded car transporter driving along a motorway"),
  photo(
    "12",
    831,
    555,
    "Classic silver sports car being loaded onto a transporter",
  ),
  photo("05", 831, 561, "Car transporter driving onto a ferry deck"),
  photo(
    "04",
    831,
    561,
    "Driver lowering the upper deck of a car transporter at dusk",
  ),
  photo("06", 831, 475, "Car transporter in a floodlit depot at night"),
  photo("16", 831, 552, "Classic car and transporter arriving at a gated site"),
  photo("11", 831, 555, "Transporter cab leaving through a site gate"),
  photo(
    "17",
    831,
    552,
    "Driver standing beside his truck on a farm track with cattle",
  ),
  photo(
    "18",
    792,
    552,
    "Driver and truck on an airfield next to a light aircraft",
  ),
  photo("20", 831, 552, "Car transporter driving through heavy rain"),
  photo(
    "01",
    831,
    561,
    "Driver handing over paperwork outside a car dealership",
  ),
  photo(
    "07",
    831,
    433,
    "Driver handing car keys to a customer outside his home",
  ),
  photo("19", 831, 552, "Smiling driver in the cab of a red truck"),
  photo("13", 792, 555, "Driver enjoying a coffee break at a truck stop"),
  photo("14", 831, 555, "Classic car secured on the transporter's lower deck"),
  photo("15", 831, 555, "Red truck parked at a roadside service station"),
];

export function getGalleryImages(): GalleryImage[] {
  return galleryImages;
}
