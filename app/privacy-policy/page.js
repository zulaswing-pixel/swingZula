"use client";

import React, { useEffect } from 'react';
import { Shield, User, Database, Lock, FileText, Eye, Mail, Scale, Globe, MapPin, Phone } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function PrivacyPolicy() {
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
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-3">Privacy Policy</h2>
            <p className="mt-8 text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
              At Swing Zula, your privacy is important to us. We are committed to protecting your personal information and being fully transparent about how it is collected, used, and safeguarded when you visit our website or place an order.
            </p>
          </div>

          {/* 1. Information We Collect */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow mb-8">
            <div className="flex items-center mb-5">
              <Database className="text-blue-600 mr-4" size={32} />
              <h2 className="text-2xl font-bold text-blue-700">1. Information We Collect</h2>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed"><strong>Personal Information:</strong></p>
            <ul className="space-y-3 text-gray-600 ml-6 mb-6">
              <li>• Full Name</li>
              <li>• Email Address</li>
              <li>• Contact Number</li>
              <li>• Billing and Shipping Address</li>
              <li>• Order Details</li>
            </ul>

            <p className="text-gray-700 mb-4 leading-relaxed"><strong>Transaction Information:</strong></p>
            <ul className="space-y-3 text-gray-600 ml-6 mb-6">
              <li>• Payment method details (securely processed via third-party gateways like Razorpay – We do not store card information)</li>
            </ul>

            <p className="text-gray-700 mb-4 leading-relaxed"><strong>Technical & Device Information (Automatically Collected):</strong></p>
            <ul className="space-y-3 text-gray-600 ml-6">
              <li>• IP Address</li>
              <li>• Browser Type & Version</li>
              <li>• Device Identifiers</li>
              <li>• Time Zone & Location Data</li>
              <li>• Cookies & Similar Tracking Technologies</li>
            </ul>
          </div>

          {/* 2. How We Use Your Information */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow mb-8">
            <div className="flex items-center mb-5">
              <Eye className="text-blue-600 mr-4" size={32} />
              <h2 className="text-2xl font-bold text-blue-700">2. How We Use Your Information</h2>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">We use your information to:</p>
            <ul className="space-y-3 text-gray-600 ml-6">
              <li>• Process, fulfill, and track your orders</li>
              <li>• Communicate order updates, delivery details, and support</li>
              <li>• Improve our website, products, and customer experience</li>
              <li>• Send promotional offers (only if you opt-in)</li>
              <li>• Prevent fraud and ensure secure transactions</li>
              <li>• Comply with legal and regulatory requirements</li>
            </ul>
            <p className="text-gray-700 mt-4 leading-relaxed font-medium">We never sell or rent your personal data to third parties.</p>
          </div>

          {/* 3. Sharing of Information */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow mb-8">
            <div className="flex items-center mb-5">
              <Shield className="text-blue-600 mr-4" size={32} />
              <h2 className="text-2xl font-bold text-blue-700">3. Sharing of Personal Information</h2>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">We share limited information only with trusted partners for essential operations:</p>
            <ul className="space-y-3 text-gray-600 ml-6">
              <li>• Logistics & courier companies (for delivery only)</li>
              <li>• Payment gateways (for secure transaction processing)</li>
              <li>• Analytics providers (anonymized data for site improvement)</li>
              <li>• Government or law enforcement agencies (when legally required)</li>
            </ul>
          </div>

          {/* 4. Data Protection & Security */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow mb-8">
            <div className="flex items-center mb-5">
              <Lock className="text-blue-600 mr-4" size={32} />
              <h2 className="text-2xl font-bold text-blue-700">4. Data Protection & Security</h2>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">We implement strong safeguards to protect your data:</p>
            <ul className="space-y-3 text-gray-600 ml-6">
              <li>• SSL encryption for all data transmission</li>
              <li>• Secure servers and access controls</li>
              <li>• Compliance with PCI-DSS standards via payment partners</li>
              <li>• Regular security audits and updates</li>
            </ul>
          </div>

          {/* 5. Cookies & Tracking */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow mb-8">
            <div className="flex items-center mb-5">
              <FileText className="text-blue-600 mr-4" size={32} />
              <h2 className="text-2xl font-bold text-blue-700">5. Cookies & Tracking Technologies</h2>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">We use cookies to:</p>
            <ul className="space-y-3 text-gray-600 ml-6">
              <li>• Remember your cart and preferences</li>
              <li>• Enhance site performance and user experience</li>
              <li>• Analyze traffic and improve recommendations</li>
            </ul>
            <p className="text-gray-700 mt-4 leading-relaxed">
              You can manage or disable cookies in your browser settings, though some features may be limited.
            </p>
          </div>

          {/* 6. Your Rights */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow mb-8">
            <div className="flex items-center mb-5">
              <User className="text-blue-600 mr-4" size={32} />
              <h2 className="text-2xl font-bold text-blue-700">6. Your Rights</h2>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">You have the right to:</p>
            <ul className="space-y-3 text-gray-600 ml-6">
              <li>• Access or request a copy of your personal data</li>
              <li>• Correct or update inaccurate information</li>
              <li>• Request deletion of your data (subject to legal obligations)</li>
              <li>• Opt-out of marketing communications at any time</li>
            </ul>
            <p className="text-gray-700 mt-4 leading-relaxed">
              To exercise these rights, please contact us at the details below.
            </p>
          </div>

          {/* 7. Third-Party Links & Retention */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow mb-8">
            <div className="flex items-center mb-5">
              <Globe className="text-blue-600 mr-4" size={32} />
              <h2 className="text-2xl font-bold text-blue-700">7. Third-Party Links & Data Retention</h2>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">
              Our website may contain links to third-party sites. We are not responsible for their privacy practices.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We retain your data only as long as necessary for order fulfillment, support, and legal compliance.
            </p>
          </div>

          {/* 8. Policy Updates */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-sky-200 hover:shadow-xl transition-shadow mb-8">
            <div className="flex items-center mb-5">
              <Scale className="text-blue-600 mr-4" size={32} />
              <h2 className="text-2xl font-bold text-blue-700">8. Changes to This Policy</h2>
            </div>

            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted here with the updated effective date. Continued use of our site constitutes acceptance of the revised policy.
            </p>
          </div>

          {/* Contact Card */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 rounded-3xl shadow-2xl p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Contact Us</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
              If you have any questions about this Privacy Policy or your personal data, please reach out.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-lg">
              <div>
                <Mail className="mx-auto mb-4" size={40} />
                <p className="font-semibold">Email</p>
                <p>swingzula@storeview.in</p>
              </div>
              <div>
                <Phone className="mx-auto mb-4" size={40} />
                <p className="font-semibold">Phone / WhatsApp</p>
                <p>+91 74350 78118</p>
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
            <p className="mt-12 text-xl italic opacity-90">
              ~ Your Trust Matters to Us ~
            </p>
          </div>

        </div>
      </div>
    </>
  );
}