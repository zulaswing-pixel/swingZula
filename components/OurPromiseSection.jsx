"use client";

import React, { useState, useEffect } from "react";
import { Gem, Shield, Home, Wrench, Award } from "lucide-react";
import { useRouter } from "next/navigation";

const ModernWhyChooseUs = () => {
  const [activeCard, setActiveCard] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 5);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Gem,
      title: "Premium Grade Acrylic",
      subtitle: "Zero Yellowing",
      image: "/home_page/3/1.webp",
      gradient: "from-purple-400 via-purple-500 to-pink-500",
      lightGradient: "from-purple-100 to-pink-100",
    },
    {
      icon: Shield,
      title: "Safety Tested",
      subtitle: "Maximum Stability",
      image: "/home_page/3/2.webp",
      gradient: "from-blue-400 via-blue-500 to-cyan-500",
      lightGradient: "from-blue-100 to-cyan-100",
    },
    {
      icon: Home,
      title: "Custom-Fit Design",
      subtitle: "Every Interior",
      image: "/home_page/3/3.webp",
      gradient: "from-green-400 via-emerald-500 to-teal-500",
      lightGradient: "from-green-100 to-emerald-100",
    },
    {
      icon: Wrench,
      title: "Precision Crafted",
      subtitle: "CNC-Cut Finishing",
      image: "/home_page/3/4.webp",
      gradient: "from-orange-400 via-orange-500 to-red-500",
      lightGradient: "from-orange-100 to-red-100",
    },
    {
      icon: Award,
      title: "Direct Factory",
      subtitle: "No Middlemen",
      image: "/home_page/2/1_1.webp",
      gradient: "from-indigo-400 via-indigo-500 to-purple-600",
      lightGradient: "from-indigo-100 to-purple-100",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden py-20">
      
      {/* Floating orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-15 animate-pulse" />
      <div className="absolute -bottom-10 right-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-15 animate-pulse delay-2000" />
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-10 animate-pulse delay-1000" />

      <div className="relative z-10 container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-sm font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text uppercase tracking-widest">
            ✨ Why We Stand Apart
          </span>

          <h2 className="text-5xl md:text-7xl font-black mt-6 mb-6 text-slate-900 max-w-4xl mx-auto">
            Engineered for{" "}
            <span className="text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text">
              Perfection
            </span>
          </h2>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Five reasons why our acrylic swings are the ultimate choice for discerning homeowners
          </p>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">

          {/* Image */}
          <div className={`bg-gradient-to-br ${features[activeCard].gradient} p-1 rounded-3xl shadow-2xl`}>
            <div className="bg-white rounded-3xl">
              <img
                src={features[activeCard].image}
                alt={features[activeCard].title}
                className="w-full rounded-3xl"
              />
            </div>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveCard(idx)}
                  className={`w-full text-left p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                    activeCard === idx
                      ? `bg-gradient-to-br ${feature.lightGradient} shadow-xl scale-105`
                      : "bg-white hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-start gap-4 cursor-pointer">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        activeCard === idx
                          ? `bg-gradient-to-br ${feature.gradient}`
                          : "bg-slate-100"
                      }`}
                    >
                      <Icon
                        className={`w-7 h-7 ${
                          activeCard === idx ? "text-white" : "text-slate-700"
                        }`}
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{feature.title}</h4>
                      <p className="text-sm text-slate-600">{feature.subtitle}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => router.push("/collection")}
            className="px-8 py-4 cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full shadow-lg hover:scale-110 transition cursor-pointer"
          >
            Explore Our Collection →
          </button>
        </div>
      </div>
    </section>
  );
};

export default ModernWhyChooseUs;
