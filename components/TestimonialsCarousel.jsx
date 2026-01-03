"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TestimonialsCarousel({
  title = "What Our Customers Say About Their Zula.",
  testimonials = [
    {
      text: "The Acrylic Swing Zula is absolutely stunning! Crystal clear, super strong, and swings so smoothly. My balcony now feels like a luxury resort every evening.",
      author: "Neha Sharma",
      image: "/t2.webp", // Replace with your actual customer images
    },
    {
      text: "Best purchase ever! My kids love swinging in the Acrylic Zula daily. It's completely safe, beautiful, and doesn't yellow even in direct sunlight.",
      author: "Raj Patel",
      image: "/t1.webp",
    },
    {
      text: "The tinted Swing Zula gives perfect privacy while still letting in natural light. It swings so gently and looks premium — worth every penny!",
      author: "Priya Mehta",
      image: "/t6.webp",
    },
    {
      text: "Installation was super easy — just 15 minutes! The quality of acrylic and marine-grade steel is top-notch. Our Swing Zula is now the favorite spot at home.",
      author: "Amit Desai",
      image: "/t3.webp",
    },
    {
      text: "We got the custom printed pattern Swing Zula — it's a total conversation starter! Everyone who visits can't stop admiring and swinging in it.",
      author: "Sonia Kapoor",
      image: "/t4.jpg",
    },
  ],
  autoPlay = true,
  autoPlayInterval = 6000,
}) {
  const [startIndex, setStartIndex] = useState(0);
  const autoPlayRef = useRef();

  const getVisibleCount = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 1; // Changed to 1 for sequential scroll
      if (window.innerWidth >= 640) return 1; // Changed to 1 for sequential scroll
      return 1; // Changed to 1 for sequential scroll
    }
    return 1; // Changed to 1 for sequential scroll
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const prevSlide = () => {
    setStartIndex(
      (prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1)
    );
  };

  const nextSlide = () => {
    setStartIndex(
      (prevIndex) => (prevIndex + 1) % testimonials.length
    );
  };

  const handleManualNavigation = (direction) => {
    direction === "next" ? nextSlide() : prevSlide();
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (autoPlay) {
      autoPlayRef.current = setInterval(nextSlide, autoPlayInterval);
    }
  };

  useEffect(() => {
    if (autoPlay) {
      autoPlayRef.current = setInterval(nextSlide, autoPlayInterval);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [startIndex, autoPlay, autoPlayInterval]);

  const getVisibleTestimonials = () => {
    // For sequential scrolling, show only 1 testimonial at a time
    return [testimonials[startIndex]];
  };

  return (
    <section className="relative w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-snug mb-14 bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
          {title}
        </h2>

        {/* Testimonials Grid - Now sequential */}
        <div className="relative max-w-3xl mx-auto">
          <div className="grid grid-cols-1 gap-8">
            {getVisibleTestimonials().map((testimonial, idx) => (
              <AnimatePresence key={startIndex + idx} mode="wait">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-slate-200"
                >
                  {/* Image */}
                  <div className="w-28 h-28 rounded-full overflow-hidden shadow-xl mb-4 ring-4 ring-indigo-200">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Quote Icon */}
                  <Quote className="w-8 h-8 text-indigo-700 opacity-90 mb-3" />

                  {/* Text */}
                  <p className="text-slate-800 text-base md:text-lg mb-2 leading-relaxed">
                    “{testimonial.text}”
                  </p>

                  {/* Author */}
                  <p className="text-indigo-700 font-semibold text-sm md:text-base tracking-wide">
                    — {testimonial.author}
                  </p>
                </motion.div>
              </AnimatePresence>
            ))}
          </div>

          {/* Navigation Buttons */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => handleManualNavigation("prev")}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-blue-700 shadow-lg p-3 rounded-full hover:scale-110 transition-transform focus:outline-none focus:ring-4 focus:ring-indigo-300 cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => handleManualNavigation("next")}
            aria-label="Next testimonial"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-blue-700 shadow-lg p-3 rounded-full hover:scale-110 transition-transform focus:outline-none focus:ring-4 focus:ring-indigo-300 cursor-pointer"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}