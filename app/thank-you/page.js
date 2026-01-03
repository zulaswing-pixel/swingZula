"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, ShoppingBag, ArrowLeft } from "lucide-react";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('order');

  // Clear recentOrderId after showing
  if (typeof window !== "undefined") {
    localStorage.removeItem("recentOrderId");
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Premium Header Banner */}
        <header className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] mt-15 bg-cover bg-center" style={{ backgroundImage: "url('/b5.webp')" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 sm:px-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-blue-100 rounded-full flex items-center justify-center mb-4 sm:mb-5 md:mb-6 shadow-2xl">
              <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-blue-700" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold animate-fade-in-down bg-gradient-to-r from-slate-100 via-blue-200 to-indigo-100 bg-clip-text text-transparent">
              Thank You!
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mt-3 sm:mt-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              Your order has been placed successfully
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mt-2 sm:mt-3 text-blue-200 italic px-4">
              Handcrafted with Precision • Designed with Love • Delivered with Care
            </p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
          {/* Order Success Card - Premium Style */}
          <section className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 hover:shadow-3xl transition-all duration-700">
            {/* Top Gradient Accent */}
            <div className="h-1.5 sm:h-2 bg-gradient-to-r from-indigo-600 via-blue-700 to-indigo-800" />

            <div className="p-6 sm:p-8 md:p-12 lg:p-16 text-center">
              {/* Main Order Info */}
              <div className="mb-8 sm:mb-10 md:mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-full shadow-xl mb-6 sm:mb-7 md:mb-8">
                  <Package className="w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 text-white" />
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-5 md:mb-6 px-2 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                  Order #{orderId || "XXXX"}
                </h2>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 border-l-4 sm:border-l-6 md:border-l-8 border-indigo-600 shadow-inner">
                  <p className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-800 mb-3 sm:mb-4">
                    Congratulations! Your Acrylic Swing Zula is on its way
                  </p>
                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                    We've received your order and our craftsmen are carefully preparing your premium Acrylic Swing Zula — hand-polished, reinforced, and packed with utmost care just for you!
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 justify-center mt-8 sm:mt-10 md:mt-12">
                <Link href="/order-history" className="w-full sm:w-auto">
                  <button className="w-full flex items-center justify-center gap-2 sm:gap-3 cursor-pointer  bg-gradient-to-r from-indigo-600 to-blue-700 text-white px-6 sm:px-8 md:px-10 py-4 sm:py-4.5 md:py-5 rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl font-bold shadow-2xl hover:shadow-3xl hover:from-indigo-700 hover:to-blue-800 transition transform hover:scale-105">
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                    View All Orders
                  </button>
                </Link>

                <Link href="/" className="w-full sm:w-auto">
                  <button className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-white cursor-pointer   text-indigo-700 border-2 sm:border-3 md:border-4 border-indigo-600 px-6 sm:px-8 md:px-10 py-4 sm:py-4.5 md:py-5 rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl font-bold shadow-xl hover:shadow-2xl hover:bg-indigo-50 transition transform hover:scale-105">
                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>

            {/* Bottom Gradient */}
            <div className="h-px bg-gradient-to-r from-transparent via-indigo-600/30 to-transparent" />
          </section>

          {/* Footer */}
          <footer className="text-center py-8 sm:py-10 md:py-12 mt-10 sm:mt-12 md:mt-16 px-4">
            <p className="text-2xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
              Your Swing Zula
            </p>
            <p className="text-slate-600 text-base sm:text-lg md:text-xl mt-2 sm:mt-3 italic">
              Crafted with Precision • Designed for Relaxation • Delivered with Joy
            </p>
          </footer>
        </div>
      </div>

      {/* Same Animations */}
      <style jsx>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 1s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
      `}</style>
    </>
  );
}