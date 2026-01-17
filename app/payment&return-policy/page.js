"use client";

import React, { useEffect } from 'react';
import { Package, Clock, Truck, CreditCard, AlertCircle, Mail, Phone, Shield } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ReturnPolicy() {
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
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-3">Return & Refund Policy</h2>
            <p className="text-lg text-blue-600 font-medium">Effective Date: 25 December 2025</p>
            <p className="mt-8 text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
              We want you to love your handcrafted swing or zula. If something isn’t right, we’re here to make it right — with transparency and care.
            </p>
          </div>

          <div className="space-y-8">

            {/* 1. Refund Eligibility */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Package className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">1. Refund Eligibility</h2>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                Returns and refunds are accepted only under the following conditions:
              </p>

              <ul className="space-y-3 text-gray-600 ml-6">
                <li>• The product is unused, undamaged, and in its original packaging</li>
                <li>• Manufacturing defects (e.g., structural issues, broken parts)</li>
                <li>• Wrong or incomplete item received</li>
                <li>• Significant transit damage (reported with evidence)</li>
              </ul>

              <p className="text-gray-700 mt-4 leading-relaxed">
                Refund requests must be raised within <strong>5 days of delivery</strong>.
              </p>

              <p className="text-gray-600 mt-3 text-sm italic">
                <strong>Note:</strong> Custom-made, assembled, or personalized items are non-returnable and non-refundable unless there is a manufacturing defect.
              </p>
            </div>

            {/* 2. Non-Refundable Cases */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <AlertCircle className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">2. Non-Refundable Situations</h2>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">Refunds will not be provided for:</p>

              <ul className="space-y-3 text-gray-600 ml-6">
                <li>• Change of mind or preference after delivery</li>
                <li>• Minor natural variations in wood grain, color, or finish (handcrafted nature)</li>
                <li>• Damage caused after delivery (improper handling or installation)</li>
                <li>• Products used or assembled by the customer</li>
                <li>• Delay in delivery or courier-related issues (beyond product quality)</li>
              </ul>
            </div>

            {/* 3. How to Request a Refund */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Mail className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">3. How to Request a Refund or Replacement</h2>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">Please contact us with the following details:</p>

              <ul className="space-y-3 text-gray-600 ml-6">
                <li>• Your Order ID</li>
                <li>• Clear photos and/or short video of the issue</li>
                <li>• Description of the problem</li>
              </ul>

              <p className="text-gray-700 mt-4 leading-relaxed">
                Email us at <strong>swingzula@storeview.in</strong> — our team will guide you through the process.
              </p>
            </div>

            {/* 4. Refund Timeline & Method */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Clock className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">4. Refund Timeline & Process</h2>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                Once the return is approved and the product is received back (if required):
              </p>

              <ul className="space-y-3 text-gray-600 ml-6">
                <li>• Refund will be processed within <strong>5–7 business days</strong></li>
                <li>• Amount will be credited to your original payment method</li>
                <li>• Replacement (if chosen) will be shipped at no extra cost</li>
              </ul>
            </div>

            {/* 5. Cancellations */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Truck className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">5. Order Cancellations</h2>
              </div>

              <p className="text-gray-700 leading-relaxed">
                Orders can be cancelled <strong>before dispatch</strong> with a full refund.<br />
                Once dispatched, cancellation is not possible, but our return policy applies.
              </p>
            </div>

            {/* 6. Large / Bulk Orders */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <Shield className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">6. Large or Bulk Orders</h2>
              </div>

              <p className="text-gray-700 leading-relaxed">
                Special terms apply for bulk or corporate orders. Returns are evaluated case-by-case, focusing on proven manufacturing defects only.
              </p>
            </div>
            {/* 7. Advance Payment & Order Confirmation */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-5">
                <CreditCard className="text-blue-600 mr-4" size={32} />
                <h2 className="text-2xl font-bold text-blue-700">
                  7. Advance Payment & Order Confirmation Policy
                </h2>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                As all Swing Zula products are handcrafted and made strictly on order, we follow a two-step payment process:
              </p>

              <ul className="space-y-3 text-gray-600 ml-6">
                <li>
                  • <strong>50% advance payment</strong> is required at the time of placing the order to initiate production.
                </li>
                <li>
                  • Once your swing (jhula) is fully prepared, we will share a <strong>video call or video preview</strong> to confirm product quality and finish.
                </li>
                <li>
                  • The remaining <strong>50% balance payment</strong> must be completed after confirmation and <strong>before dispatch</strong>.
                </li>
              </ul>

              <p className="text-gray-700 mt-4 leading-relaxed">
                Orders will be dispatched only after full payment is received.
              </p>

              <p className="text-gray-600 mt-3 text-sm italic">
                <strong>Important:</strong> The advance payment is non-refundable once production has started, except in cases of verified manufacturing defects or if the order is cancelled by Swing Zula.
              </p>
            </div>


          </div>

          {/* Final Contact Card */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 rounded-3xl shadow-2xl p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">We’re Here to Help</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
              Your satisfaction is our priority. Reach out anytime — we’ll resolve it with care.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-lg">
              <div className="flex flex-col items-center">
                <Mail className="mb-4" size={40} />
                <p>swingzula@storeview.in</p>
              </div>
              <div className="flex flex-col items-center">
                <Phone className="mb-4" size={40} />
                <p>+91  74350 78118</p>
              </div>
            </div>
            <p className="mt-12 text-xl italic opacity-90">
              ~ Handcrafted with Love in Surat, Delivered with Trust ~
            </p>
          </div>

        </div>
      </div>
    </>
  );
}