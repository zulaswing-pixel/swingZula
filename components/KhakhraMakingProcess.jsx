'use client';

import React from "react";
import {
  Sparkles,
  Ruler,
  Square,
  Weight,
  Link2,
  Gem,
  Timer,
  Sun,
  Scissors,
  ShieldAlert,
  ShieldCheck,
  SprayCan,
  ImageOff,
} from "lucide-react";
import { motion } from "framer-motion";

const TechnicalDetails = () => {
  const specs = [
    {
      label: "Material",
      image: "/home_page/1.webp",
      icon: <Sparkles className="w-6 h-6 text-blue-600" />,
      fallbackColor: "from-blue-100 to-indigo-100",
    },
    {
      label: "Thickness Options",
      image: "/home_page/2.webp",
      icon: <Ruler className="w-6 h-6 text-indigo-600" />,
      fallbackColor: "from-indigo-100 to-purple-100",
    },
    {
      label: "Standard Sizes",
      image: "/home_page/3.webp",
      icon: <Square className="w-6 h-6 text-purple-600" />,
      fallbackColor: "from-purple-100 to-pink-100",
    },
    {
      label: "Tested Load Capacity",
      image: "/home_page/4.webp",
      icon: <Weight className="w-6 h-6 text-red-600" />,
      fallbackColor: "from-red-100 to-orange-100",
    },
    {
      label: "Wire & Fittings",
      image: "/home_page/5.webp",
      icon: <Link2 className="w-6 h-6 text-slate-700" />,
      fallbackColor: "from-slate-100 to-gray-100",
    },
    {
      label: "Usage",
      image: "/home_page/6.webp",
      icon: <Gem className="w-6 h-6 text-indigo-500" />,
      fallbackColor: "from-indigo-100 to-blue-100",
    },
    {
      label: "Installation Time",
      image: "/home_page/7.webp",
      icon: <Timer className="w-6 h-6 text-orange-600" />,
      fallbackColor: "from-orange-100 to-yellow-100",
    },
    {
      label: "Edge Type",
      image: "/home_page/8.webp",
      icon: <Sun className="w-6 h-6 text-yellow-600" />,
      fallbackColor: "from-yellow-100 to-amber-100",
    },
  ];

  const highlights = [
    {
      id: 1,
      icon: Scissors,
      title: "Precision Laser-Cut & Hand-Finished for Child Safety",
      description: "Every edge is meticulously crafted and smoothed to prevent cuts and injuries",
      color: 'pink',
      gradient: 'from-pink-50 to-pink-100',
      accent: 'text-pink-600',
      image: "/home_page/2/1_1.webp"
    },
    {
      id: 2,
      icon: ShieldAlert,
      title: "Corrosion-Proof & Rust-Resistant Hardware",
      description: "Premium materials ensure durability in all weather conditions and environments",
      color: 'red',
      gradient: 'from-red-50 to-red-100',
      accent: 'text-red-600',
      image: "/home_page/2/1_2.webp"
    },
    {
      id: 3,
      icon: ShieldCheck,
      title: "Integrated Anti-Crack Reinforcement System",
      description: "Advanced structural design protects against impact and stress damage",
      color: 'green',
      gradient: 'from-green-50 to-green-100',
      accent: 'text-green-600',
      image: "/home_page/2/1_3.webp"
    },
    {
      id: 4,
      icon: SprayCan,
      title: "Hypoallergenic & Easy-to-Clean Surface",
      description: "Non-toxic finishes and smooth surfaces make maintenance simple and safe",
      color: 'blue',
      gradient: 'from-blue-50 to-blue-100',
      accent: 'text-blue-600',
      image: "/home_page/2/1_4.webp"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:py-16 md:py-20 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-6"
          >
            <Sparkles className="w-5 h-5" />
            Technical Excellence
          </motion.div>

         <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 bg-clip-text text-transparent leading-tight tracking-tight">
            Built to Last, Engineered for Safety
          </h2>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Premium acrylic craftsmanship combined with marine-grade hardware for unmatched strength and durability.
          </p>
        </motion.div>

        {/* Technical Specs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24"
        >
          {specs.map((spec, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -12, scale: 1.03 }}
              className="group relative bg-white/90 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/50 flex flex-col h-full"
            >
              {/* Image with Fallback */}
              <div className="relative h-64 bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={spec.image}
                  alt={spec.label}
                  className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback Placeholder */}
                <div className={`hidden w-full h-full items-center justify-center flex-col gap-4 bg-gradient-to-br ${spec.fallbackColor}`}>
                  <ImageOff className="w-16 h-16 text-gray-400" />
                  <p className="text-gray-500 text-sm font-medium">{spec.label}</p>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 bg-gradient-to-t from-white via-white to-transparent">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-md">
                    {spec.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                    {spec.label}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Safety & Quality Highlights */}
        <section className="py-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 bg-clip-text text-transparent">
              Safety & Quality Highlights
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full mx-auto mb-6" />
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every detail engineered for maximum safety and peace of mind for your family
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8"
          >
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className="group relative bg-white/90 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden border border-white/50 transition-all duration-500"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-90 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    <div className="overflow-hidden rounded-t-3xl">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = ''; // Hide broken image
                          e.currentTarget.classList.add('hidden');
                          e.currentTarget.parentElement.classList.add('bg-gray-200');
                        }}
                      />
                    </div>

                    <div className="p-7">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg`}>
                          <Icon className={`w-7 h-7 ${item.accent}`} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors leading-tight">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/60"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
              {[
                { icon: ShieldCheck, color: "green", title: "Child Safe Certified", desc: "Tested for safety & non-toxic materials" },
                { icon: ShieldCheck, color: "blue", title: "10+ Years Durability", desc: "Built to withstand daily use" },
                { icon: ShieldCheck, color: "purple", title: "Eco-Friendly", desc: "Sustainable & recyclable acrylic" },
              ].map((badge, i) => (
                <motion.div key={i} whileHover={{ scale: 1.08 }} className="flex flex-col items-center">
                  <div className={`p-5 rounded-2xl bg-${badge.color}-100 mb-4`}>
                    <badge.icon className={`w-10 h-10 text-${badge.color}-600`} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">{badge.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{badge.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default TechnicalDetails;