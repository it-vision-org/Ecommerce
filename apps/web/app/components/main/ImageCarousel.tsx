"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageCarouselProps } from "@/types";

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ImageCarousel({
  images,
  initialIndex = 0,
  alt = "Image",
  onClose,
}: ImageCarouselProps) {
  const [current, setCurrent] = useState(initialIndex);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const total = images.length;

  const goTo = useCallback(
    (index: number, dir: "left" | "right") => {
      if (animating || total <= 1) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrent((index + total) % total);
        setAnimating(false);
        setDirection(null);
      }, 220);
    },
    [animating, total],
  );

  const prev = useCallback(() => goTo(current - 1, "right"), [current, goTo]);
  const next = useCallback(() => goTo(current + 1, "left"), [current, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, onClose]);

  // Lock body scroll
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const slideStyle: React.CSSProperties = animating
    ? {
        opacity: 0,
        transform:
          direction === "left" ? "translateX(-32px)" : "translateX(32px)",
        transition: "opacity 220ms ease, transform 220ms ease",
      }
    : {
        opacity: 1,
        transform: "translateX(0)",
        transition: "opacity 220ms ease, transform 220ms ease",
      };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f172a]/90 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/20"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      {total > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold">
          {current + 1} / {total}
        </div>
      )}

      {/* Main image */}
      <div
        className="relative w-full max-w-4xl mx-auto px-16 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prev button */}
        {total > 1 && (
          <button
            onClick={prev}
            className="absolute left-2 z-10 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/20 flex-shrink-0"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Image */}
        <div
          className="relative w-full"
          style={{ maxHeight: "70vh", aspectRatio: "16/10", ...slideStyle }}
        >
          <Image
            key={current}
            src={images[current]}
            alt={`${alt} ${current + 1}`}
            fill
            className="object-contain rounded-2xl"
            priority
          />
        </div>

        {/* Next button */}
        {total > 1 && (
          <button
            onClick={next}
            className="absolute right-2 z-10 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/20 flex-shrink-0"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {total > 1 && (
        <div
          className="absolute bottom-6 flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 border border-white/20 backdrop-blur"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => {
                if (i !== current) goTo(i, i > current ? "left" : "right");
              }}
              className={`relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200 ${
                i === current
                  ? "w-14 h-10 ring-2 ring-white ring-offset-1 ring-offset-transparent"
                  : "w-10 h-10 opacity-50 hover:opacity-80"
              }`}
              aria-label={`Go to image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
