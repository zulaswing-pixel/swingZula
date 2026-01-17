"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export default function DownloadBrochure() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentStore =process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "swing-9926.myshopify.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      store: currentStore,
    };

    try {
      const res = await fetch("https://adminrocket.megascale.co.in/api/brochure-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "API failed");
      }

      const link = document.createElement("a");
      link.href = "/Swing Zula.pdf";
      link.download = "Swing Zula.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setOpen(false);
    } catch (err) {
      console.error("❌ Brochure submit error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer"
      >
        Download Brochure
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl w-full max-w-md shadow-2xl relative border border-sky-200">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-2xl font-light cursor-pointer"
            >
              ✕
            </button>

            <div className="p-8 pt-10">
              <h2 className="flex items-center justify-center gap-3 text-2xl font-bold text-blue-700 mb-6">
                <Download size={28} className="text-blue-600" />
                <span>Download Brochure</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  name="name"
                  placeholder="Full Name"
                  onChange={(e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
  }}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                   pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />

                <button
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-shadow shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? "Downloading..." : "Download Brochure"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}