/**
 * Gallery photos. Static for now; managed from the admin area later (US-22).
 *
 * The site is currently a draft for client review, so the gallery shows
 * dummy stock photos. Replace `galleryImages` with the company's own photos
 * (in /public/gallery) before launch.
 */
export type GalleryImage = {
  src: string;
  /** Describe what the photo shows, for screen readers. */
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

/**
 * Dummy stock photos from Unsplash (Unsplash License: free to use, no
 * attribution required). Photo IDs are noted so they can be traced.
 */
const sample = (
  n: number,
  width: number,
  height: number,
  alt: string,
): GalleryImage => ({
  src: `/samples/photo-${n}.jpg`,
  alt,
  width,
  height,
  caption: `Sample photo ${n}`,
});

const galleryImages: GalleryImage[] = [
  sample(1, 878, 1200, "Car carrier truck transporting vehicles on a road"), // q36Yp9RpHa0
  sample(2, 1200, 676, "Two cars loaded onto a car carrier truck"), // vvnZdwe80EE
  sample(3, 1200, 752, "Car transporter truck driving along a highway"), // 9iTgJ8mv_S4
  sample(4, 1200, 900, "Black luxury car secured inside a red transport truck"), // ZUC0RGbVfME
  sample(5, 799, 1200, "Classic car on the back of a flatbed recovery truck"), // iJGax56o5yU
  sample(6, 1200, 899, "Red hatchback driving on an open country road"), // bFTVxTo266E
  sample(
    7,
    1200,
    801,
    "Driver's view of hands on the steering wheel on a snowy road",
  ), // XuDPnpox8tc
  sample(8, 799, 1200, "Aerial view of a car driving down a country road"), // IEaFYkVMwQA
];

export function getGalleryImages(): GalleryImage[] {
  return galleryImages;
}
