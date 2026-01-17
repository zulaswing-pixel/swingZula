"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

const TOTAL_IMAGES = 17; // change if needed

const Gallery = () => {
  const images = Array.from({ length: TOTAL_IMAGES }, (_, i) => ({
    src: `/gallery/img${i + 1}.webp`,
    alt: `Gallery Image ${i + 1}`,
  }));

  const [activeIndex, setActiveIndex] = useState(null);

  const close = () => setActiveIndex(null);
  const prev = () =>
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  // Keyboard controls
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex]);

  return (
    <>
      <Breadcrumbs />
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20 px-4">
        <div className="max-w-7xl mx-auto mt-10">

          {/* Header */}
          <div className="text-center mb-16">
            {/* <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow">
            <ImageIcon className="w-4 h-4" />
            Gallery Showcase
          </div> */}

            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
              Transform Your Space
            </h2>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Click any image to view it in full size with smooth navigation.
            </p>
          </div>

          {/* Grid (Lazy Loaded) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className="relative overflow-hidden rounded-xl shadow-xl group cursor-pointer"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {activeIndex !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">

            {/* Close */}
            <button
              onClick={close}
              className="absolute top-6 right-6 text-white hover:scale-110 cursor-pointer"
            >
              <X size={32} />
            </button>

            {/* Prev */}
            <button
              onClick={prev}
              className="absolute left-4 md:left-10 text-white hover:scale-110 cursor-pointer"
            >
              <ChevronLeft size={40} />
            </button>

            {/* Image */}
            <img
              src={images[activeIndex].src}
              alt={images[activeIndex].alt}
              className="max-h-[85vh] max-w-[90vw] rounded-xl shadow-2xl transition-all"
            />

            {/* Next */}
            <button
              onClick={next}
              className="absolute right-4 md:right-10 text-white hover:scale-110 cursor-pointer"
            >
              <ChevronRight size={40} />
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default Gallery;
