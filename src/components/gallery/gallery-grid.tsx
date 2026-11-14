"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GalleryImage } from "@/content/gallery";

/**
 * Photo grid with an accessible lightbox (Radix Dialog): focus is trapped
 * while open, Escape closes it and focus returns to the photo that opened it.
 * Left/Right arrow keys move between photos.
 */
export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;
  const current = open ? images[index] : null;

  // Thumbnails, so focus can return to the last photo viewed on close
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastViewed = useRef(0);

  const show = (next: number) => {
    const i = (next + images.length) % images.length;
    lastViewed.current = i;
    setIndex(i);
  };

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, i) => (
          <li key={image.src}>
            <button
              type="button"
              ref={(el) => {
                thumbs.current[i] = el;
              }}
              onClick={() => show(i)}
              aria-label={`Open photo ${i + 1} of ${images.length}: ${image.alt}`}
              className="group block w-full overflow-hidden rounded-xl focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              <Image
                src={image.src}
                alt=""
                width={image.width}
                height={image.height}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={open} onOpenChange={(o) => !o && setIndex(null)}>
        <DialogContent
          className="max-w-[min(92vw,1100px)] gap-3 border-none bg-ink p-3 text-paper sm:max-w-[min(92vw,1100px)] sm:p-4"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            thumbs.current[lastViewed.current]?.focus();
          }}
          onKeyDown={(e) => {
            if (index === null) return;
            if (e.key === "ArrowRight") show(index + 1);
            if (e.key === "ArrowLeft") show(index - 1);
          }}
        >
          {current && index !== null && (
            <>
              <DialogTitle className="sr-only">
                Photo {index + 1} of {images.length}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {current.alt}. Use the left and right arrow keys to move between
                photos, and Escape to close.
              </DialogDescription>
              <div className="relative flex max-h-[78vh] items-center justify-center">
                <Image
                  src={current.src}
                  alt={current.alt}
                  width={current.width}
                  height={current.height}
                  sizes="92vw"
                  className="h-auto max-h-[78vh] w-auto rounded-md object-contain"
                />
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <Button
                  variant="ghost"
                  size="icon-lg"
                  onClick={() => show(index - 1)}
                  aria-label="Previous photo"
                  className="text-paper hover:bg-paper/10 hover:text-paper"
                >
                  <ChevronLeft className="size-6" />
                </Button>
                <p aria-live="polite" className="text-center text-grey-400">
                  {current.caption && (
                    <span className="text-paper">{current.caption} · </span>
                  )}
                  {index + 1} / {images.length}
                </p>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  onClick={() => show(index + 1)}
                  aria-label="Next photo"
                  className="text-paper hover:bg-paper/10 hover:text-paper"
                >
                  <ChevronRight className="size-6" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
