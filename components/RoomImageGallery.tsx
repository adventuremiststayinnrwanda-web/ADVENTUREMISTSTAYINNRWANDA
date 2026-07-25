"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";

interface RoomImageGalleryProps {
  images: string[];
  roomName: string;
  showThumbs?: boolean;
}

export function RoomImageGallery({ images, roomName, showThumbs = true }: RoomImageGalleryProps) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) return null;

  const prev = () => setActive((a) => (a === 0 ? images.length - 1 : a - 1));
  const next = () => setActive((a) => (a === images.length - 1 ? 0 : a + 1));

  return (
    <div className="room-gallery">
      {/* Main Image */}
      <div className="room-gallery__main group">
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${roomName} – photo ${active + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 260px"
          className="object-cover transition-opacity duration-500"
          priority={active === 0}
        />

        {images.length > 1 && (
          <>
            {/* Prev */}
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="room-gallery__arrow room-gallery__arrow--left"
            >
              <ChevronLeft size={20} />
            </button>
            {/* Next */}
            <button
              onClick={next}
              aria-label="Next photo"
              className="room-gallery__arrow room-gallery__arrow--right"
            >
              <ChevronRight size={20} />
            </button>

            {/* Counter */}
            <div className="room-gallery__counter">
              <Images size={13} />
              {active + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbs && images.length > 1 && (
        <div className="room-gallery__thumbs">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              className={`room-gallery__thumb ${i === active ? "room-gallery__thumb--active" : ""}`}
            >
              <Image
                src={src}
                alt={`${roomName} thumbnail ${i + 1}`}
                fill
                sizes="60px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
