// "use client";

// import React from "react";
// import { motion } from "framer-motion";

// export default function ShopByOilPreferenceSection({
//   title = "Choose Your Zula. Choose Your Relaxation.",
//   zulas = [
//     {
//       name: "Clear Acrylic Zula",
//       desc: "Crystal clear, modern elegance with maximum transparency and strength.",
//       image: "/img21.png", // Replace with your actual image path
//       cta: "Explore Now",
//       link: "/shop/clear-acrylic",
//     },
//     {
//       name: "Tinted Acrylic Zula",
//       desc: "Subtle smoke or bronze tint for privacy with a premium sophisticated look.",
//       image: "/img19.png", // Replace with your actual image path
//       cta: "Explore Now",
//       link: "/shop/tinted-acrylic",
//     },
//     {
//       name: "Printed Pattern Zula",
//       desc: "Beautiful floral, geometric or custom prints for a personalized touch.",
//       image: "/img20.png", // Replace with your actual image path
//       cta: "Explore Now",
//       link: "/shop/printed-pattern",
//     },
//   ],
// }) {
//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: { delayChildren: 0.2, staggerChildren: 0.18 },
//     },
//   };

//   const card = {
//     hidden: { opacity: 0, y: 40, scale: 0.95 },
//     show: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: { type: "spring", stiffness: 120, damping: 12 },
//     },
//   };

//   return (
//     <section className="relative w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20 md:py-28 overflow-hidden">
//       {/* Background Pattern - subtle dots */}
//       <div
//         className="absolute inset-0 opacity-5"
//         style={{
//           backgroundImage:
//             "radial-gradient(circle at 1px 1px, rgba(79, 70, 229, 0.4) 1px, transparent 0)",
//           backgroundSize: "55px 55px",
//         }}
//       />

//       <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
//         {/* Title */}
//         <motion.div
//           initial={{ opacity: 0, y: -25 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-center max-w-3xl mx-auto mb-16"
//         >
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
//             {title}
//           </h2>
//         </motion.div>

//         {/* Cards */}
//         <motion.div
//           variants={container}
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true, amount: 0.2 }}
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12"
//         >
//           {zulas.map((zula, index) => (
//             <motion.div
//               key={index}
//               variants={card}
//               whileHover={{
//                 scale: 1.06,
//                 rotateY: 6,
//                 rotateX: 2,
//                 boxShadow: "0 20px 40px rgba(79, 70, 229, 0.15)",
//               }}
//               transition={{ type: "spring", stiffness: 150, damping: 10 }}
//               className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-lg overflow-hidden group"
//               style={{ transformStyle: "preserve-3d", perspective: 1000 }}
//             >
//               <div className="relative w-full rounded-b-3xl overflow-hidden">
//                 <motion.img
//                   src={zula.image}
//                   alt={zula.name}
//                   loading="lazy"
//                   className="w-full h-auto object-contain transition-transform duration-[1400ms] group-hover:scale-105"
//                   whileHover={{ rotate: -1 }}
//                 />
//               </div>

//               <div className="p-7 text-center">
//                 <h3 className="text-2xl font-bold text-slate-900">
//                   {zula.name}
//                 </h3>

//                 <p className="text-slate-700 mt-2 mb-6 text-sm sm:text-base">
//                   {zula.desc}
//                 </p>

//                 <motion.a
//                   href={zula.link}
//                   whileHover={{ scale: 1.1 }}
//                   className="inline-block bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-xl transition-all"
//                 >
//                   {zula.cta}
//                 </motion.a>
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>

//       {/* Decorative Wave - indigo tinted */}
//       <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0] opacity-90">
//         <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full h-14 md:h-20">
//           <path d="M0,0 C300,40 900,40 1200,0 L1200,60 L0,60 Z" fill="rgb(238 242 255)" /> {/* indigo-50 */}
//         </svg>
//       </div>
//     </section>
//   );
// }



"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ShopByOilPreferenceSection({
  title = "Choose Your Zula. Choose Your Relaxation.",
  zulas = [
    {
      name: "Modern Acrylic Hanging Chair with Plush Cushion",
      desc: "Luxurious clear acrylic swing with ultra-soft plush cushion for ultimate comfort and modern style.",
      image: "https://cdn.shopify.com/s/files/1/0725/3685/0477/files/15.png?v=1766220208",
      cta: "View Details",
      link: "/product/modern-acrylic-hanging-chair-with-plush-cushion", // Update with actual handle if different
    },
    {
      name: "Acrylic Lounge Swing with Premium Cushion Seating",
      desc: "Elegant 4 feet acrylic lounge swing featuring premium cushion seating for relaxed indoor swinging.",
      image: "https://cdn.shopify.com/s/files/1/0725/3685/0477/files/1.png?v=1766220222",
      cta: "View Details",
      link: "/product/acrylic-lounge-swing-with-premium-cushion-seating",
    },
    {
      name: "Modern Acrylic Indoor Swing Bench with Dark Green Upholstery",
      desc: "Sophisticated indoor swing bench in clear acrylic with rich dark green upholstery for a premium look.",
      image: "https://cdn.shopify.com/s/files/1/0725/3685/0477/files/14.png?v=1766220208",
      cta: "View Details",
      link: "/product/modern-acrylic-indoor-swing-bench-with-dark-green-upholstery",
    },
  ],
}) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { delayChildren: 0.2, staggerChildren: 0.18 },
    },
  };

  const card = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 12 },
    },
  };

  return (
    <section className="relative w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20 md:py-28 overflow-hidden">
      {/* Background Pattern - subtle dots */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(79, 70, 229, 0.4) 1px, transparent 0)",
          backgroundSize: "55px 55px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-tight tracking-tight">
            {title}
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {zulas.map((zula, index) => (
            <motion.div
              key={index}
              variants={card}
              whileHover={{
                scale: 1.06,
                rotateY: 6,
                rotateX: 2,
                boxShadow: "0 20px 40px rgba(79, 70, 229, 0.15)",
              }}
              transition={{ type: "spring", stiffness: 150, damping: 10 }}
              className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-lg overflow-hidden group"
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            >
              <div className="relative w-full rounded-b-3xl overflow-hidden">
                <motion.img
                  src={zula.image}
                  alt={zula.name}
                  loading="lazy"
                  className="w-full h-auto object-contain transition-transform duration-[1400ms] group-hover:scale-105"
                  whileHover={{ rotate: -1 }}
                />
              </div>

              <div className="p-7 text-center">
                <h3 className="text-2xl font-bold text-slate-900">
                  {zula.name}
                </h3>

                <p className="text-slate-700 mt-2 mb-6 text-sm sm:text-base">
                  {zula.desc}
                </p>

                <motion.a
                  href={zula.link}
                  whileHover={{ scale: 1.1 }}
                  className="inline-block bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-xl transition-all"
                >
                  {zula.cta}
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Wave - indigo tinted */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0] opacity-90">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full h-14 md:h-20">
          <path d="M0,0 C300,40 900,40 1200,0 L1200,60 L0,60 Z" fill="rgb(238 242 255)" /> {/* indigo-50 */}
        </svg>
      </div>
    </section>
  );
}