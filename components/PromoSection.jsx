"use client"

import { useRouter } from "next/navigation";

export default function PromoSection() {
  const router = useRouter();

  const handleShopNow = () => {
    router.push("/collection");
  };

  return (
    <section className="w-full bg-gray-100 mt-8 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE – IMAGE CAROUSEL (Multiple Jhula Styles) */}
          <div className="grid grid-cols-2 gap-6">
            <img
              src="/gallery/img3.webp"
              alt="Modern Acrylic Bubble Swing Chair"
              className="w-full object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300"
            />
            <img
              src="/gallery/img8.webp"
              alt="Transparent Glass Acrylic Indoor Jhula"
              className="w-full object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300"
            />
            <img
              src="/gallery/img10.webp"
              alt="Traditional Wooden Indoor Swing Jhula"
              className="w-full object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300"
            />
            <img
              src="/gallery/img12.webp"
              alt="Luxury Cushioned Hanging Swing Chair"
              className="w-full object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* RIGHT SIDE – PROMO TEXT */}
          <div className="flex flex-col justify-center space-y-8 text-center md:text-left">
            <div className="inline-block">
              <span className="bg-red-600 text-white px-8 py-3 text-2xl font-bold rounded-full shadow-lg">
                UP TO 15% OFF
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-700 leading-tight">
              Discover Your Perfect<br />Indoor Jhula Swing
            </h2>

            <p className="text-lg md:text-xl text-gray-700 max-w-lg">
              From sleek modern acrylic designs to classic wooden jhulas – bring comfort, style, and relaxation to your home. 
              Enjoy free shipping on orders above ₹999!
            </p>

            <div className="space-y-3">
              <p className="text-green-600 font-semibold text-lg">
                Limited Time Offer – Don't Miss Out!
              </p>
            </div>

            <button 
            onClick={handleShopNow}
            className="px-12 py-5 bg-blue-600 text-white rounded-full font-bold text-xl w-fit mx-auto md:mx-0 hover:bg-blue-700 transition shadow-2xl transform hover:scale-105 cursor-pointer">
              SHOP ALL JHULAS NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}