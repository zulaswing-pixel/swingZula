"use client";

import React, { useEffect } from 'react';
import { Home, Heart, Package, Truck, Shield, AlertTriangle, Phone, Mail, MapPin, Scale, Lock, Image, Sofa } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function TermsAndConditions() {
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
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-3">Terms & Conditions</h2>
            <p className="mt-8 text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
              Welcome to Swing Zula – your home for beautifully crafted swings, zulas, and indoor-outdoor furniture. By using our website or placing an order, you agree to abide by the following terms and conditions.
            </p>
          </div>

          {/* Compact Cards */}
          <div className="space-y-8">

            {/* 1. General */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Home className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">1. General</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Swing Zula reserves the right to modify these terms at any time. Continued use of the website after any changes constitutes your acceptance of the updated terms.
              </p>
            </div>

            {/* 2. Products & Pricing */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Sofa className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">2. Products & Pricing</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                All prices are in INR and inclusive of applicable taxes. Our swings, zulas, and furniture are handcrafted, so slight variations in color, texture, wood grain, and finish may occur compared to images. These natural differences add to the unique charm of each piece.
              </p>
            </div>

            {/* 3. Orders */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Package className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">3. Orders</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to accept or reject any order at our discretion. Orders may be cancelled due to stock unavailability, customization limitations, or payment issues. You will be promptly notified and fully refunded in such cases.
              </p>
            </div>

            {/* 4. Payments */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Lock className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">4. Payments</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                All payments are securely processed via Razorpay or other authorized gateways. We do not store your card or payment details on our servers. Transactions are encrypted and protected with industry-standard security.
              </p>
            </div>

            {/* 5. Shipping & Delivery */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Truck className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">5. Shipping & Delivery</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Delivery timelines are estimates and may vary based on location, product size, and courier partners. Large items like swings and zulas require special handling. We are not liable for delays caused by external factors. Free shipping applies on eligible orders within India.
              </p>
            </div>

            {/* 6. Returns, Refunds & Replacements */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <AlertTriangle className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">6. Returns, Refunds & Replacements</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Returns are accepted within 7 days of delivery only for manufacturing defects. Custom-made, assembled, or used items are non-returnable. Transit damage must be reported within 48 hours with clear images. Refunds are processed after quality inspection.
              </p>
            </div>

            {/* 7. Intellectual Property */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Image className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">7. Intellectual Property</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                All designs, images, photographs, content, and branding on Swing Zula are our exclusive property. Unauthorized use, reproduction, or distribution is strictly prohibited without written permission.
              </p>
            </div>

            {/* 8. Limitation of Liability */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Shield className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">8. Limitation of Liability</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We are not liable for indirect or consequential damages arising from product use, installation, or delivery delays. Our maximum liability is limited to the purchase value of the product.
              </p>
            </div>

            {/* 9. Governing Law */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Scale className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">9. Governing Law</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                These terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of courts in Surat, Gujarat.
              </p>
            </div>

          </div>

          {/* Final Contact Card */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 rounded-3xl shadow-2xl p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-10">We’re Here For You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-lg">
              <div>
                <Mail className="mx-auto mb-4" size={40} />
                <p className="font-semibold">Email</p>
                <p className="mt-1">swingzula@storeview.in</p>
              </div>
              <div>
                <Phone className="mx-auto mb-4" size={40} />
                <p className="font-semibold">Call / WhatsApp</p>
                <p className="mt-1">+91 74350 78118</p>
              </div>
              <div>
                <MapPin className="mx-auto mb-4" size={40} />
                <p className="font-semibold">Address</p>
                <p className="text-sm leading-relaxed mt-1">
                  412, Storeview<br />
                  New Escon Plaza, <br />
                  Chhaprabhatha Road,<br />
                  Amroli, Surat, - 394107

                </p>
              </div>
            </div>
            <p className="mt-12 text-xl italic opacity-90">~ Handcrafted Swings & Zulas Made with Love in Surat ~</p>
          </div>

        </div>
      </div>
    </>
  );
}