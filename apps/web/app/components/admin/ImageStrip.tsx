"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface ImageStripProps {
  images: string[];
  onRemove: (index: number) => void;
}

export default function ImageStrip({ images, onRemove }: ImageStripProps) {
  if (images.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {images.map((src, i) => (
        <div
          key={i}
          className="relative w-16 h-16 rounded-xl overflow-hidden group flex-shrink-0"
        >
          <Image
            src={src}
            alt={`Image ${i + 1}`}
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute inset-0 bg-[#0f172a]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ))}
    </div>
  );
}
