"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Heart, Users, Sparkles, Home, CheckCircle, Award } from 'lucide-react';
import Breadcrumbs from "@/components/Breadcrumbs";


const Counter = ({ end, label, suffix, visible = true, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      let current = Math.floor(progress * end);
      setCount(current);
    }, 16);

    const timeout = setTimeout(() => {
      clearInterval(timer);
      setCount(end);
      setHasAnimated(true);
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [end, label, duration, visible]);

  const getFormatted = (value) => (label.includes('Customers') ? value.toLocaleString() : value);
  const displayValue = hasAnimated ? getFormatted(end) : getFormatted(count);
  const isAnimating = visible && !hasAnimated;

  return (
    <div className="text-center relative">
      <h3 className="text-4xl md:text-5xl font-bold mb-2 text-white">
        {displayValue}
        {suffix}
      </h3>
      <p className="text-lg font-medium text-blue-100">{label}</p>
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-ping opacity-75"></div>
        </div>
      )}
    </div>
  );
};

export default function SwingZulaAboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const values = [
    { icon: Sparkles, title: "Innovation", description: "Blending cutting-edge acrylic craftsmanship with timeless Indian swing design." },
    { icon: Heart, title: "Passion", description: "Crafted with love to bring comfort, style, and joy to your home." },
    { icon: Home, title: "Quality", description: "Premium transparent materials and robust engineering for lasting beauty." },
    { icon: Users, title: "Trust", description: "Over 1,000+ satisfied customers across India trust our commitment to excellence." }
  ];

  const stats = [
    { end: 5, label: "Years of Excellence", suffix: "+" },
    { end: 50, label: "Unique Designs", suffix: "+" },
    { end: 1000, label: "Happy Customers", suffix: "+" },
    { end: 100, label: "Made in India", suffix: "%" }
  ];

  const ourWay = [
    "Premium transparent acrylic for a modern floating look",
    "Precision engineering for safety and durability",
    "Hand-finished for perfect comfort",
    "Custom designs to match your home",
    "Eco-friendly and easy to maintain"
  ];

  const whyChoose = [
    "Modern acrylic meets traditional Indian Zula comfort",
    "Crystal-clear transparency for elegant interiors",
    "Safe for indoor and balcony use",
    "Easy installation and seamless experience",
    "Bespoke creations available",
    "Bringing relaxation and joy to every home"
  ];

  const statsRef = useRef(null);
  const [isStatsVisible, setIsStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) observer.observe(statsRef.current);

    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, []);

  return (
    <>
    <Breadcrumbs />
    <div className="min-h-screen bg-blue-50">
      {/* HEADER WITH FULL BANNER IMAGE */}
      <header className="relative w-full h-[400px] md:h-[600px] text-white overflow-hidden">
        {/* Banner background */}
        <div
          className="absolute inset-0 bg-center bg-cover filter brightness-75"
          style={{ backgroundImage: "url('/img18.png')" }}
        />

        {/* Floating Lights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-xl animate-float" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/3 blur-xl animate-float" style={{ animationDelay: "1s" }} />

        {/* Header Text */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold animate-fade-in-down">About Us</h1>
          <p className="text-xl font-body md:text-2xl mt-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Crafting Modern Comfort with Timeless Style
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Section 1: Our Story - The Beginning */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 mb-12 border border-white/20 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-10 h-10 text-blue-600" />
            <h2 className="text-3xl font-heading md:text-4xl font-bold relative pb-2 text-blue-900">
              Swing Zula – Our Story
              <span className="absolute bottom-0 left-0 w-16 h-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-400" />
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-lg font-body text-blue-800 leading-relaxed">
              <p>
                At <span className="font-semibold text-blue-900">Swing Zula</span>, we blend cutting-edge acrylic craftsmanship with timeless Indian design.
              </p>

              <p>
                We create modern, transparent swings that bring the relaxing joy of traditional Zulas into contemporary homes.
              </p>

              <p>
                Every Swing Zula is crafted with premium materials, precision engineering, and a passion for comfort and style.
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/img21.png"  // Replace with your Zula image
                alt="Modern Acrylic Swing Zula"
                className="w-full h-auto object-cover rounded-xl"
              />
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6" style={{ borderLeft: '4px solid #2563eb' }}>
            <p className="text-lg font-body text-blue-800 italic">
              Our customers across India love the seamless blend of tradition and modernity in every piece.
            </p>
            <p className="mt-4 font-medium font-heading text-blue-900 text-center text-xl">
              What began as a vision for better home comfort has become a beloved brand.
            </p>
          </div>
        </section>

        {/* Section 2: From Tradition to Legacy */}
        <section className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 border border-blue-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <Sparkles className="w-10 h-10 text-blue-600" />
            <h2 className="text-3xl md:text-4xl font-bold font-heading relative pb-2 text-blue-900">
              From Tradition to Modern Legacy
              <span className="absolute bottom-0 left-0 w-16 h-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-400" />
            </h2>
          </div>

          <div className="space-y-6 text-lg font-body text-blue-800 leading-relaxed max-w-4xl mx-auto">
            <p>
              We realized that traditional swings were loved but often didn't fit modern interiors. So we innovated with transparent acrylic to create "floating" Zulas that look stunning in any space.
            </p>

            <p>
              With customer feedback and relentless pursuit of quality, Swing Zula has grown into a trusted name for premium home swings.
            </p>

            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 my-8 text-center shadow-lg transform hover:scale-105 transition-transform duration-300" style={{ border: '2px solid #2563eb' }}>
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <p className="font-bold font-heading text-3xl mb-3 text-blue-900">
                And that's how Swing Zula came to life
              </p>
              <p className="text-blue-800 italic text-lg font-body">
                A brand dedicated to modern comfort, timeless joy, and exceptional craftsmanship.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow">
                <Heart className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold font-heading mb-2 text-blue-900">Passion & Love</h3>
                <p className="text-blue-700 text-sm font-body">Every Zula made with care and joy</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold font-heading mb-2 text-blue-900">Customer Focus</h3>
                <p className="text-blue-700 text-sm font-body">Designed based on real home needs</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow">
                <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold font-heading mb-2 text-blue-900">Innovation</h3>
                <p className="text-blue-700 text-sm font-body">Modern materials for timeless comfort</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Our Way - Our Promise */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 mb-12 border border-white/20 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <Home className="w-10 h-10 text-blue-600" />
            <h2 className="text-3xl md:text-4xl font-bold font-heading relative pb-2 text-blue-900">
              Our Way - Quality in Every Detail
              <span className="absolute bottom-0 left-0 w-16 h-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-400" />
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 shadow-md" style={{ borderLeft: '4px solid #2563eb' }}>
              <p className="font-semibold font-body text-blue-900 mb-6 text-xl">Every Swing Zula is crafted with:</p>
              <ul className="space-y-4">
                {ourWay.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                    <CheckCircle className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                    <span className="text-blue-800 font-medium font-body">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 flex flex-col justify-center">
              <div className="rounded-xl p-6 text-white shadow-lg" style={{ background: 'linear-gradient(to right, #2563eb, #1d4ed8)' }}>
                <p className="text-2xl font-bold mb-3 text-center">Premium materials. Expert craft. Pure joy.</p>
                <p className="text-center italic">The essence of modern living</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-md" style={{ border: '2px solid #93c5fd' }}>
                <p className="text-blue-800 text-lg mb-4 font-body">
                  Every Swing Zula brings elegance and relaxation to your space.
                </p>
                <div className="w-16 h-1 rounded-full mx-auto" style={{ background: 'linear-gradient(to right, #2563eb, #1d4ed8)' }} />
              </div>

              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-6 text-center shadow-md" style={{ border: '2px solid #2563eb' }}>
                <p className="font-semibold text-xl text-blue-900 italic font-body">
                  A perfect blend of tradition, innovation, and comfort.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group text-white rounded-xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105  relative overflow-hidden animate-fade-in-up"
              style={{
                background: "linear-gradient(to bottom right, #2563eb, #1d4ed8)",
                animationDelay: `${index * 0.2}s`,
              }}
            >
              <div className="relative z-10">
                <Counter end={stat.end} label={stat.label} suffix={stat.suffix} visible={isStatsVisible} />
              </div>
            </div>
          ))}
        </section>

        {/* Values Section */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 mb-12 border border-white/20">
          <h2 className="text-3xl font-heading md:text-4xl font-bold mb-3 text-center text-blue-900">Our Core Values</h2>
          <p className="text-center font-body text-blue-700 mb-8 text-lg">The foundation of every Swing Zula</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <article key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-blue-200">
                <div className="flex justify-center mb-4 text-blue-600">
                  <value.icon className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-900">{value.title}</h3>
                <p className="text-blue-800 font-body">{value.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 md:p-12 mb-12 shadow-lg border border-blue-100">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Award className="w-10 h-10 text-blue-600" />
            <h2 className="text-3xl font-heading md:text-4xl font-bold text-center text-blue-900">Why Choose Swing Zula?</h2>
          </div>
          <p className="text-center font-body text-blue-700 mb-8 text-lg">Experience modern elegance and comfort</p>
          <ul className="max-w-3xl mx-auto space-y-4">
            {whyChoose.map((feature, index) => (
              <li key={index} className="flex items-start space-x-3 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <CheckCircle className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                <span className="text-lg text-blue-800 font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Vision */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 mb-12 border border-white/20">
          <h2 className="text-3xl font-heading md:text-4xl font-bold mb-6 relative pb-4 text-blue-900">
            Our Vision
            <span className="absolute bottom-0 left-0 w-16 h-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-400" />
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-lg font-body text-blue-800">
                To bring modern, beautiful acrylic Zulas to every home in India and beyond.
              </p>
              <p className="text-lg font-body text-blue-800">
                We envision spaces filled with comfort, style, and the gentle sway that brings families together.
              </p>
              <p className="text-lg font-body text-blue-900 font-medium">
                Because every home deserves a touch of timeless joy.
              </p>
            </div>
            <div className="hidden md:block relative">
              <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto opacity-50 animate-pulse-slow" />
              <Home className="absolute inset-0 w-32 h-32 m-auto animate-bounce text-blue-600" />
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-white py-8 px-4 text-center" style={{ background: 'linear-gradient(to right, #2563eb, #1e40af)' }}>
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="text-lg font-body font-medium">From Vision to Your Home</p>
          <p className="text-blue-200 font-heading font-bold text-2xl">Swing Zula — Comfort Redefined</p>
          <p className="text-sm text-blue-100 font-body italic">Handcrafted in India | Designed for Joy | Built to Last</p>
        </div>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
    </>
  );
}


