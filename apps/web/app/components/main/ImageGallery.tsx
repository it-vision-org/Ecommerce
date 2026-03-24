"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { ImageGalleryProps } from "@/types";

export default function ImageGallery({
  images,
  title,
  onImageClick,
}: ImageGalleryProps) {
  const clickable =
    "cursor-pointer select-none transition-opacity hover:opacity-90 active:opacity-75";

  if (images.length === 0) {
    return (
      <div className="w-full aspect-video rounded-2xl bg-[#f1f5f9] flex flex-col items-center justify-center gap-2 text-[#94a3b8]">
        <ImageOff className="w-8 h-8" />
        <span className="text-xs font-medium">No image</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div
        className={`w-full aspect-video rounded-2xl overflow-hidden relative ${clickable}`}
        onClick={() => onImageClick(0)}
      >
        <Image src={images[0]} alt={title} fill className="object-cover" />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="w-full aspect-video rounded-2xl overflow-hidden grid grid-cols-2 gap-1">
        {images.map((src, i) => (
          <div
            key={i}
            className={`relative overflow-hidden ${clickable}`}
            onClick={() => onImageClick(i)}
          >
            <Image
              src={src}
              alt={`${title} ${i + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  // 3+ images: large left + 2 stacked right, last cell shows overflow count
  const rest = images.slice(1, 3);
  const overflow = images.length - 3;

  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden grid grid-cols-3 gap-1">
      <div
        className={`col-span-2 row-span-2 relative overflow-hidden ${clickable}`}
        onClick={() => onImageClick(0)}
      >
        <Image src={images[0]} alt={title} fill className="object-cover" />
      </div>
      {rest.map((src, i) => {
        const idx = i + 1;
        const isLast = i === rest.length - 1 && overflow > 0;
        return (
          <div
            key={i}
            className={`relative overflow-hidden ${clickable}`}
            onClick={() => onImageClick(idx)}
          >
            <Image
              src={src}
              alt={`${title} ${idx + 1}`}
              fill
              className="object-cover"
            />
            {isLast && (
              <div className="absolute inset-0 bg-[#0f172a]/60 flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  +{overflow + 1}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
