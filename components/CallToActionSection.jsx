"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CallToActionSection({
  content = "Ready to Swing into Timeless Relaxation?",
  ctaText = "Shop All Jhula Swings",
  ctaHref = "/collection",
  backgroundGradient = "from-indigo-500 via-blue-500 to-indigo-600", 
  backgroundImage = "/img18.png", // Your jhula background image
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -90 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.05,
        ease: [0.34, 1.56, 0.64, 1],
      },
    }),
  };

  return (
    <AnimatePresence>
      <motion.section
        className="relative w-full py-16 md:py-24 text-center overflow-hidden"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Subtle dark overlay for better text readability on any background */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Floating particles with indigo/blue tint – swing-like motion */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-16 h-16 md:w-24 md:h-24 bg-indigo-300/40 rounded-full mix-blend-screen filter blur-2xl ${
                i % 2 === 0 ? "top-10 left-10" : "bottom-10 right-10"
              }`}
              animate={{
                y: [0, -60, 0],
                x: [0, 50, 0],
                rotate: [0, 360, 0],
                scale: [1, 1.4, 1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Dynamic gradient overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${backgroundGradient}`}
          animate={{
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 z-10">
          <motion.div variants={containerVariants}>
            {/* Heading – Now with fallback white text + strong shadow for guaranteed visibility */}
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-12 
                         bg-gradient-to-r from-slate-100 via-blue-100 to-indigo-100 bg-clip-text text-transparent
                         [text-shadow:_0_4px_20px_rgba(0,0,0,0.8)] 
                         supports-[not(bg-clip-text)]:text-white"
              variants={itemVariants}
            >
              {content.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  className="inline-block mr-3 last:mr-0"
                  custom={index}
                  variants={wordVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  style={{ perspective: "1000px" }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>

            {/* CTA Button */}
            <motion.a
              href={ctaHref}
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-bold px-10 py-5 rounded-2xl shadow-2xl overflow-hidden text-lg md:text-xl cursor-pointer"
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -4,
                boxShadow: "0 30px 60px -12px rgba(79, 70, 229, 0.6)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {ctaText}
                <motion.svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 10, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </span>

              {/* Shine effect */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-blue-300/80 to-indigo-300/80 -translate-x-full group-hover:translate-x-full"
                transition={{ duration: 0.8, ease: "easeOut" }}
              />

              {/* Glow ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400/40 via-blue-400/40 to-indigo-400/40 blur-xl -inset-2 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.5 }}
              />
            </motion.a>
          </motion.div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}