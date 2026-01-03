// app/page.js   ← FINAL WORKING VERSION
import { getAllProducts } from "@/lib/shopify";
import ProductCard from "@/components/ProductCard";
import HeroSection from "@/components/Herosection";
import OurPromiseSection from "@/components/OurPromiseSection";
import KhakhraMakingProcess from "@/components/KhakhraMakingProcess";
import CraftsmanshipHeritageSection from "@/components/CraftsmanshipHeritageSection";
import ShopByOilPreferenceSection from "@/components/ShopByOilPreferenceSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import CallToActionSection from "@/components/CallToActionSection";
import FAQSection from "@/components/FAQSection";
import StoreCustomerFromUrl from "@/components/StoreCustomerFromUrl";


export default async function HomePage() {
  const products = await getAllProducts(50);

  return (
   <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <HeroSection />
      <OurPromiseSection />
      <div className="max-w-7xl mx-auto py-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl 
               font-extrabold 
               leading-[1.3] 
               pb-2
               bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 
               bg-clip-text text-transparent 
               text-center mb-6">
          Our Top Selling Acrylic Zulas
        </h2>
        <p className="mt-4 text-slate-700 text-base sm:text-lg md:text-xl leading-relaxed text-center mb-12 px-4">
          Premium quality, handcrafted with love. Explore our bestselling swinging zulas.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 px-4 ">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <StoreCustomerFromUrl/>
      <KhakhraMakingProcess />
      <CraftsmanshipHeritageSection />
      <ShopByOilPreferenceSection />
      <TestimonialsCarousel />
      <CallToActionSection />
      <FAQSection />
    </div>
  );
}