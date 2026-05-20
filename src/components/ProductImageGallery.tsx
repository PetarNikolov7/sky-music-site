"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImageGalleryProps = {
  productName: string;
  images: string[];
  fallbackImage?: string;
};

export default function ProductImageGallery({
  productName,
  images,
  fallbackImage,
}: ProductImageGalleryProps) {
  const galleryImages =
    images.length > 0 ? images : fallbackImage ? [fallbackImage] : [];

  const [selectedImage, setSelectedImage] = useState(galleryImages[0] ?? "");

  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="relative h-[460px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-black/20">
        <Image
          src={selectedImage}
          alt={productName}
          fill
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-contain p-8"
          priority
        />
      </div>

      {galleryImages.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {galleryImages.map((image, index) => {
            const active = selectedImage === image;

            return (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={
                  active
                    ? "relative h-24 overflow-hidden rounded-2xl border-2 border-sky-400 bg-white"
                    : "relative h-24 overflow-hidden rounded-2xl border border-white/10 bg-white opacity-75 transition hover:opacity-100"
                }
                aria-label={`Снимка ${index + 1} на ${productName}`}
              >
                <Image
                  src={image}
                  alt={`${productName} снимка ${index + 1}`}
                  fill
                  sizes="120px"
                  className="object-contain p-2"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}