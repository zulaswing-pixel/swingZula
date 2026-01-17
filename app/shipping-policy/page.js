"use client";

import React, { useEffect } from 'react';
import { Truck, MapPin, Clock, Package, Shield, Bell, AlertCircle, Phone, Mail, Home } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ShippingPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Breadcrumbs />
      <div className="pt-16 pb-12 px-5 bg-gradient-to-br from-sky-50 to-white min-h-screen">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 mb-12 border border-sky-200 text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-blue-700 mb-4">
              Swing Zula
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-3">Delivery & Shipping Policy</h2>
            <p className="mt-8 text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
              At Swing Zula, we ensure your beautifully crafted swings, zulas, and furniture reach you safely and on time — delivered with care across India.
            </p>
          </div>

          <div className="space-y-8">

            {/* 1. Our Commitment */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Shield className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">1. Our Commitment</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We partner with trusted logistics providers to deliver your handcrafted swings and furniture securely. Every piece is carefully packed to prevent damage during transit.
              </p>
            </div>

            {/* 2. Shipping Coverage */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <MapPin className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">2. Where We Deliver</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">We proudly ship across India, including:</p>
              <ul className="mt-3 space-y-2 text-gray-600 ml-6">
                <li>• All major metro cities</li>
                <li>• Tier-1, Tier-2 & most Tier-3 towns</li>
                <li>• Select remote areas (subject to courier serviceability)</li>
              </ul>
              <p className="mt-3 text-gray-600 text-sm">
                <strong>Note:</strong> Orders to highly remote or restricted areas may require special arrangements or could be cancelled with a full refund.
              </p>
            </div>
            {/* 3. Order Processing Time */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Clock className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">3. Order Processing Time</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                All our products are <strong>made on order</strong> to ensure premium craftsmanship and quality.<br />
                Order preparation and manufacturing typically take <strong>6–8 business days</strong> before dispatch.
              </p>
            </div>


            {/* 4. Expected Delivery Timeline */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Truck className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">4. Expected Delivery Timeline</h2>
              </div>
              <div className="space-y-3 text-gray-700">
                <p>• Metro & Major Cities: <strong>5–7 business days</strong></p>
                <p>• Tier-2 & Tier-3 Locations: <strong>7–10 business days</strong></p>
                <p>• Remote/Rural Areas: <strong>10–15 business days</strong></p>
              </div>
              <p className="mt-4 text-gray-600 text-sm">
                Timelines are estimates. Delays may occur due to holidays, weather, or courier constraints — we appreciate your understanding!
              </p>
            </div>

            {/* 5. Packaging */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Package className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">5. Secure Packaging</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">Your swing or furniture is packed with extra care:</p>
              <ul className="mt-3 space-y-2 text-gray-600 ml-6">
                <li>• Heavy-duty corrugated boxes</li>
                <li>• Protective bubble wrap & foam padding</li>
                <li>• Wooden crating for large/extra-fragile items</li>
                <li>• Tamper-evident sealing</li>
              </ul>
              <p className="mt-3 text-gray-700 text-sm italic">So it arrives in perfect condition, ready to bring joy to your home.</p>
            </div>

            {/* 6. Shipping Charges */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Home className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">6. Shipping Charges</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Shipping charges are calculated based on weight, dimensions, and delivery location.<br />
                Exact charges (if any) will be displayed at checkout before payment.<br />
                <strong>Free shipping</strong> offers may apply on select promotions or high-value orders.
              </p>
            </div>

            {/* 7. Tracking Your Order */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Bell className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">7. Tracking & Updates</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Once your order is dispatched, you’ll receive tracking details via <strong>Email and SMS</strong>. You can track your swing’s journey in real-time.
              </p>
            </div>

            {/* 8. Delivery Partners */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Truck className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">8. Our Delivery Partners</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We collaborate with reliable logistics partners specializing in furniture and large-item delivery to ensure safe handling and timely arrival.
              </p>
            </div>

            {/* 9. Issues During Delivery */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <AlertCircle className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">9. Damaged or Delayed Delivery</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">
                In case of damage during transit, please report within <strong>48 hours</strong> with photos. We’ll guide you through replacement or resolution.<br />
                Delays beyond our control (weather, strikes, etc.) are unfortunate but we’ll keep you informed every step of the way.
              </p>
            </div>

          </div>

          {/* Final Contact Card */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 rounded-3xl shadow-2xl p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">We’re Here For You</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
              Have questions about your delivery? Our team is always ready to help.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-lg">
              <div className="flex flex-col items-center">
                <Mail className="mb-4" size={40} />
                <p>swingzula@storeview.in</p>
              </div>
              <div className="flex flex-col items-center">
                <Phone className="mb-4" size={40} />
                <p>+91 74350 78118</p>
              </div>
            </div>
            <p className="mt-12 text-xl italic opacity-90">
              ~ Handcrafted with Love & Delivered with Care from Surat ~
            </p>
          </div>

        </div>
      </div>
    </>
  );
}