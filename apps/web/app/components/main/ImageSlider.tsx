"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type ImageSliderProps = {
    images: string[];
    altBase?: string;
    initialIndex?: number;
    className?: string;
    imageClassName?: string;
    emptyState?: ReactNode;
    onRemove?: (index: number) => void;
    showCounter?: boolean;
    showArrows?: boolean;
    showDots?: boolean;
    stopPropagation?: boolean;
};

function normalizeIndex(index: number, total: number) {
    if (total <= 0) return 0;
    return ((index % total) + total) % total;
}

export default function ImageSlider({
    images,
    altBase = "Image",
    initialIndex = 0,
    className = "",
    imageClassName = "object-cover",
    emptyState,
    onRemove,
    showCounter = false,
    showArrows = true,
    showDots = true,
    stopPropagation = false,
}: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(() =>
        normalizeIndex(initialIndex, images.length),
    );

    useEffect(() => {
        if (images.length === 0) {
            setCurrentIndex(0);
            return;
        }

        setCurrentIndex((previous) => {
            if (previous >= 0 && previous < images.length) return previous;
            return normalizeIndex(initialIndex, images.length);
        });
    }, [images.length, initialIndex]);

    const isMultiImage = images.length > 1;
    const rootClassName = `relative overflow-hidden ${className}`.trim();

    const stopClickPropagation = (event: MouseEvent<HTMLButtonElement>) => {
        if (stopPropagation) event.stopPropagation();
    };

    const handlePrev = (event: MouseEvent<HTMLButtonElement>) => {
        stopClickPropagation(event);
        if (!isMultiImage) return;
        setCurrentIndex((index) => (index - 1 + images.length) % images.length);
    };

    const handleNext = (event: MouseEvent<HTMLButtonElement>) => {
        stopClickPropagation(event);
        if (!isMultiImage) return;
        setCurrentIndex((index) => (index + 1) % images.length);
    };

    const handleDotClick =
        (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
            stopClickPropagation(event);
            setCurrentIndex(index);
        };

    const handleRemove = (event: MouseEvent<HTMLButtonElement>) => {
        stopClickPropagation(event);
        onRemove?.(currentIndex);
    };

    if (images.length === 0) {
        if (!emptyState) return null;
        return <div className={rootClassName}>{emptyState}</div>;
    }

    return (
        <div className={rootClassName}>
            <Image
                src={images[currentIndex]}
                alt={isMultiImage ? `${altBase} ${currentIndex + 1}` : altBase}
                fill
                className={imageClassName}
            />

            {showArrows && isMultiImage && (
                <>
                    <button
                        type="button"
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </>
            )}

            {showDots && isMultiImage && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={handleDotClick(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-white" : "bg-white/50"
                                }`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {showCounter && isMultiImage && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full z-10">
                    {currentIndex + 1} / {images.length}
                </div>
            )}

            {onRemove && (
                <button
                    type="button"
                    onClick={handleRemove}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors z-10"
                    aria-label="Remove image"
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </div>
    );
}