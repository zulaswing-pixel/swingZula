"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Ruler,
  Layers,
  Palette,
  Brush,
  Lightbulb,
  BadgeCheck,
  Link,
  Sofa,
} from "lucide-react";

const CustomizationSection = () => {
  const title = "Your Vision, Our Craft";
  const subtitle = "Create Your Premium Acrylic Zula";
  const description = "Tailor every detail to perfection with premium materials and innovative features. From size to lighting, make it uniquely yours.";
  const ctaText = "WhatsApp Your Ideas";
  const ctaHref = "https://wa.me/7435078118";
  const image = "/video/video_1.mp4"; // Assuming video as image for consistency, but keeping video

  // Features from original, enhanced for thematic fit
  const featuresLeft = [
    { icon: Ruler, title: "Size", desc: "Custom length/width to match any space perfectly." },
    { icon: Layers, title: "Thickness", desc: "Choose ideal thickness for strength + aesthetics." },
    { icon: Palette, title: "Color Tint", desc: "Transparent, smoked, gold, frosted & more options." },
  ];

  const featuresRight = [
    { icon: Brush, title: "Printed Design", desc: "Mandala, Geometric, Abstract, or custom artwork." },
    { icon: Lightbulb, title: "LED Glow", desc: "Ambient lighting with remote control." },
    { icon: BadgeCheck, title: "Personalization", desc: "Name engraving, branding & special dates." },
    { icon: Link, title: "Chain Options", desc: "Premium SS304 chain links in multiple styles." },
    { icon: Sofa, title: "Cushion Add-ons", desc: "Weather-resistant premium fabric cushions." },
  ];

  // Adjust right features to 3 for balance, but keep original intent
  const featuresRightAdjusted = featuresRight.slice(0, 3); // Or keep as is, but for symmetry

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Subtle radial gradient overlay for modern depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(99,102,241,0.1),transparent)]" />
     
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center text-3xl md:text-5xl font-extrabold mb-8 px-6 tracking-tight relative z-10"
      >
        <span className="bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 bg-clip-text text-transparent text-transparent leading-snug block">
          {title}
        </span>
        <span className="block text-indigo-500 mt-4 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </span>
        <p className="text-gray-600 mt-2 text-sm md:text-base max-w-3xl mx-auto italic">
          {description}
        </p>
      </motion.h2>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start relative z-10">
        {/* ---------------- LEFT SIDE – FEATURES ---------------- */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid gap-6 md:gap-8 pt-4 pl-0 sm:pl-0 md:pl-8"
        >
          {featuresLeft.map((feature, index) => (
            <Feature key={index} {...feature} delay={index * 0.1} />
          ))}
        </motion.div>

        {/* ---------------- CENTER – IMAGE/VIDEO ---------------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative flex justify-center lg:col-span-1"
        >
          <div className="relative w-full max-w-md h-[300px] sm:h-[380px] md:h-[450px] rounded-3xl shadow-2xl overflow-hidden group">
            <video
              src={image}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              autoPlay
              muted
              loop
              playsInline
            />
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-blue-100/30" />
            {/* Decorative glow elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-indigo-200/30 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/20 rounded-full blur-lg animate-bounce" style={{ animationDelay: '1s' }} />
          </div>
        </motion.div>

        {/* ---------------- RIGHT SIDE – FEATURES ---------------- */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid gap-6 md:gap-8 pt-4"
        >
          {featuresRightAdjusted.map((feature, index) => (
            <Feature key={index} {...feature} delay={(index + 3) * 0.1} />
          ))}
          {/* If more features, they can stack, but adjusted for balance */}
        </motion.div>
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        className="mt-12 md:mt-16 flex justify-center relative z-10 cursor-pointer"
      >
        <motion.a
  href={ctaHref}
  target="_blank"
  rel="noopener noreferrer"
  className="group relative inline-block bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base md:text-lg"
  whileTap={{ scale: 0.98 }}
>
          {ctaText} →
          <motion.span
            className="absolute -inset-1 bg-gradient-to-r from-indigo-600/20 to-indigo-700/20 rounded-2xl -z-10 group-hover:opacity-100 opacity-0 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
     </motion.a>
      </motion.div>

      {/* Bottom Decorative Wave */}
      <motion.div
        initial={{ translateY: 50, opacity: 0 }}
        whileInView={{ translateY: 0, opacity: 0.8 }}
        viewport={{ once: true }}
        className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]"
      >
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className="w-full h-12 md:h-16 relative -translate-y-1"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="50%" stopColor="#e0e7ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 C150,60 450,0 600,30 C750,60 1050,0 1200,30 L1200,60 L0,60 Z"
            fill="url(#waveGradient)"
            className="animate-wave"
          />
        </svg>
        <style jsx>{`
          @keyframes wave {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(10px); }
          }
          .animate-wave {
            animation: wave 6s ease-in-out infinite;
          }
        `}</style>
      </motion.div>
    </section>
  );
};

const Feature = ({ icon: Icon, title, desc, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="flex gap-4 items-start p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-indigo-100/50"
    >
      <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-inner">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-base md:text-lg text-gray-800 mb-1">{title}</h4>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
};

export default CustomizationSection;