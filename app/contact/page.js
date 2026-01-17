"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";


export default function ContactPage() {
  const STORE_NAME = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "swing-9926.myshopify.com";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    store: STORE_NAME, // ✅ hidden store name
  });

  const [status, setStatus] = useState(""); // 'sending' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const API_URL = "https://adminrocket.megascale.co.in/api/contact";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // 👈 store included
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          store: STORE_NAME, // ✅ keep store after reset
        });
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setStatus("error");
      setErrorMsg("Network error. Check your connection or try again later.");
    }

    setTimeout(() => setStatus(""), 4000);
  };

  return (
    <>
      <Breadcrumbs />
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h1>
            <p className="text-lg text-gray-600">
              We'd love to hear from you. Send us a message!
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ✅ Hidden Store Field */}
              <input type="hidden" name="store" value={formData.store} />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-400 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {status === "sending" ? "Sending..." : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>

              {status === "success" && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center">
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}

              {status === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-center">
                  {errorMsg}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
