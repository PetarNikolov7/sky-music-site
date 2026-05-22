"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { homeBanners } from "@/data/banners";

const autoplayDelayMs = 5500;

export default function HomeBannerSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || homeBanners.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        return (currentIndex + 1) % homeBanners.length;
      });
    }, autoplayDelayMs);

    return () => window.clearInterval(timer);
  }, [paused]);

  if (homeBanners.length === 0) {
    return null;
  }

  function showPreviousBanner() {
    setActiveIndex((currentIndex) => {
      return currentIndex === 0
        ? homeBanners.length - 1
        : currentIndex - 1;
    });
  }

  function showNextBanner() {
    setActiveIndex((currentIndex) => {
      return (currentIndex + 1) % homeBanners.length;
    });
  }

  return (
    <section
      aria-label="Промоционални банери"
      className="relative mt-6 px-8 sm:mt-8 sm:px-11 md:px-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950 shadow-2xl shadow-black/40 md:rounded-[2.25rem]">
        <div className="relative h-[220px] sm:h-[290px] md:h-[360px] lg:h-[410px]">
          {homeBanners.map((banner, index) => {
            const active = index === activeIndex;

            return (
              <Image
                key={banner.id}
                src={banner.src}
                alt={banner.alt}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 1280px"
                style={{ objectPosition: banner.objectPosition }}
                className={`object-cover transition duration-1000 ease-out ${
                  active
                    ? "scale-100 opacity-100"
                    : "pointer-events-none scale-[1.035] opacity-0"
                }`}
              />
            );
          })}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/10" />
        </div>
      </div>

      {homeBanners.length > 1 && (
        <>
          <button
            type="button"
            onClick={showPreviousBanner}
            aria-label="Предишен банер"
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 px-1 text-5xl font-light leading-none text-white/65 transition hover:-translate-x-0.5 hover:text-white focus-visible:outline-none focus-visible:text-sky-300 sm:text-6xl"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={showNextBanner}
            aria-label="Следващ банер"
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 px-1 text-5xl font-light leading-none text-white/65 transition hover:translate-x-0.5 hover:text-white focus-visible:outline-none focus-visible:text-sky-300 sm:text-6xl"
          >
            ›
          </button>
        </>
      )}
    </section>
  );
}