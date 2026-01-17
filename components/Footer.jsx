
"use client";
import React from "react";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  FileText,
  Lock,
  ShieldCheck,
  Truck,
  Instagram,
  Facebook,
  Home,
  Info,
  HelpCircle,
  BookOpen,
  Download,
  MessageCircle,
  ChevronUp,
  ChevronDown,
  Package,
  Youtube,
} from "lucide-react";

import Link from "next/link";
import DownloadBrochure from "./DownloadBrochure";




const Footer = () => {
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (name) => {
    setOpenSection(openSection === name ? null : name);
  };

  const quickLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "About Us", path: "/about", icon: Info },
    { name: "FAQ", path: "/faq", icon: HelpCircle },
    { name: "Contact Us", path: "/contact", icon: MessageCircle },
    { name: "Blog", path: "/blog", icon: BookOpen },
  ];

  const policiesLinks = [
    { name: "Terms & Conditions", path: "/terms&condition", icon: FileText },
    { name: "Shipping Policy", path: "/shipping-policy", icon: Truck },
    { name: "Payment & Return Policy", path: "/payment&return-policy", icon: Package },
    { name: "Privacy Policy", path: "/privacy-policy", icon: ShieldCheck },
  ];




  return (
    <footer className="relative bg-gradient-to-b from-sky-50 via-blue-50 to-cyan-100 text-gray-700 overflow-hidden">

      {/* Animated background blobs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-300 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative mx-auto px-6 sm:px-12 pt-16 pb-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
              Swing Zula
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Elevating your space with premium quality and innovative design.
            </p>

            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/swing_zula?igsh=YXB1ZmszZGFpbzcz"
                target="_blank"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center hover:scale-110 transition shadow-md"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61583837023834"
                target="_blank"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center hover:scale-110 transition shadow-md"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>

              <a
                href="https://wa.me/7435078118"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md hover:scale-110 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="white"
                >
                  <path d="M20.52 3.48A11.91 11.91 0 0012.06 0C5.45 0 .06 5.39.06 12c0 2.11.55 4.17 1.6 6L0 24l6.17-1.61a11.93 11.93 0 005.89 1.5h.01c6.61 0 12-5.39 12-12a11.92 11.92 0 00-3.55-8.41zM12.06 21a9 9 0 01-4.59-1.25l-.33-.2-3.66.96.98-3.57-.22-.36A9 9 0 1112.06 21zm5.23-6.42c-.29-.15-1.72-.85-1.99-.95-.27-.1-.47-.15-.67.15-.2.29-.77.95-.94 1.14-.17.2-.35.22-.64.07-.29-.15-1.23-.45-2.35-1.43-.87-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.35.44-.52.15-.17.2-.29.29-.47.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.29-1.04 1.02-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.09 3.19 5.07 4.48.71.31 1.26.49 1.69.63.7.22 1.34.19 1.84.12.56-.08 1.72-.7 1.96-1.38.25-.68.25-1.26.17-1.38-.07-.12-.27-.2-.56-.35z" />
                </svg>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center hover:scale-110 transition shadow-md"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>



            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-sky-500 to-cyan-500 mr-3 rounded-full"></span>
              Get in Touch
            </h3>

            <ul className="space-y-4">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-sky-600" />
                +91 74350 78118
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-sky-600" />
                swingzula@storeview.in
              </li>
              <li className="flex items-start">
                <Clock className="w-4 h-4 mr-3 text-sky-600 shrink-0 mt-0.5" />
                <span>
                  Mon – Fri: 10 AM – 6:30 PM <br />
                  Sat: 11 AM – 4 PM
                </span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-3 text-sky-600 shrink-0 mt-1" />
                <span>
                  412, Storeview<br />
                 New Escon Plaza, Chhaprabhatha Road,<br />
                   Amroli, Surat, - 394107
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-sky-500 to-cyan-500 mr-3 rounded-full"></span>
              Quick Links
            </h3>

            <ul className="space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="flex items-center text-gray-700 hover:text-sky-600 text-sm md:text-base transition group"
                    >
                      <Icon className="w-4 h-4 mr-2 text-sky-500 group-hover:text-cyan-600 transition" />
                      {link.name}
                    </Link>
                  </li>
                );
              })}

              <li className="">
                <div className="flex items-center text-gray-700 hover:text-sky-600 text-sm md:text-base transition group ">
                  <Download className="w-4 h-4 mr-2 text-sky-500 group-hover:text-cyan-600 transition cursor-pointer" />
                  <DownloadBrochure />
                </div>
              </li>
            </ul>


          </div>

          <div className="md:text-left border-b border-indigo-200 md:border-none pb-4 order-2 md:order-3">
            <button
              className="w-full flex justify-between items-center md:block text-left cursor-pointer"
              onClick={() => toggleSection("policies")}
            >
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3">
                Policies
              </h3>

              <span className="md:hidden text-slate-600">
                {openSection === "policies" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </span>
            </button>

            <ul
              className={`overflow-hidden transition-all duration-300 ease-in-out md:block space-y-3
              ${openSection === "policies" ? "max-h-96 pt-3" : "max-h-0 md:max-h-full"}`}
            >
              {policiesLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="flex items-center text-slate-700 hover:text-indigo-600 text-xs sm:text-sm md:text-base transition group"
                    >
                      <Icon className="w-4 h-4 mr-2 text-sky-500 group-hover:text-cyan-600 transition" />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>

        {/* Footer Image */}
        <img
          src="/footers.webp"
          alt="footer"
          className="w-full object-contain my-8"
        />

        {/* Bottom */}
        <div className="border-t border-sky-200 pt-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Swing Zula. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
