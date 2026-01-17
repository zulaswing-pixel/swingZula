"use client";

import React, { useEffect, useState } from "react";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-purple-600/20 to-pink-600/20 animate-pulse" />

      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/image-1.webp"
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 particle"
            style={{
              
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 text-center"
        style={{ transform: `translateY(${scrollY * 0.4}px)` }}
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-200 animate-fade">
            The Future of
          </span>
          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-fade delay-200">
            Modern Living
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto animate-fade delay-300">
          Experience luxury redefined with crystal-clear acrylic swings.
          Engineered for elegance, designed for comfort.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade delay-500 cursor-pointer">
          <a
            href="/collection"
            className="px-8 py-4 rounded-full text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition shadow-lg"
          >
            Explore Collection →
          </a>

          <a
            href="https://wa.me/7435078118"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition shadow-lg"
          >
            Chat Now
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 animate-bounce text-white/60">
          <p className="text-sm">Scroll to explore</p>
          ↓
        </div>
      </div>

      {/* 🔥 All animations INSIDE this component */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(10px, -20px);
          }
        }

        .particle {
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @keyframes fade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade {
          animation: fade 0.8s ease-out forwards;
          opacity: 0;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
}
