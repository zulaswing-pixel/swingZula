// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { HandCoins, Award, Package, Lock, FlaskConical, Leaf, Truck, ChevronDown, ChevronUp, Hammer, Trees, Heart, Home } from "lucide-react"; import AskExpert from "@/components/AskExpert";

// const SHOP_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "swing-9926.myshopify.com";

// export default function ProductDetailsClient({ product }) {
//   const [openIndexes, setOpenIndexes] = useState([]);
//   const [selectedVariant, setSelectedVariant] = useState(
//     product?.variants?.[0] || null
//   );
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [buyNowLoading, setBuyNowLoading] = useState(false);
//   const [showEasebuzzModal, setShowEasebuzzModal] = useState(false);
//   const [showLoginPopup, setShowLoginPopup] = useState(false);
//   const [openItems, setOpenItems] = useState([]);

//   // Buy Now modal states (mirrors CartDrawer flow but scoped to a single product)
//   const [showBuyNowModal, setShowBuyNowModal] = useState(false);
//   const [buyNowStep, setBuyNowStep] = useState(0); // 0=email, 2=otp, 3=checkout/address
//   const [bnEmail, setBnEmail] = useState("");
//   const [bnOtp, setBnOtp] = useState("");
//   const [bnPaymentMethod, setBnPaymentMethod] = useState("online");
//   const [bnAddress, setBnAddress] = useState({
//     firstName: "",
//     lastName: "",
//     address1: "",
//     city: "",
//     province: "",
//     provinceCode: "",
//     country: "India",
//     zip: "",
//     phone: "",
//   });
//   const [buyNowError, setBuyNowError] = useState("");
//   const [buyNowSendingOtp, setBuyNowSendingOtp] = useState(false);
//   const [buyNowVerifying, setBuyNowVerifying] = useState(false);
//   const [buyNowProcessing, setBuyNowProcessing] = useState(false);



//   const getVariantId = () => {
//     // Try all possible locations for variant ID
//     if (product.variantId) return product.variantId;
//     if (product.variants?.edges?.[0]?.node?.id) return product.variants.edges[0].node.id;
//     if (product.variants?.nodes?.[0]?.id) return product.variants.nodes[0].id;
//     if (product.variants?.[0]?.id) return product.variants[0].id;
//     // Last resort: use product ID if available
//     if (product.id) return product.id;
//     return null;
//   };

//   const handleAddToCart = async (e) => {
//     e.stopPropagation();
//     e.preventDefault();

//     const customerShopifyId = localStorage.getItem("customerShopifyId");
//     if (!customerShopifyId) {
//       setShowLoginPopup(true);
//       return;
//     }
//     const variantId = getVariantId();

//     if (!variantId) {
//       console.error("No variant ID found. Product data:", product);
//       alert("No variant available—please check product data");
//       return;
//     }


//     const cleanVariantId = variantId.includes("gid://") ? variantId.split("/").pop() : variantId;

//     console.log("Add to cart:", {
//       variantId: cleanVariantId,
//       productTitle: product.title,
//       customerShopifyId
//     });

//     setLoading(true);

//     try {
//       const cartId = localStorage.getItem("cartId") || localStorage.getItem("guestCartId") || "";

//       const res = await fetch("/api/cart/add", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Cart-Id": cartId,
//         },
//         body: JSON.stringify({
//           variantId: cleanVariantId,
//           quantity: 1,
//           customerShopifyId: customerShopifyId || null,
//         }),
//       });

//       const data = await res.json();

//       console.log("Add to cart response:", data);

//       if (!res.ok || !data?.success) {
//         throw new Error(data?.error || data?.message || "Add to cart failed—check Shopify creds");
//       }

//       // Store cart ID
//       if (data.cart?.id) {
//         localStorage.setItem("guestCartId", data.cart.id);
//         localStorage.setItem("cartId", data.cart.id);
//       }

//       // Dispatch events
//       window.dispatchEvent(new Event("cart-updated"));
//       window.dispatchEvent(new Event("open-cart-drawer"));

//       console.log("Successfully added to cart");
//     } catch (err) {
//       console.error("Add to cart error:", err);
//       alert(`Failed to add: ${err.message}. Verify Shopify API token in .env.local.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBuyNow = (e) => {
//     e?.stopPropagation?.();
//     e?.preventDefault?.();

//     const variantId = getVariantId();
//     if (!variantId) {
//       console.error("No variant ID found. Product data:", product);
//       setBuyNowError("No variant available — please check product data");
//       setShowBuyNowModal(true);
//       setBuyNowStep(0);
//       return;
//     }

//     const storedEmail = typeof window !== 'undefined' && (localStorage.getItem("customerEmail") || localStorage.getItem("email")) || "";
//     const customerShopifyId = typeof window !== 'undefined' ? localStorage.getItem("customerShopifyId") : null;

//     setBnEmail(storedEmail || "");
//     setBnOtp("");
//     setBuyNowError("");
//     setShowBuyNowModal(true);

//     // If customer already logged in and we have email, skip OTP/address
//     if (customerShopifyId && storedEmail) {
//       setBuyNowStep(3);
//     } else {
//       setBuyNowStep(0);
//     }
//   };

//   const resetBuyNowModal = () => {
//     setShowBuyNowModal(false);
//     setBuyNowStep(0);
//     setBnEmail("");
//     setBnOtp("");
//     setBuyNowError("");
//     setBuyNowSendingOtp(false);
//     setBuyNowVerifying(false);
//     setBuyNowProcessing(false);
//     setBnAddress({
//       firstName: "",
//       lastName: "",
//       address1: "",
//       city: "",
//       province: "",
//       provinceCode: "",
//       country: "India",
//       zip: "",
//       phone: "",
//     });
//   };

//   const sendBuyNowOtp = async () => {
//     if (!bnEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bnEmail)) {
//       setBuyNowError("Please enter a valid email");
//       return;
//     }

//     const customerShopifyId = typeof window !== 'undefined' ? localStorage.getItem("customerShopifyId") : null;

//     // If user is not logged in, skip OTP verification for Buy Now and proceed to address/checkout
//     if (!customerShopifyId) {
//       try { localStorage.setItem("customerEmail", bnEmail); } catch (e) { /* ignore */ }
//       setBuyNowError("");
//       setBuyNowStep(3);
//       return;
//     }

//     setBuyNowSendingOtp(true);
//     setBuyNowError("");
//     try {
//       const res = await fetch("/api/otp/send", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: bnEmail, shop: SHOP_DOMAIN }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setBuyNowStep(2);
//       } else if (data.message?.includes("already verified")) {
//         setBuyNowStep(3);
//       } else {
//         setBuyNowError(data.message || "Failed to send OTP");
//       }
//     } catch (err) {
//       console.error("sendBuyNowOtp error:", err);
//       setBuyNowError("Network error while sending OTP");
//     } finally {
//       setBuyNowSendingOtp(false);
//     }
//   };

//   const verifyBuyNowOtp = async () => {
//     if (!bnOtp) {
//       setBuyNowError("Please enter the OTP");
//       return;
//     }
//     setBuyNowVerifying(true);
//     setBuyNowError("");
//     try {
//       const res = await fetch("/api/otp/verify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: bnEmail, otp: bnOtp, shop: SHOP_DOMAIN }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setBuyNowStep(3);
//       } else {
//         setBuyNowError("Invalid OTP");
//       }
//     } catch (err) {
//       console.error("verifyBuyNowOtp error:", err);
//       setBuyNowError("Network error while verifying OTP");
//     } finally {
//       setBuyNowVerifying(false);
//     }
//   };

//   const confirmBuyNowCheckout = async () => {
//     const variantId = getVariantId();
//     if (!variantId) return setBuyNowError("Variant missing");
//     const cleanVariantId = variantId.includes("gid://") ? variantId.split("/").pop() : variantId;

//     setBuyNowProcessing(true);
//     setBuyNowError("");

//     try {
//       const payload = {
//         shop: SHOP_DOMAIN,
//         email: bnEmail,
//         name: `${bnAddress.firstName || ""} ${bnAddress.lastName || ""}`.trim(),
//         address: {
//           ...bnAddress,
//           provinceCode: bnAddress.provinceCode || bnAddress.province,
//         },
//         paymentMethod: bnPaymentMethod,
//         lineItems: [
//           {
//             variant_id: cleanVariantId,
//             quantity,
//             price: price,
//           },
//         ],
//       };

//       const res = await fetch("/api/placeorder", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       console.log("confirmBuyNowCheckout response:", data);

//       if (!res.ok || !data.success) {
//         throw new Error(data.error || data?.message || "Checkout failed");
//       }

//       const redirectUrl = data?.data?.checkoutUrl || data?.checkoutUrl || data?.data?.checkout_url || data?.checkout_url || data?.data?.url || data?.url || data?.data?.redirect || data?.redirectUrl || data?.data?.paymentLink || data?.paymentLink;

//       if (redirectUrl) {
//         window.location.href = redirectUrl;
//         return;
//       }

//       alert("Checkout initiated. Please check your email for payment details.");
//       resetBuyNowModal();
//     } catch (err) {
//       console.error("confirmBuyNowCheckout error:", err);
//       setBuyNowError(err.message || "Failed to start checkout");
//     } finally {
//       setBuyNowProcessing(false);
//     }
//   };


//   if (!product) {
//     return <div className="text-center py-20">Product not found</div>;
//   }

//   const price = selectedVariant?.price?.amount
//     ? Number(selectedVariant.price.amount)
//     : 0;

//   const compare = selectedVariant?.compareAtPrice?.amount
//     ? Number(selectedVariant.compareAtPrice.amount)
//     : 0;

//   const hasDiscount = compare > price && compare > 0;

//   const percentage = hasDiscount
//     ? Math.round(((compare - price) / compare) * 100)
//     : null;

//   const allImages = product.images || [];
//   const displayImage =
//     allImages[selectedImageIndex]?.url ||
//     product.featuredImage?.url ||
//     "/placeholder.jpg";

//   function CountdownTimer() {
//     const [timeLeft, setTimeLeft] = useState("");

//     useEffect(() => {
//       const timer = setInterval(() => {
//         const now = new Date();
//         const midnight = new Date();
//         midnight.setHours(23, 59, 59, 999);

//         const diff = midnight - now;

//         const hours = Math.floor(diff / (1000 * 60 * 60));
//         const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((diff % (1000 * 60)) / 1000);

//         setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);

//         if (diff < 0) {
//           setTimeLeft("0h 0m 0s");
//           clearInterval(timer);
//         }
//       }, 1000);

//       return () => clearInterval(timer);
//     }, []);

//     return <span className="font-bold text-orange-600 text-lg">{timeLeft}</span>;
//   }

//   const scrollRef = useRef(null);

//   useEffect(() => {
//     const el = scrollRef.current;

//     function handleWheel(e) {
//       if (window.scrollY > 100) return;

//       const atTop = el.scrollTop === 0;
//       const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;

//       if (e.deltaY > 0) {
//         if (!atBottom) {
//           e.preventDefault();
//           el.scrollTop += e.deltaY;
//         }
//       } else if (e.deltaY < 0) {
//         if (!atTop) {
//           e.preventDefault();
//           el.scrollTop += e.deltaY;
//         }
//       }
//     }

//     window.addEventListener("wheel", handleWheel, { passive: false });
//     return () => window.removeEventListener("wheel", handleWheel);
//   }, []);


//   const [showStickyBox, setShowStickyBox] = useState(false);
//   const [closedByUser, setClosedByUser] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (closedByUser) return;

//       if (window.scrollY > 500) {
//         setShowStickyBox(true);
//       } else {
//         setShowStickyBox(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [closedByUser]);

//   useEffect(() => {
//     if (!product?.id) return;

//     let viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

//     viewed = viewed.filter((id) => id !== product.id);

//     viewed.unshift(product.id);

//     viewed = viewed.slice(0, 10);

//     localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
//   }, [product]);


//   return (
//     <>
//       <div className="min-h-screen bg-white py-12 mt-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
//             {/* IMAGE SECTION */}
//             <div className="space-y-4">
//               <div className="relative group">
//                 {hasDiscount && (
//                   <div className="absolute top-6 left-6 z-20">
//                     <span className="bg-red-600 text-white px-5 py-2 text-sm font-bold rounded-full shadow-lg">
//                       {percentage}% OFF
//                     </span>
//                   </div>
//                 )}

//                 <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-3">
//                   <img
//                     src={displayImage}
//                     alt={product.title}
//                     className="rounded-xl w-full object-cover aspect-square transform group-hover:scale-105 transition-transform duration-500"
//                   />
//                 </div>
//               </div>

//               {allImages.length > 1 && (
//                 <div className="grid grid-cols-4 gap-3">
//                   {allImages.slice(0, 4).map((image, index) => (
//                     <div
//                       key={index}
//                       onClick={() => setSelectedImageIndex(index)}
//                       className={`relative overflow-hidden rounded-lg shadow-md bg-white p-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${selectedImageIndex === index
//                         ? "ring-2 ring-blue-600 shadow-lg"
//                         : "hover:shadow-lg"
//                         }`}
//                     >
//                       <img
//                         src={image.url}
//                         alt={`${product.title} - Image ${index + 1}`}
//                         className="rounded-md w-full object-cover aspect-square"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* DETAILS SECTION */}
//             <div
//               ref={scrollRef}
//               className="space-y-6 md:h-screen"
//               style={{
//                 overflowY: "auto",
//                 scrollbarWidth: "none",
//                 msOverflowStyle: "none",
//               }}
//             >
//               <h1 className="text-4xl lg:text-5xl font-bold text-black mt-2 leading-tight">
//                 {product.title}
//               </h1>
//               <p className="text-black text-sm text-gray-500">
//                 Tax Excluded.{" "}
//                 <a
//                   href="/shipping-policy"
//                   className="font-medium text-blue-600 hover:underline"
//                 >
//                   Shipping
//                 </a> calculated at checkout.
//               </p>


//               {/* Money Back Badge - Adjusted to a more neutral/modern style */}
//               <button
//                 onClick={() => setShowEasebuzzModal(true)}
//                 className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left"
//               >
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center gap-2">
//                     <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
//                       <span className="text-gray-600 font-bold text-xl">₹</span>
//                     </div>

//                     <div>
//                       <div className="font-semibold text-gray-800 text-sm flex items-center gap-1">
//                         Easebuzz
//                       </div>
//                       <div className="text-xs text-gray-700 font-medium">Money Back Promise</div>
//                     </div>
//                   </div>

//                   <div className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
//                     On Prepaid Orders
//                   </div>
//                 </div>

//                 <div className="mt-3 border-t border-gray-200 pt-2 flex items-center gap-2">
//                   <span className="text-red-500 text-lg">⚠</span>
//                   <span className="text-xs">
//                     <span className="font-semibold text-red-500">Get 100% refund</span> on non-delivery or defects
//                   </span>
//                 </div>
//               </button>


//               {/* PRICE - Updated colors to match the image (red discount, green save) */}
//               <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-md">
//                 {hasDiscount ? (
//                   <div className="space-y-2">
//                     <div className="flex items-baseline gap-4 flex-wrap">
//                       <span className="text-5xl font-bold text-black">
//                         ₹{price.toFixed(2)}
//                       </span>
//                       <span className="text-2xl line-through text-gray-400 font-medium">
//                         ₹{compare.toFixed(2)}
//                       </span>
//                       <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ml-auto">
//                         {percentage}% OFF
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-green-600 font-semibold text-sm">
//                         Save ₹{(compare - price).toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                 ) : (
//                   <span className="text-5xl font-bold text-black">
//                     ₹{price.toFixed(2)}
//                   </span>
//                 )}
//               </div>

//               {/* VARIANT SELECTOR - Modern blue theme */}
//               {product.variants.length > 1 && (
//                 <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-600/20">
//                   <h3 className="font-semibold text-lg text-blue-600 mb-4">
//                     Choose Variant
//                   </h3>

//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                     {product.variants.map((variant) => {
//                       const isActive = selectedVariant?.id === variant.id;

//                       return (
//                         <button
//                           key={variant.id}
//                           onClick={() => {
//                             setSelectedVariant(variant);
//                             setQuantity(1);
//                           }}
//                           className={`
//               relative rounded-xl px-4 py-4 text-center font-medium
//               border-2 transition-all duration-200
//               ${isActive
//                               ? "border-blue-600 bg-blue-600 text-white shadow-md scale-[1.03]"
//                               : "border-gray-300 text-gray-800 hover:border-blue-600"
//                             }
//             `}
//                         >
//                           {isActive && (
//                             <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white text-blue-600 text-xs flex items-center justify-center font-bold">
//                               ✓
//                             </span>
//                           )}

//                           <span className="block text-sm font-semibold">
//                             {variant.title}
//                           </span>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}


//               {/* QUANTITY & ADD TO CART - Blue primary button */}
//               <div className="flex items-center gap-6">
//                 <div className="flex items-center bg-gray-50 border border-gray-300 rounded-full px-1 py-1 shadow-sm">
//                   <button
//                     onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//                     disabled={quantity <= 1}
//                     className="w-12 h-12 flex items-center justify-center rounded-full 
//                 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 
//                 transition shadow-sm text-2xl text-white font-bold cursor-pointer"
//                   >
//                     –
//                   </button>
//                   <span className="mx-4 text-xl font-semibold min-w-[40px] text-center">
//                     {quantity}
//                   </span>
//                   <button
//                     onClick={() => setQuantity((q) => q + 1)}
//                     className="w-12 h-12 flex items-center justify-center rounded-full 
//                 bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm 
//                 text-2xl font-bold cursor-pointer"
//                   >
//                     +
//                   </button>

//                 </div>

//                 <button
//                   onClick={handleBuyNow}
//                   disabled={buyNowLoading || !selectedVariant}
//                   className="w-44 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {buyNowLoading ? "Processing..." : "Buy Now"}
//                 </button>

//                 <button
//                   onClick={handleAddToCart}
//                   disabled={loading || !selectedVariant}
//                   className="flex-1 bg-blue-600 text-white font-bold py-6 px-8 rounded-lg 
//                 hover:bg-blue-700 transition-all duration-300 text-lg shadow-lg
//                 disabled:opacity-50 disabled:cursor-not-allowed
//                 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
//                 >
//                   {loading ? "Adding to Cart..." : "Add to Cart"}
//                 </button>
//               </div>

//               <AskExpert />

//               {/* DELIVERY TIMELINE - Neutral/modern */}
//               <div className="bg-gray-50 rounded-2xl p-6 mt-8 border border-gray-200">
//                 <div className="relative">
//                   <div className="flex items-center justify-between relative">
//                     <div className="absolute top-6 left-12 right-12 h-0.5 bg-gray-300"></div>

//                     {(() => {
//                       const today = new Date();
//                       const oneDay = 24 * 60 * 60 * 1000;

//                       const orderDate = today;
//                       const dispatchStart = new Date(today.getTime() + oneDay);
//                       const dispatchEnd = new Date(today.getTime() + 2 * oneDay);

//                       const deliveryStartCandidate = new Date(today.getTime() + 3 * oneDay);
//                       const endOfDay = new Date(today);
//                       endOfDay.setHours(23, 59, 59, 999);

//                       const deliveryStart =
//                         deliveryStartCandidate.getTime() > endOfDay.getTime()
//                           ? new Date(today.getTime() + 4 * oneDay)
//                           : deliveryStartCandidate;

//                       const deliveryEnd = new Date(today.getTime() + 7 * oneDay);

//                       const format = (d) =>
//                         d.toLocaleDateString("en-IN", {
//                           day: "2-digit",
//                           month: "2-digit",
//                         });

//                       return (
//                         <>
//                           <div className="flex flex-col items-center z-10">
//                             <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
//                               🛍️
//                             </div>
//                             <p className="mt-3 text-sm font-semibold text-gray-700">Order</p>
//                             <p className="text-xs text-gray-600">{format(orderDate)}</p>
//                           </div>

//                           <div className="flex flex-col items-center z-10">
//                             <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
//                               ✈️
//                             </div>
//                             <p className="mt-3 text-sm font-semibold text-gray-700">Order Dispatch</p>
//                             <p className="text-xs text-gray-600">
//                               {format(dispatchStart)} – {format(dispatchEnd)}
//                             </p>
//                           </div>

//                           <div className="flex flex-col items-center z-10">
//                             <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
//                               📦
//                             </div>
//                             <p className="mt-3 text-sm font-semibold text-gray-700">Delivery</p>
//                             <p className="text-xs text-gray-600">
//                               {format(deliveryStart)} – {format(deliveryEnd)}
//                             </p>
//                           </div>
//                         </>
//                       );
//                     })()}

//                   </div>
//                 </div>

//                 <div className="mt-8 space-y-3">
//                   <div className="flex flex-col gap-2 bg-white rounded-xl px-5 py-4 shadow-md">
//                     <div className="flex items-start gap-3">
//                       <span className="text-2xl">👉</span>
//                       <p className="text-gray-800 font-medium">
//                         Free Shipping In India (On Order Above ₹999)
//                       </p>
//                     </div>

//                     <div className="flex items-start gap-3">
//                       <span className="text-2xl">👉</span>
//                       <p className="text-gray-800 font-medium">
//                         Order within the next <CountdownTimer /> for <strong>dispatch today</strong>, and you'll receive your package between{" "}
//                         <strong>
//                           {new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'numeric' })}
//                           {" – "}
//                           {new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'numeric' })}
//                         </strong>
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//               </div>


//               <div className="bg-green-50 rounded-xl p-5 flex items-start gap-4 border border-green-200 shadow-sm">
//                 <HandCoins className="w-7 h-7 text-green-700" />

//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">Rewards</h3>
//                   <p className="text-gray-700 text-sm">
//                     Shop for Rs.999/- & Get Free Shipping
//                   </p>
//                 </div>
//               </div>

//               <div className="flex flex-col gap-4 mt-6">
//                 <div className="flex items-center gap-3">
//                   <Package className="w-6 h-6 text-gray-700" />
//                   <span className="text-gray-800 text-sm md:text-base">
//                     Free Shipping & Exchanges
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <Lock className="w-6 h-6 text-gray-700" />
//                   <span className="text-gray-800 text-sm md:text-base">
//                     Flexible and secure payment, pay on delivery
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <Award className="w-6 h-6 text-gray-700" />
//                   <span className="text-gray-800 text-sm md:text-base">
//                     800,000+ Happy customers
//                   </span>
//                 </div>
//               </div>




//               {/* Meta Feilds */}

//               <div className="space-y-3">
//                 {product.metafields.map((mf) => {
//                   const id = `${mf.namespace}.${mf.key}`;
//                   const isOpen = openItems.includes(id);

//                   const toggle = () => {
//                     setOpenItems(prev =>
//                       isOpen ? prev.filter(item => item !== id) : [...prev, id]
//                     );
//                   };

//                   let content;

//                   // ----- CONTENT LOGIC (FIXED) -----
//                   if (mf.key === "capacity") {
//                     let values = [];

//                     try {
//                       values = Array.isArray(mf.value)
//                         ? mf.value
//                         : JSON.parse(mf.value);
//                     } catch (e) {
//                       values = [mf.value];
//                     }

//                     content = (
//                       <ul className="list-disc pl-5 space-y-1 text-gray-700">
//                         {values.map((val, i) => (
//                           <li key={i}>{val}</li>
//                         ))}
//                       </ul>
//                     );
//                   }

//                   else if (mf.key === "care_advice") {
//                     content = mf.value.split("\n").map((line, i) => (
//                       <p key={i} className="text-gray-700 mb-1">
//                         {line}
//                       </p>
//                     ));
//                   }
//                   else {
//                     return null;
//                   }

//                   return (
//                     <div
//                       key={id}
//                       className="overflow-hidden rounded-xl bg-white shadow-md border border-gray-200 transition-all duration-300 hover:shadow-xl"
//                     >
//                       <button
//                         onClick={toggle}
//                         className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-gray-800 transition-all hover:bg-gradient-to-r hover:from-sky-100/80 hover:to-sky-50/50 focus:outline-none"
//                       >
//                         <span className="text-lg capitalize">
//                           {mf.key.replace("_", " ")}
//                         </span>

//                         <div
//                           className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
//                             }`}
//                         >
//                           {isOpen ? (
//                             <ChevronUp className="h-5 w-5 text-blue-600" />
//                           ) : (
//                             <ChevronDown className="h-5 w-5 text-blue-600" />
//                           )}
//                         </div>
//                       </button>

//                       <div
//                         className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//                           }`}
//                       >
//                         <div className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-5">
//                           {content}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>



//               {/* TRUST BADGES - Modern neutral */}
//               <div className="flex xl:flex-nowrap flex-wrap xl:justify-between justify-center gap-10 py-6">

//                 <div className="flex flex-col items-center">
//                   <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-gray-300 flex items-center justify-center">
//                     <Hammer className="text-gray-600 w-10 h-10" />
//                   </div>
//                   <p className="mt-2 text-sm font-semibold text-black text-center">Handcrafted</p>
//                 </div>

//                 <div className="flex flex-col items-center">
//                   <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-gray-300 flex items-center justify-center">
//                     <Trees className="text-gray-600 w-10 h-10" />
//                   </div>
//                   <p className="mt-2 text-sm font-semibold text-black text-center">Premium Wood</p>
//                 </div>

//                 <div className="flex flex-col items-center">
//                   <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-gray-300 flex items-center justify-center">
//                     <Heart className="text-gray-600 w-10 h-10" />
//                   </div>
//                   <p className="mt-2 text-sm font-semibold text-black text-center">Comfortable Swing</p>
//                 </div>

//                 <div className="flex flex-col items-center">
//                   <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-gray-300 flex items-center justify-center">
//                     <Home className="text-gray-600 w-10 h-10" />
//                   </div>
//                   <p className="mt-2 text-sm font-semibold text-black text-center">Traditional Design</p>
//                 </div>

//                 <div className="flex flex-col items-center">
//                   <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-gray-300 flex items-center justify-center">
//                     <Truck className="text-gray-600 w-10 h-10" />
//                   </div>
//                   <p className="mt-2 text-sm font-semibold text-black text-center">Fast Shipping</p>
//                 </div>

//               </div>
//             </div>
//           </div>

//           {product.descriptionHtml && (
//             <div className="mt-16 max-w-4xl mx-auto">
//               <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200">
//                 <h3 className="font-bold mb-6 text-2xl text-gray-800 text-center">
//                   Product Details
//                 </h3>
//                 <div
//                   className="prose prose-sm max-w-none text-gray-700 text-left leading-relaxed text-center"
//                   dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>



//       {/* EASEBUZZ MODAL - Updated to neutral */}
//       {showEasebuzzModal && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
//           onClick={() => setShowEasebuzzModal(false)}
//         >
//           <div
//             className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="bg-blue-600 text-white p-6 relative">
//               <button
//                 onClick={() => setShowEasebuzzModal(false)}
//                 className="absolute top-4 right-4 text-white"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
//                   <span className="text-2xl font-bold">₹</span>
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold">Protected by Easebuzz</h3>
//                   <p>Money Back Promise</p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 space-y-5">
//               <div className="bg-gray-50 rounded-xl p-5 text-center border border-gray-200">
//                 <p className="text-gray-700">
//                   If your order is <strong>incorrect, damaged, or not delivered</strong>,<br />
//                   get <strong>100% refund at zero cost</strong> from Easebuzz.
//                 </p>
//                 <p className="text-sm text-gray-600 font-medium mt-3">Valid on Prepaid orders only</p>
//               </div>

//               <div className="space-y-3">
//                 <div className="flex gap-3">
//                   <div className="w-8 h-8 bg-gray-100 rounded-full flex justify-center items-center">
//                     <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="font-bold">100% Refund</p>
//                     <p className="text-sm text-gray-600">on non-delivery or damaged items</p>
//                   </div>
//                 </div>

//                 <div className="flex gap-3">
//                   <div className="w-8 h-8 bg-gray-100 rounded-full flex justify-center items-center">
//                     <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="font-bold">100% Free</p>
//                     <p className="text-sm text-gray-600">no hidden charges</p>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={() => setShowEasebuzzModal(false)}
//                 className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl"
//               >
//                 Yes, got it
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* BUY NOW MODAL (OTP -> Address -> Confirm) */}
//       {showBuyNowModal && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
//           onClick={() => resetBuyNowModal()}
//         >
//           <div
//             className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold">Buy Now</h3>
//                 <button onClick={() => resetBuyNowModal()} className="text-gray-600">Close</button>
//               </div>

//               {buyNowError && (
//                 <div className="mb-3 text-sm text-red-600">{buyNowError}</div>
//               )}

//               {buyNowStep === 0 && (
//                 <div className="space-y-4">
//                   <input
//                     value={bnEmail}
//                     onChange={(e) => setBnEmail(e.target.value)}
//                     placeholder="Email"
//                     className="w-full border px-3 py-2 rounded-lg"
//                   />

//                   <div className="flex gap-2">
//                     <button
//                       onClick={sendBuyNowOtp}
//                       disabled={buyNowSendingOtp}
//                       className="flex-1 bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
//                     >
//                       {buyNowSendingOtp ? "Sending..." : "Send OTP"}
//                     </button>

//                     <button onClick={() => resetBuyNowModal()} className="px-4 py-2 border rounded-lg">
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {buyNowStep === 2 && (
//                 <div className="space-y-4">
//                   <p className="text-sm text-gray-700">We sent an OTP to <strong>{bnEmail}</strong></p>
//                   <input
//                     value={bnOtp}
//                     onChange={(e) => setBnOtp(e.target.value)}
//                     placeholder="Enter OTP"
//                     className="w-full border px-3 py-2 rounded-lg"
//                   />

//                   <div className="flex gap-2">
//                     <button
//                       onClick={verifyBuyNowOtp}
//                       disabled={buyNowVerifying}
//                       className="flex-1 bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
//                     >
//                       {buyNowVerifying ? "Verifying..." : "Verify OTP"}
//                     </button>

//                     <button onClick={sendBuyNowOtp} className="px-4 py-2 border rounded-lg">Resend</button>
//                   </div>
//                 </div>
//               )}

//               {buyNowStep === 3 && (
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-2 gap-2">
//                     <input value={bnAddress.firstName} onChange={(e)=>setBnAddress(prev=>({...prev, firstName: e.target.value}))} placeholder="First name" className="border px-3 py-2 rounded-lg" />
//                     <input value={bnAddress.lastName} onChange={(e)=>setBnAddress(prev=>({...prev, lastName: e.target.value}))} placeholder="Last name" className="border px-3 py-2 rounded-lg" />
//                   </div>

//                   <input value={bnAddress.address1} onChange={(e)=>setBnAddress(prev=>({...prev, address1: e.target.value}))} placeholder="Address" className="w-full border px-3 py-2 rounded-lg" />

//                   <div className="grid grid-cols-2 gap-2">
//                     <input value={bnAddress.city} onChange={(e)=>setBnAddress(prev=>({...prev, city: e.target.value}))} placeholder="City" className="border px-3 py-2 rounded-lg" />
//                     <input value={bnAddress.province} onChange={(e)=>setBnAddress(prev=>({...prev, province: e.target.value}))} placeholder="State" className="border px-3 py-2 rounded-lg" />
//                   </div>

//                   <div className="grid grid-cols-2 gap-2">
//                     <input value={bnAddress.zip} onChange={(e)=>setBnAddress(prev=>({...prev, zip: e.target.value}))} placeholder="Postal code" className="border px-3 py-2 rounded-lg" />
//                     <input value={bnAddress.phone} onChange={(e)=>setBnAddress(prev=>({...prev, phone: e.target.value}))} placeholder="Phone" className="border px-3 py-2 rounded-lg" />
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <label className="text-sm">Payment:</label>
//                     <select value={bnPaymentMethod} onChange={(e)=>setBnPaymentMethod(e.target.value)} className="border px-3 py-2 rounded-lg">
//                       <option value="online">Online</option>
//                       <option value="cod">Cash on Delivery</option>
//                     </select>
//                   </div>

//                   <div className="flex gap-2">
//                     <button onClick={confirmBuyNowCheckout} disabled={buyNowProcessing} className="flex-1 bg-green-600 text-white py-2 rounded-lg disabled:opacity-50">
//                       {buyNowProcessing ? "Processing..." : "Confirm & Pay"}
//                     </button>

//                     <button onClick={() => setBuyNowStep(0)} className="px-4 py-2 border rounded-lg">Back</button>
//                   </div>
//                 </div>
//               )}

//             </div>
//           </div>
//         </div>
//       )}
//       {showStickyBox && (
//         <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-50 border-t border-gray-200">
//           <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3">
//             <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">

//               <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
//                 <img
//                   src={displayImage}
//                   alt="product"
//                   className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0 border border-gray-200"
//                 />
//                 <div className="flex-1 min-w-0">
//                   <p className="font-semibold text-blue-600 text-xs sm:text-sm truncate">
//                     {product.title}
//                   </p>
//                   <p className="text-base sm:text-lg font-bold text-black">
//                     ₹{price.toFixed(2)}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

//                 {product.variants?.length > 1 && (
//                   <div className="relative">
//                     <select
//                       value={selectedVariant?.id || ""}
//                       onChange={(e) => {
//                         const variant = product.variants.find(v => v.id === e.target.value);
//                         setSelectedVariant(variant);
//                         setQuantity(1);
//                       }}
//                       className="appearance-none bg-white border-2 border-gray-300 rounded-lg 
//                   px-3 sm:px-4 py-2 sm:py-2.5 pr-8 sm:pr-10 
//                   text-xs sm:text-sm font-medium text-gray-900 cursor-pointer
//                   hover:border-blue-600 focus:outline-none focus:border-blue-600 
//                   focus:ring-2 focus:ring-blue-600/20 transition-all"
//                     >
//                       <option value="">Select Variant</option>
//                       {product.variants.map((variant) => (
//                         <option key={variant.id} value={variant.id}>
//                           {variant.title}
//                         </option>
//                       ))}
//                     </select>

//                     <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                       <svg
//                         className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex items-center bg-gray-50 border border-gray-300 rounded-full px-1 py-1 shadow-sm">
//                   <button
//                     onClick={() => setQuantity(q => Math.max(1, q - 1))}
//                     disabled={quantity <= 1}
//                     className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full 
//                 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 
//                 transition text-lg sm:text-xl text-white font-bold"
//                   >
//                     –
//                   </button>

//                   <span className="mx-2 sm:mx-3 text-sm sm:text-base font-semibold min-w-[24px] text-center">
//                     {quantity}
//                   </span>

//                   <button
//                     onClick={() => setQuantity(q => q + 1)}
//                     className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full 
//                 bg-blue-600 hover:bg-blue-700 transition 
//                 text-lg sm:text-xl text-white font-bold"
//                   >
//                     +
//                   </button>
//                 </div>

//                 <button
//                   onClick={handleBuyNow}
//                   disabled={buyNowLoading || !selectedVariant}
//                   className="bg-green-600 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-xs sm:text-sm mr-2"
//                 >
//                   {buyNowLoading ? "Processing..." : "BUY NOW"}
//                 </button>

//                 <button
//                   onClick={handleAddToCart}
//                   disabled={loading || !selectedVariant}
//                   className="bg-blue-600 text-white font-semibold 
//               px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 rounded-lg 
//               hover:bg-blue-700 transition-all
//               disabled:opacity-50 disabled:cursor-not-allowed
//               shadow-md hover:shadow-lg whitespace-nowrap
//               text-xs sm:text-sm flex items-center gap-2"
//                 >
//                   {loading ? "Adding..." : "ADD TO CART"}
//                 </button>

//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {showLoginPopup && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm text-center">
//             <h2 className="text-lg font-semibold mb-2">
//               Login Required
//             </h2>
//             <p className="text-sm text-gray-600 mb-5">
//               You are not logged in. Please login to add items to your cart.
//             </p>

//             <div className="flex gap-3 justify-center">
//               <button
//                 onClick={() => setShowLoginPopup(false)}
//                 className="px-4 py-2 border rounded-md text-gray-700"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={() => {
//                   setShowLoginPopup(false);
//                   window.location.href = "/auth/login";
//                 }}
//                 className="px-4 py-2 bg-black text-white rounded-md"
//               >
//                 Login
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }



"use client";

import React, { useState, useEffect, useRef } from "react";
import { HandCoins, Award, Package, Lock, FlaskConical, Leaf, Truck, ChevronDown, ChevronUp, Hammer, Trees, Heart, Home } from "lucide-react";
import AskExpert from "@/components/AskExpert";

const SHOP_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "swing-9926.myshopify.com";

export default function ProductDetailsClient({ product }) {
  const [openIndexes, setOpenIndexes] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [showEasebuzzModal, setShowEasebuzzModal] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [openItems, setOpenItems] = useState([]);

  // Buy Now modal states (mirrors CartDrawer flow but scoped to a single product)
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [buyNowStep, setBuyNowStep] = useState(0); // 0=email, 2=otp, 3=checkout/address
  const [bnEmail, setBnEmail] = useState("");
  const [bnOtp, setBnOtp] = useState("");
  const [bnPaymentMethod, setBnPaymentMethod] = useState("online");
  const [bnAddress, setBnAddress] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    city: "",
    province: "",
    provinceCode: "",
    country: "India",
    zip: "",
    phone: "",
  });
  const [buyNowError, setBuyNowError] = useState("");
  const [buyNowSendingOtp, setBuyNowSendingOtp] = useState(false);
  const [buyNowVerifying, setBuyNowVerifying] = useState(false);
  const [buyNowProcessing, setBuyNowProcessing] = useState(false);

  // Get all images
  const allImages = product.images || [];

  // Function to handle variant change and update image
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
    
    // Find and switch to the variant's image if it exists
    if (variant?.image?.url && allImages.length > 0) {
      const imageIndex = allImages.findIndex(img => img.url === variant.image.url);
      if (imageIndex !== -1) {
        setSelectedImageIndex(imageIndex);
      }
    }
  };

  const getVariantId = () => {
    // Use selected variant if available
    if (selectedVariant?.id) return selectedVariant.id;
    // Fallback to first variant
    if (product.variantId) return product.variantId;
    if (product.variants?.edges?.[0]?.node?.id) return product.variants.edges[0].node.id;
    if (product.variants?.nodes?.[0]?.id) return product.variants.nodes[0].id;
    if (product.variants?.[0]?.id) return product.variants[0].id;
    // Last resort: use product ID if available
    if (product.id) return product.id;
    return null;
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const customerShopifyId = localStorage.getItem("customerShopifyId");
    if (!customerShopifyId) {
      setShowLoginPopup(true);
      return;
    }
    const variantId = getVariantId();

    if (!variantId) {
      console.error("No variant ID found. Product data:", product);
      alert("No variant available—please check product data");
      return;
    }


    const cleanVariantId = variantId.includes("gid://") ? variantId.split("/").pop() : variantId;

    console.log("Add to cart:", {
      variantId: cleanVariantId,
      productTitle: product.title,
      customerShopifyId
    });

    setLoading(true);

    try {
      const cartId = localStorage.getItem("cartId") || localStorage.getItem("guestCartId") || "";

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Cart-Id": cartId,
        },
        body: JSON.stringify({
          variantId: cleanVariantId,
          quantity: 1,
          customerShopifyId: customerShopifyId || null,
        }),
      });

      const data = await res.json();

      console.log("Add to cart response:", data);

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || data?.message || "Add to cart failed—check Shopify creds");
      }

      // Store cart ID
      if (data.cart?.id) {
        localStorage.setItem("guestCartId", data.cart.id);
        localStorage.setItem("cartId", data.cart.id);
      }

      // Dispatch events
      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(new Event("open-cart-drawer"));

      console.log("Successfully added to cart");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert(`Failed to add: ${err.message}. Verify Shopify API token in .env.local.`);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (e) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();

    const variantId = getVariantId();
    if (!variantId) {
      console.error("No variant ID found. Product data:", product);
      setBuyNowError("No variant available — please check product data");
      setShowBuyNowModal(true);
      setBuyNowStep(0);
      return;
    }

    const storedEmail = typeof window !== 'undefined' && (localStorage.getItem("customerEmail") || localStorage.getItem("email")) || "";
    const customerShopifyId = typeof window !== 'undefined' ? localStorage.getItem("customerShopifyId") : null;

    setBnEmail(storedEmail || "");
    setBnOtp("");
    setBuyNowError("");
    setShowBuyNowModal(true);

    // If customer already logged in and we have email, skip OTP/address
    if (customerShopifyId && storedEmail) {
      setBuyNowStep(3);
    } else {
      setBuyNowStep(0);
    }
  };

  const resetBuyNowModal = () => {
    setShowBuyNowModal(false);
    setBuyNowStep(0);
    setBnEmail("");
    setBnOtp("");
    setBuyNowError("");
    setBuyNowSendingOtp(false);
    setBuyNowVerifying(false);
    setBuyNowProcessing(false);
    setBnAddress({
      firstName: "",
      lastName: "",
      address1: "",
      city: "",
      province: "",
      provinceCode: "",
      country: "India",
      zip: "",
      phone: "",
    });
  };

  const sendBuyNowOtp = async () => {
    if (!bnEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bnEmail)) {
      setBuyNowError("Please enter a valid email");
      return;
    }

    const customerShopifyId = typeof window !== 'undefined' ? localStorage.getItem("customerShopifyId") : null;

    // If user is not logged in, skip OTP verification for Buy Now and proceed to address/checkout
    if (!customerShopifyId) {
      try { localStorage.setItem("customerEmail", bnEmail); } catch (e) { /* ignore */ }
      setBuyNowError("");
      setBuyNowStep(3);
      return;
    }

    setBuyNowSendingOtp(true);
    setBuyNowError("");
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: bnEmail, shop: SHOP_DOMAIN }),
      });
      const data = await res.json();
      if (data.success) {
        setBuyNowStep(2);
      } else if (data.message?.includes("already verified")) {
        setBuyNowStep(3);
      } else {
        setBuyNowError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("sendBuyNowOtp error:", err);
      setBuyNowError("Network error while sending OTP");
    } finally {
      setBuyNowSendingOtp(false);
    }
  };

  const verifyBuyNowOtp = async () => {
    if (!bnOtp) {
      setBuyNowError("Please enter the OTP");
      return;
    }
    setBuyNowVerifying(true);
    setBuyNowError("");
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: bnEmail, otp: bnOtp, shop: SHOP_DOMAIN }),
      });
      const data = await res.json();
      if (data.success) {
        setBuyNowStep(3);
      } else {
        setBuyNowError("Invalid OTP");
      }
    } catch (err) {
      console.error("verifyBuyNowOtp error:", err);
      setBuyNowError("Network error while verifying OTP");
    } finally {
      setBuyNowVerifying(false);
    }
  };

  const confirmBuyNowCheckout = async () => {
    const variantId = getVariantId();
    if (!variantId) return setBuyNowError("Variant missing");
    const cleanVariantId = variantId.includes("gid://") ? variantId.split("/").pop() : variantId;

    setBuyNowProcessing(true);
    setBuyNowError("");

    // Basic client-side validation to avoid sending an empty address to the API
    if (!bnAddress.firstName || !bnAddress.address1 || !bnAddress.city || !bnAddress.province || !bnAddress.zip || !bnAddress.phone) {
      setBuyNowError("Please fill all required address fields");
      setBuyNowProcessing(false);
      return;
    }

    try {
      const payload = {
        shop: SHOP_DOMAIN,
        email: bnEmail,
        name: `${bnAddress.firstName || ""} ${bnAddress.lastName || ""}`.trim(),
        shippingAddress: {
          ...bnAddress,
          provinceCode: bnAddress.provinceCode || bnAddress.province,
          countryCode: bnAddress.countryCode || (bnAddress.country === "India" ? "IN" : bnAddress.countryCode)
        },
        paymentMethod: bnPaymentMethod,
        lineItems: [
          {
            variant_id: cleanVariantId,
            quantity,
            price: price,
          },
        ],
      };

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("confirmBuyNowCheckout response:", data);

      if (!res.ok || !data.success) {
        throw new Error(data.error || data?.message || "Checkout failed");
      }

      const redirectUrl = data?.data?.checkoutUrl || data?.checkoutUrl || data?.data?.checkout_url || data?.checkout_url || data?.data?.url || data?.url || data?.data?.redirect || data?.redirectUrl || data?.data?.paymentLink || data?.paymentLink;

      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }

      alert("Checkout initiated. Please check your email for payment details.");
      resetBuyNowModal();
    } catch (err) {
      console.error("confirmBuyNowCheckout error:", err);
      setBuyNowError(err.message || "Failed to start checkout");
    } finally {
      setBuyNowProcessing(false);
    }
  };


  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }

  const price = selectedVariant?.price?.amount
    ? Number(selectedVariant.price.amount)
    : 0;

  const compare = selectedVariant?.compareAtPrice?.amount
    ? Number(selectedVariant.compareAtPrice.amount)
    : 0;

  const hasDiscount = compare > price && compare > 0;

  const percentage = hasDiscount
    ? Math.round(((compare - price) / compare) * 100)
    : null;

  const displayImage =
    allImages[selectedImageIndex]?.url ||
    product.featuredImage?.url ||
    "/placeholder.jpg";

  function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
      const timer = setInterval(() => {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(23, 59, 59, 999);

        const diff = midnight - now;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);

        if (diff < 0) {
          setTimeLeft("0h 0m 0s");
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }, []);

    return <span className="font-bold text-orange-600 text-lg">{timeLeft}</span>;
  }

  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;

    function handleWheel(e) {
      if (window.scrollY > 100) return;

      const atTop = el.scrollTop === 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;

      if (e.deltaY > 0) {
        if (!atBottom) {
          e.preventDefault();
          el.scrollTop += e.deltaY;
        }
      } else if (e.deltaY < 0) {
        if (!atTop) {
          e.preventDefault();
          el.scrollTop += e.deltaY;
        }
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);


  const [showStickyBox, setShowStickyBox] = useState(false);
  const [closedByUser, setClosedByUser] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (closedByUser) return;

      if (window.scrollY > 500) {
        setShowStickyBox(true);
      } else {
        setShowStickyBox(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [closedByUser]);

  useEffect(() => {
    if (!product?.id) return;

    let viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

    viewed = viewed.filter((id) => id !== product.id);

    viewed.unshift(product.id);

    viewed = viewed.slice(0, 10);

    localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
  }, [product]);


  return (
    <>
      <div className="min-h-screen bg-white py-12 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* IMAGE SECTION */}
            <div className="space-y-4">
              <div className="relative group">
                {hasDiscount && (
                  <div className="absolute top-6 left-6 z-20">
                    <span className="bg-red-600 text-white px-5 py-2 text-sm font-bold rounded-full shadow-lg">
                      {percentage}% OFF
                    </span>
                  </div>
                )}

                <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-3">
                  <img
                    src={displayImage}
                    alt={product.title}
                    className="rounded-xl w-full object-cover aspect-square transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {allImages.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative overflow-hidden rounded-lg shadow-md bg-white p-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${selectedImageIndex === index
                        ? "ring-2 ring-blue-600 shadow-lg"
                        : "hover:shadow-lg"
                        }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.title} - Image ${index + 1}`}
                        className="rounded-md w-full object-cover aspect-square"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DETAILS SECTION */}
            <div
              ref={scrollRef}
              className="space-y-6 md:h-screen"
              style={{
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-black mt-2 leading-tight">
                {product.title}
              </h1>
              <p className="text-black text-sm text-gray-500">
                Tax Excluded.{" "}
                <a
                  href="/shipping-policy"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Shipping
                </a> calculated at checkout.
              </p>


              {/* Money Back Badge - Adjusted to a more neutral/modern style */}
              <button
                onClick={() => setShowEasebuzzModal(true)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-bold text-xl">₹</span>
                    </div>

                    <div>
                      <div className="font-semibold text-gray-800 text-sm flex items-center gap-1">
                        Easebuzz
                      </div>
                      <div className="text-xs text-gray-700 font-medium">Money Back Promise</div>
                    </div>
                  </div>

                  <div className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                    On Prepaid Orders
                  </div>
                </div>

                <div className="mt-3 border-t border-gray-200 pt-2 flex items-center gap-2">
                  <span className="text-red-500 text-lg">⚠</span>
                  <span className="text-xs">
                    <span className="font-semibold text-red-500">Get 100% refund</span> on non-delivery or defects
                  </span>
                </div>
              </button>


              {/* PRICE - Updated colors to match the image (red discount, green save) */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-md">
                {hasDiscount ? (
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-4 flex-wrap">
                      <span className="text-5xl font-bold text-black">
                        ₹{price.toFixed(2)}
                      </span>
                      <span className="text-2xl line-through text-gray-400 font-medium">
                        ₹{compare.toFixed(2)}
                      </span>
                      <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ml-auto">
                        {percentage}% OFF
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-semibold text-sm">
                        Save ₹{(compare - price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-5xl font-bold text-black">
                    ₹{price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* VARIANT SELECTOR - Modern blue theme with image switching */}
              {product.variants.length > 1 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-600/20">
                  <h3 className="font-semibold text-lg text-blue-600 mb-4">
                    Choose Variant
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {product.variants.map((variant) => {
                      const isActive = selectedVariant?.id === variant.id;

                      return (
                        <button
                          key={variant.id}
                          onClick={() => handleVariantChange(variant)}
                          className={`
              relative rounded-xl px-4 py-4 text-center font-medium
              border-2 transition-all duration-200 cursor-pointer
              ${isActive
                              ? "border-blue-600 bg-blue-600 text-white shadow-md scale-[1.03]"
                              : "border-gray-300 text-gray-800 hover:border-blue-600"
                            }
            `}
                        >
                          {isActive && (
                            <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white text-blue-600 text-xs flex items-center justify-center font-bold">
                              ✓
                            </span>
                          )}

                          <span className="block text-sm font-semibold">
                            {variant.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}


              {/* QUANTITY & ADD TO CART - Blue primary button */}
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-gray-50 border border-gray-300 rounded-full px-1 py-1 shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-12 h-12 flex items-center justify-center rounded-full 
                bg-blue-600 hover:bg-blue-700 disabled:opacity-40 
                transition shadow-sm text-2xl text-white font-bold cursor-pointer"
                  >
                    –
                  </button>
                  <span className="mx-4 text-xl font-semibold min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-12 h-12 flex items-center justify-center rounded-full 
                bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm 
                text-2xl font-bold cursor-pointer"
                  >
                    +
                  </button>

                </div>

                {/* <button
                  onClick={handleBuyNow}
                  disabled={buyNowLoading || !selectedVariant}
                  className="w-44 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {buyNowLoading ? "Processing..." : "Buy Now"}
                </button> */}

                <button
                  onClick={handleAddToCart}
                  disabled={loading || !selectedVariant}
                  className="flex-1 bg-blue-600 text-white font-bold py-6 px-8 rounded-lg 
                hover:bg-blue-700 transition-all duration-300 text-lg shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  {loading ? "Adding to Cart..." : "Add to Cart"}
                </button>
              </div>

              <AskExpert />

              {/* DELIVERY TIMELINE - Neutral/modern */}
              <div className="bg-gray-50 rounded-2xl p-6 mt-8 border border-gray-200">
                <div className="relative">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-6 left-12 right-12 h-0.5 bg-gray-300"></div>

                    {(() => {
                      const today = new Date();
                      const oneDay = 24 * 60 * 60 * 1000;

                      const orderDate = today;
                      const dispatchStart = new Date(today.getTime() + oneDay);
                      const dispatchEnd = new Date(today.getTime() + 2 * oneDay);

                      const deliveryStartCandidate = new Date(today.getTime() + 3 * oneDay);
                      const endOfDay = new Date(today);
                      endOfDay.setHours(23, 59, 59, 999);

                      const deliveryStart =
                        deliveryStartCandidate.getTime() > endOfDay.getTime()
                          ? new Date(today.getTime() + 4 * oneDay)
                          : deliveryStartCandidate;

                      const deliveryEnd = new Date(today.getTime() + 7 * oneDay);

                      const format = (d) =>
                        d.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "2-digit",
                        });

                      return (
                        <>
                          <div className="flex flex-col items-center z-10">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                              🛍️
                            </div>
                            <p className="mt-3 text-sm font-semibold text-gray-700">Order</p>
                            <p className="text-xs text-gray-600">{format(orderDate)}</p>
                          </div>

                          <div className="flex flex-col items-center z-10">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                              ✈️
                            </div>
                            <p className="mt-3 text-sm font-semibold text-gray-700">Order Dispatch</p>
                            <p className="text-xs text-gray-600">
                              {format(dispatchStart)} – {format(dispatchEnd)}
                            </p>
                          </div>

                          <div className="flex flex-col items-center z-10">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                              📦
                            </div>
                            <p className="mt-3 text-sm font-semibold text-gray-700">Delivery</p>
                            <p className="text-xs text-gray-600">
                              {format(deliveryStart)} – {format(deliveryEnd)}
                            </p>
                          </div>
                        </>
                      );
                    })()}

                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <div className="flex flex-col gap-2 bg-white rounded-xl px-5 py-4 shadow-md">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">👉</span>
                      <p className="text-gray-800 font-medium">
                        Free Shipping In India (On Order Above ₹999)
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-2xl">👉</span>
                      <p className="text-gray-800 font-medium">
                        Order within the next <CountdownTimer /> for <strong>dispatch today</strong>, and you'll receive your package between{" "}
                        <strong>
                          {new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'numeric' })}
                          {" – "}
                          {new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'numeric' })}
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>

              </div>


              <div className="bg-green-50 rounded-xl p-5 flex items-start gap-4 border border-green-200 shadow-sm">
                <HandCoins className="w-7 h-7 text-green-700" />

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Rewards</h3>
                  <p className="text-gray-700 text-sm">
                    Shop for Rs.999/- & Get Free Shipping
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-gray-700" />
                  <span className="text-gray-800 text-sm md:text-base">
                    Free Shipping & Exchanges
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-gray-700" />
                  <span className="text-gray-800 text-sm md:text-base">
                    Flexible and secure payment, pay on delivery
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-gray-700" />
                  <span className="text-gray-800 text-sm md:text-base">
                    800,000+ Happy customers
                  </span>
                </div>
              </div>




              {/* Meta Feilds */}

              <div className="space-y-3">
                {product.metafields.map((mf) => {
                  const id = `${mf.namespace}.${mf.key}`;
                  const isOpen = openItems.includes(id);

                  const toggle = () => {
                    setOpenItems(prev =>
                      isOpen ? prev.filter(item => item !== id) : [...prev, id]
                    );
                  };

                  let content;

                  // ----- CONTENT LOGIC (FIXED) -----
                  if (mf.key === "capacity") {
                    let values = [];

                    try {
                      values = Array.isArray(mf.value)
                        ? mf.value
                        : JSON.parse(mf.value);
                    } catch (e) {
                      values = [mf.value];
                    }

                    content = (
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {values.map((val, i) => (
                          <li key={i}>{val}</li>
                        ))}
                      </ul>
                    );
                  }

                  else if (mf.key === "care_advice") {
                    content = mf.value.split("\n").map((line, i) => (
                      <p key={i} className="text-gray-700 mb-1">
                        {line}
                      </p>
                    ));
                  }
                  else {
                    return null;
                  }

                  return (
                    <div
                      key={id}
                      className="overflow-hidden rounded-xl bg-white shadow-md border border-gray-200 transition-all duration-300 hover:shadow-xl"
                    >
                      <button
                        onClick={toggle}
                        className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-gray-800 transition-all hover:bg-gradient-to-r hover:from-sky-100/80 hover:to-sky-50/50 focus:outline-none cursor-pointer"
                      >
                        <span className="text-lg capitalize">
                          {mf.key.replace("_", " ")}
                        </span>

                        <div
                          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                            }`}
                        >
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-blue-600" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          }`}
                      >
                        <div className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-5">
                          {content}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>



              {/* TRUST BADGES - Modern neutral */}
              <div className="flex xl:flex-nowrap flex-wrap xl:justify-between justify-center gap-10 py-6">

                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-gray-300 flex items-center justify-center">
                    <Hammer className="text-gray-600 w-10 h-10" />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-black text-center">Handcrafted</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-gray-300 flex items-center justify-center">
                    <Trees className="text-gray-600 w-10 h-10" />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-black text-center">Premium Wood</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-gray-300 flex items-center justify-center">
                    <Heart className="text-gray-600 w-10 h-10" />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-black text-center">Comfortable Swing</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-gray-300 flex items-center justify-center">
                    <Home className="text-gray-600 w-10 h-10" />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-black text-center">Traditional Design</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-gray-300 flex items-center justify-center">
                    <Truck className="text-gray-600 w-10 h-10" />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-black text-center">Fast Shipping</p>
                </div>

              </div>
            </div>
          </div>

          {product.descriptionHtml && (
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200">
                <h3 className="font-bold mb-6 text-2xl text-gray-800 text-center">
                  Product Details
                </h3>
                <div
                  className="prose prose-sm max-w-none text-gray-700 text-left leading-relaxed text-center"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              </div>
            </div>
          )}
        </div>
      </div>



      {/* EASEBUZZ MODAL - Updated to neutral */}
      {showEasebuzzModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowEasebuzzModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-blue-600 text-white p-6 relative">
              <button
                onClick={() => setShowEasebuzzModal(false)}
                className="absolute top-4 right-4 text-white cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">₹</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Protected by Easebuzz</h3>
                  <p>Money Back Promise</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-gray-50 rounded-xl p-5 text-center border border-gray-200">
                <p className="text-gray-700">
                  If your order is <strong>incorrect, damaged, or not delivered</strong>,<br />
                  get <strong>100% refund at zero cost</strong> from Easebuzz.
                </p>
                <p className="text-sm text-gray-600 font-medium mt-3">Valid on Prepaid orders only</p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex justify-center items-center">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold">100% Refund</p>
                    <p className="text-sm text-gray-600">on non-delivery or damaged items</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex justify-center items-center">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold">100% Free</p>
                    <p className="text-sm text-gray-600">no hidden charges</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowEasebuzzModal(false)}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl cursor-pointer"
              >
                Yes, got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BUY NOW MODAL (OTP -> Address -> Confirm) */}
      {showBuyNowModal && (
        <div
          onClick={resetBuyNowModal}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-xs sm:max-w-sm md:max-w-md w-full mx-4 overflow-hidden animate-slideUp"
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-5 relative">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Quick Checkout</h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">Complete your purchase in minutes</p>
              <button
                onClick={resetBuyNowModal}
                className="absolute top-4 right-4 cursor-pointer text-white/80 hover:text-white transition-colors text-2xl w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full"
              >
                ×
              </button>
              {/* Progress indicator */}
              <div className="flex gap-2 mt-4">
                <div className={`flex-1 h-1 rounded-full transition-all ${buyNowStep >= 0 ? 'bg-white' : 'bg-white/30'}`}></div>
                <div className={`flex-1 h-1 rounded-full transition-all ${buyNowStep >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
                <div className={`flex-1 h-1 rounded-full transition-all ${buyNowStep >= 3 ? 'bg-white' : 'bg-white/30'}`}></div>
              </div>
            </div>

            {/* Content area */}
            <div className="p-6">
              {buyNowError && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-r-lg mb-4 text-xs sm:text-sm flex items-start gap-2 animate-shake">
                  <span className="text-lg">⚠️</span>
                  <span>{buyNowError}</span>
                </div>
              )}

              {/* Step 0: Email */}
              {buyNowStep === 0 && (
                <div className="animate-fadeIn">
                  <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg">
                        📧
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Email Verification</h3>
                        <p className="text-xs text-slate-600">We'll send a verification code</p>
                      </div>
                    </div>
                  </div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={bnEmail}
                    onChange={(e) => setBnEmail(e.target.value)}
                    className="w-full border-2 border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 rounded-xl px-4 py-3 mb-5 text-sm transition-all outline-none"
                    placeholder="your.email@example.com"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={resetBuyNowModal}
                      className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendBuyNowOtp}
                      disabled={buyNowSendingOtp}
                      className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                      {buyNowSendingOtp ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin">⏳</span> Sending...
                        </span>
                      ) : 'Continue →'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: OTP */}
              {buyNowStep === 2 && (
                <div className="animate-fadeIn">
                  <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg">
                        🔐
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Enter Verification Code</h3>
                        <p className="text-xs text-slate-600">Sent to {bnEmail}</p>
                      </div>
                    </div>
                  </div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">6-Digit Code</label>
                  <input
                    type="text"
                    value={bnOtp}
                    onChange={(e) => setBnOtp(e.target.value)}
                    className="w-full border-2 border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 rounded-xl px-4 py-3 mb-5 text-sm text-center font-mono text-lg tracking-widest transition-all outline-none"
                    placeholder="000000"
                    maxLength={6}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setBuyNowStep(0)}
                      className="px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={verifyBuyNowOtp}
                      disabled={buyNowVerifying}
                      className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl cursor-pointer"
                    >
                      {buyNowVerifying ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin">⏳</span> Verifying...
                        </span>
                      ) : 'Verify & Continue →'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Address & Payment */}
              {buyNowStep === 3 && (
                <div className="animate-fadeIn">
                  <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg">
                        📦
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Shipping & Payment</h3>
                        <p className="text-xs text-slate-600">Almost there!</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-5 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">First Name</label>
                        <input
                          type="text"
                          value={bnAddress.firstName}
                          onChange={(e) => setBnAddress(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full border-2 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900/20 rounded-lg px-3 py-2 text-sm transition-all outline-none"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Last Name</label>
                        <input
                          type="text"
                          value={bnAddress.lastName}
                          onChange={(e) => setBnAddress(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full border-2 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900/20 rounded-lg px-3 py-2 text-sm transition-all outline-none"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Street Address</label>
                      <input
                        type="text"
                        value={bnAddress.address1}
                        onChange={(e) => setBnAddress(prev => ({ ...prev, address1: e.target.value }))}
                        className="w-full border-2 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900/20 rounded-lg px-3 py-2 text-sm transition-all outline-none"
                        placeholder="123 Main Street, Apt 4B"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">City</label>
                        <input
                          type="text"
                          value={bnAddress.city}
                          onChange={(e) => setBnAddress(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full border-2 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900/20 rounded-lg px-3 py-2 text-sm transition-all outline-none"
                          placeholder="Mumbai"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">State/Province</label>
                        <input
                          type="text"
                          value={bnAddress.province}
                          onChange={(e) => setBnAddress(prev => ({ ...prev, province: e.target.value }))}
                          className="w-full border-2 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900/20 rounded-lg px-3 py-2 text-sm transition-all outline-none"
                          placeholder="Maharashtra"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Postal Code</label>
                        <input
                          type="text"
                          value={bnAddress.zip}
                          onChange={(e) => setBnAddress(prev => ({ ...prev, zip: e.target.value }))}
                          className="w-full border-2 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900/20 rounded-lg px-3 py-2 text-sm transition-all outline-none"
                          placeholder="400001"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          value={bnAddress.phone}
                          onChange={(e) => setBnAddress(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full border-2 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900/20 rounded-lg px-3 py-2 text-sm transition-all outline-none"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-2">Payment Method</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setBnPaymentMethod('online')}
                          className={`border-2 rounded-lg px-4 py-3 text-sm font-medium transition-all cursor-pointer ${bnPaymentMethod === 'online'
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                          <div className="text-lg mb-1">💳</div>
                          Online Payment
                        </button>
                        <button
                          type="button"
                          onClick={() => setBnPaymentMethod('cod')}
                          className={`border-2 rounded-lg px-4 py-3 text-sm font-medium transition-all cursor-pointer ${bnPaymentMethod === 'cod'
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                          <div className="text-lg mb-1">💵</div>
                          Cash on Delivery
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setBuyNowStep(0)}
                      className="px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={confirmBuyNowCheckout}
                      disabled={buyNowProcessing}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl text-sm font-medium hover:from-slate-800 hover:to-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                      {buyNowProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin">⏳</span> Processing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Complete Purchase 🎉
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {showStickyBox && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">

              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <img
                  src={displayImage}
                  alt="product"
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-blue-600 text-xs sm:text-sm truncate">
                    {product.title}
                  </p>
                  <p className="text-base sm:text-lg font-bold text-black">
                    ₹{price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

                {product.variants?.length > 1 && (
                  <div className="relative">
                    <select
                      value={selectedVariant?.id || ""}
                      onChange={(e) => {
                        const variant = product.variants.find(v => v.id === e.target.value);
                        handleVariantChange(variant);
                      }}
                      className="appearance-none bg-white border-2 border-gray-300 rounded-lg 
                  px-3 sm:px-4 py-2 sm:py-2.5 pr-8 sm:pr-10 
                  text-xs sm:text-sm font-medium text-gray-900 cursor-pointer
                  hover:border-blue-600 focus:outline-none focus:border-blue-600 
                  focus:ring-2 focus:ring-blue-600/20 transition-all"
                    >
                      <option value="">Select Variant</option>
                      {product.variants.map((variant) => (
                        <option key={variant.id} value={variant.id}>
                          {variant.title}
                        </option>
                      ))}
                    </select>

                    <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="flex items-center bg-gray-50 border border-gray-300 rounded-full px-1 py-1 shadow-sm">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full 
                bg-blue-600 hover:bg-blue-700 disabled:opacity-40 
                transition text-lg sm:text-xl text-white font-bold cursor-pointer"
                  >
                    –
                  </button>

                  <span className="mx-2 sm:mx-3 text-sm sm:text-base font-semibold min-w-[24px] text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full 
                bg-blue-600 hover:bg-blue-700 transition 
                text-lg sm:text-xl text-white font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* <button
                  onClick={handleBuyNow}
                  disabled={buyNowLoading || !selectedVariant}
                  className="bg-green-600 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-xs sm:text-sm mr-2 cursor-pointer"
                >
                  {buyNowLoading ? "Processing..." : "BUY NOW"}
                </button> */}

                <button
                  onClick={handleAddToCart}
                  disabled={loading || !selectedVariant}
                  className="bg-blue-600 text-white font-semibold 
              px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 rounded-lg 
              hover:bg-blue-700 transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-md hover:shadow-lg whitespace-nowrap
              text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                >
                  {loading ? "Adding..." : "ADD TO CART"}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-2">
              Login Required
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              You are not logged in. Please login to add items to your cart.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="px-4 py-2 border rounded-md text-gray-700 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  window.location.href = "/auth/login";
                }}
                className="px-4 py-2 bg-black text-white rounded-md cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}














// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { HandCoins, Award, Package, Lock, FlaskConical, Leaf, Truck, ChevronDown, ChevronUp, Hammer, Trees, Heart, Home } from "lucide-react";
// import AskExpert from "@/components/AskExpert";

// const SHOP_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "swing-9926.myshopify.com";

// export default function ProductDetailsClient({ product }) {
//   const [openIndexes, setOpenIndexes] = useState([]);
//   const [selectedVariant, setSelectedVariant] = useState(
//     product?.variants?.[0] || null
//   );
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [buyNowLoading, setBuyNowLoading] = useState(false);
//   const [showEasebuzzModal, setShowEasebuzzModal] = useState(false);
//   const [showLoginPopup, setShowLoginPopup] = useState(false);
//   const [openItems, setOpenItems] = useState([]);

//   // Buy Now modal states (mirrors CartDrawer flow but scoped to a single product)
//   const [showBuyNowModal, setShowBuyNowModal] = useState(false);
//   const [buyNowStep, setBuyNowStep] = useState(0); // 0=email, 2=otp, 3=checkout/address
//   const [bnEmail, setBnEmail] = useState("");
//   const [bnOtp, setBnOtp] = useState("");
//   const [bnPaymentMethod, setBnPaymentMethod] = useState("online");
//   const [bnAddress, setBnAddress] = useState({
//     firstName: "",
//     lastName: "",
//     address1: "",
//     city: "",
//     province: "",
//     provinceCode: "",
//     country: "India",
//     zip: "",
//     phone: "",
//   });
//   const [buyNowError, setBuyNowError] = useState("");
//   const [buyNowSendingOtp, setBuyNowSendingOtp] = useState(false);
//   const [buyNowVerifying, setBuyNowVerifying] = useState(false);
//   const [buyNowProcessing, setBuyNowProcessing] = useState(false);

//   // Scroll lock effect - manages body scroll when modals are open
//   useEffect(() => {
//     const isAnyModalOpen = showEasebuzzModal || showBuyNowModal || showLoginPopup;
    
//     if (isAnyModalOpen) {
//       // Save current scroll position
//       const scrollY = window.scrollY;
      
//       // Lock scroll
//       document.body.style.overflow = 'hidden';
//       document.body.style.position = 'fixed';
//       document.body.style.top = `-${scrollY}px`;
//       document.body.style.width = '100%';
//     } else {
//       // Restore scroll
//       const scrollY = document.body.style.top;
//       document.body.style.overflow = '';
//       document.body.style.position = '';
//       document.body.style.top = '';
//       document.body.style.width = '';
      
//       // Restore scroll position
//       if (scrollY) {
//         window.scrollTo(0, parseInt(scrollY || '0') * -1);
//       }
//     }
    
//     // Cleanup on unmount
//     return () => {
//       document.body.style.overflow = '';
//       document.body.style.position = '';
//       document.body.style.top = '';
//       document.body.style.width = '';
//     };
//   }, [showEasebuzzModal, showBuyNowModal, showLoginPopup]);

//   // Get all images
//   const allImages = product.images || [];

//   // Function to handle variant change and update image
//   const handleVariantChange = (variant) => {
//     setSelectedVariant(variant);
//     setQuantity(1);
    
//     // Find and switch to the variant's image if it exists
//     if (variant?.image?.url && allImages.length > 0) {
//       const imageIndex = allImages.findIndex(img => img.url === variant.image.url);
//       if (imageIndex !== -1) {
//         setSelectedImageIndex(imageIndex);
//       }
//     }
//   };

//   const getVariantId = () => {
//     // Try all possible locations for variant ID
//     if (product.variantId) return product.variantId;
//     if (product.variants?.edges?.[0]?.node?.id) return product.variants.edges[0].node.id;
//     if (product.variants?.nodes?.[0]?.id) return product.variants.nodes[0].id;
//     if (product.variants?.[0]?.id) return product.variants[0].id;
//     // Last resort: use product ID if available
//     if (product.id) return product.id;
//     return null;
//   };

//   const handleAddToCart = async (e) => {
//     e.stopPropagation();
//     e.preventDefault();

//     const customerShopifyId = localStorage.getItem("customerShopifyId");
//     if (!customerShopifyId) {
//       setShowLoginPopup(true);
//       return;
//     }
//     const variantId = getVariantId();

//     if (!variantId) {
//       console.error("No variant ID found. Product data:", product);
//       alert("No variant available—please check product data");
//       return;
//     }


//     const cleanVariantId = variantId.includes("gid://") ? variantId.split("/").pop() : variantId;

//     console.log("Add to cart:", {
//       variantId: cleanVariantId,
//       productTitle: product.title,
//       customerShopifyId
//     });

//     setLoading(true);

//     try {
//       const cartId = localStorage.getItem("cartId") || localStorage.getItem("guestCartId") || "";

//       const res = await fetch("/api/cart/add", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Cart-Id": cartId,
//         },
//         body: JSON.stringify({
//           variantId: cleanVariantId,
//           quantity: 1,
//           customerShopifyId: customerShopifyId || null,
//         }),
//       });

//       const data = await res.json();

//       console.log("Add to cart response:", data);

//       if (!res.ok || !data?.success) {
//         throw new Error(data?.error || data?.message || "Add to cart failed—check Shopify creds");
//       }

//       // Store cart ID
//       if (data.cart?.id) {
//         localStorage.setItem("guestCartId", data.cart.id);
//         localStorage.setItem("cartId", data.cart.id);
//       }

//       // Dispatch events
//       window.dispatchEvent(new Event("cart-updated"));
//       window.dispatchEvent(new Event("open-cart-drawer"));

//       console.log("Successfully added to cart");
//     } catch (err) {
//       console.error("Add to cart error:", err);
//       alert(`Failed to add: ${err.message}. Verify Shopify API token in .env.local.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBuyNow = (e) => {
//     e?.stopPropagation?.();
//     e?.preventDefault?.();

//     const variantId = getVariantId();
//     if (!variantId) {
//       console.error("No variant ID found. Product data:", product);
//       setBuyNowError("No variant available — please check product data");
//       setShowBuyNowModal(true);
//       setBuyNowStep(0);
//       return;
//     }

//     const storedEmail = typeof window !== 'undefined' && (localStorage.getItem("customerEmail") || localStorage.getItem("email")) || "";
//     const customerShopifyId = typeof window !== 'undefined' ? localStorage.getItem("customerShopifyId") : null;

//     setBnEmail(storedEmail || "");
//     setBnOtp("");
//     setBuyNowError("");
//     setShowBuyNowModal(true);

//     // If customer already logged in and we have email, skip OTP/address
//     if (customerShopifyId && storedEmail) {
//       setBuyNowStep(3);
//     } else {
//       setBuyNowStep(0);
//     }
//   };

//   const resetBuyNowModal = () => {
//     setShowBuyNowModal(false);
//     setBuyNowStep(0);
//     setBnEmail("");
//     setBnOtp("");
//     setBuyNowError("");
//     setBuyNowSendingOtp(false);
//     setBuyNowVerifying(false);
//     setBuyNowProcessing(false);
//     setBnAddress({
//       firstName: "",
//       lastName: "",
//       address1: "",
//       city: "",
//       province: "",
//       provinceCode: "",
//       country: "India",
//       zip: "",
//       phone: "",
//     });
//   };

//   const sendBuyNowOtp = async () => {
//     if (!bnEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bnEmail)) {
//       setBuyNowError("Please enter a valid email");
//       return;
//     }

//     const customerShopifyId = typeof window !== 'undefined' ? localStorage.getItem("customerShopifyId") : null;

//     // If user is not logged in, skip OTP verification for Buy Now and proceed to address/checkout
//     if (!customerShopifyId) {
//       try { localStorage.setItem("customerEmail", bnEmail); } catch (e) { /* ignore */ }
//       setBuyNowError("");
//       setBuyNowStep(3);
//       return;
//     }

//     setBuyNowSendingOtp(true);
//     setBuyNowError("");
//     try {
//       const res = await fetch("/api/otp/send", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: bnEmail, shop: SHOP_DOMAIN }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setBuyNowStep(2);
//       } else if (data.message?.includes("already verified")) {
//         setBuyNowStep(3);
//       } else {
//         setBuyNowError(data.message || "Failed to send OTP");
//       }
//     } catch (err) {
//       console.error("sendBuyNowOtp error:", err);
//       setBuyNowError("Network error while sending OTP");
//     } finally {
//       setBuyNowSendingOtp(false);
//     }
//   };

//   const verifyBuyNowOtp = async () => {
//     if (!bnOtp) {
//       setBuyNowError("Please enter the OTP");
//       return;
//     }
//     setBuyNowVerifying(true);
//     setBuyNowError("");
//     try {
//       const res = await fetch("/api/otp/verify", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: bnEmail, otp: bnOtp, shop: SHOP_DOMAIN }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setBuyNowStep(3);
//       } else {
//         setBuyNowError("Invalid OTP");
//       }
//     } catch (err) {
//       console.error("verifyBuyNowOtp error:", err);
//       setBuyNowError("Network error while verifying OTP");
//     } finally {
//       setBuyNowVerifying(false);
//     }
//   };

//   const confirmBuyNowCheckout = async () => {
//     const variantId = getVariantId();
//     if (!variantId) return setBuyNowError("Variant missing");
//     const cleanVariantId = variantId.includes("gid://") ? variantId.split("/").pop() : variantId;

//     setBuyNowProcessing(true);
//     setBuyNowError("");

//     // Basic client-side validation to avoid sending an empty address to the API
//     if (!bnAddress.firstName || !bnAddress.address1 || !bnAddress.city || !bnAddress.province || !bnAddress.zip || !bnAddress.phone) {
//       setBuyNowError("Please fill all required address fields");
//       setBuyNowProcessing(false);
//       return;
//     }

//     try {
//       const payload = {
//         shop: SHOP_DOMAIN,
//         email: bnEmail,
//         name: `${bnAddress.firstName || ""} ${bnAddress.lastName || ""}`.trim(),
//         shippingAddress: {
//           ...bnAddress,
//           provinceCode: bnAddress.provinceCode || bnAddress.province,
//           countryCode: bnAddress.countryCode || (bnAddress.country === "India" ? "IN" : bnAddress.countryCode)
//         },
//         paymentMethod: bnPaymentMethod,
//         lineItems: [
//           {
//             variant_id: cleanVariantId,
//             quantity,
//             price: price,
//           },
//         ],
//       };

//       const res = await fetch("/api/orders/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       console.log("confirmBuyNowCheckout response:", data);

//       if (!res.ok || !data.success) {
//         throw new Error(data.error || data?.message || "Checkout failed");
//       }

//       const redirectUrl = data?.data?.checkoutUrl || data?.checkoutUrl || data?.data?.checkout_url || data?.checkout_url || data?.data?.url || data?.url || data?.data?.redirect || data?.redirectUrl || data?.data?.paymentLink || data?.paymentLink;

//       if (redirectUrl) {
//         window.location.href = redirectUrl;
//         return;
//       }

//       alert("Checkout initiated. Please check your email for payment details.");
//       resetBuyNowModal();
//     } catch (err) {
//       console.error("confirmBuyNowCheckout error:", err);
//       setBuyNowError(err.message || "Failed to start checkout");
//     } finally {
//       setBuyNowProcessing(false);
//     }
//   };


//   if (!product) {
//     return <div className="text-center py-20">Product not found</div>;
//   }

//   const price = selectedVariant?.price?.amount
//     ? Number(selectedVariant.price.amount)
//     : 0;

//   const compare = selectedVariant?.compareAtPrice?.amount
//     ? Number(selectedVariant.compareAtPrice.amount)
//     : 0;

//   const hasDiscount = compare > price && compare > 0;

//   const percentage = hasDiscount
//     ? Math.round(((compare - price) / compare) * 100)
//     : null;

//   const displayImage =
//     allImages[selectedImageIndex]?.url ||
//     product.featuredImage?.url ||
//     "/placeholder.jpg";

//   function CountdownTimer() {
//     const [timeLeft, setTimeLeft] = useState("");

//     useEffect(() => {
//       const timer = setInterval(() => {
//         const now = new Date();
//         const midnight = new Date();
//         midnight.setHours(23, 59, 59, 999);

//         const diff = midnight - now;

//         const hours = Math.floor(diff / (1000 * 60 * 60));
//         const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((diff % (1000 * 60)) / 1000);

//         setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);

//         if (diff < 0) {
//           setTimeLeft("0h 0m 0s");
//           clearInterval(timer);
//         }
//       }, 1000);

//       return () => clearInterval(timer);
//     }, []);

//     return <span className="font-bold text-orange-600 text-lg">{timeLeft}</span>;
//   }

//   const scrollRef = useRef(null);

//   useEffect(() => {
//     const el = scrollRef.current;

//     function handleWheel(e) {
//       if (window.scrollY > 100) return;

//       const atTop = el.scrollTop === 0;
//       const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;

//       if (e.deltaY > 0) {
//         if (!atBottom) {
//           e.preventDefault();
//           el.scrollTop += e.deltaY;
//         }
//       } else if (e.deltaY < 0) {
//         if (!atTop) {
//           e.preventDefault();
//           el.scrollTop += e.deltaY;
//         }
//       }
//     }

//     window.addEventListener("wheel", handleWheel, { passive: false });
//     return () => window.removeEventListener("wheel", handleWheel);
//   }, []);


//   const [showStickyBox, setShowStickyBox] = useState(false);
//   const [closedByUser, setClosedByUser] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (closedByUser) return;

//       if (window.scrollY > 500) {
//         setShowStickyBox(true);
//       } else {
//         setShowStickyBox(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [closedByUser]);

//   useEffect(() => {
//     if (!product?.id) return;

//     let viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

//     viewed = viewed.filter((id) => id !== product.id);

//     viewed.unshift(product.id);

//     viewed = viewed.slice(0, 10);

//     localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
//   }, [product]);


//   return (
//     <>
//       <div className="min-h-screen bg-white py-12 mt-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
//             {/* IMAGE SECTION */}
//             <div className="space-y-4">
//               <div className="relative group">
//                 {hasDiscount && (
//                   <div className="absolute top-6 left-6 z-20">
//                     <span className="bg-red-600 text-white px-5 py-2 text-sm font-bold rounded-full shadow-lg">
//                       {percentage}% OFF
//                     </span>
//                   </div>
//                 )}

//                 <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-3">
//                   <img
//                     src={displayImage}
//                     alt={product.title}
//                     className="rounded-xl w-full object-cover aspect-square transform group-hover:scale-105 transition-transform duration-500"
//                   />
//                 </div>
//               </div>

//               {allImages.length > 1 && (
//                 <div className="grid grid-cols-4 gap-3">
//                   {allImages.slice(0, 4).map((image, index) => (
//                     <div
//                       key={index}
//                       onClick={() => setSelectedImageIndex(index)}
//                       className={`relative overflow-hidden rounded-lg shadow-md bg-white p-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${selectedImageIndex === index
//                         ? "ring-2 ring-blue-600 shadow-lg"
//                         : "hover:shadow-lg"
//                         }`}
//                     >
//                       <img
//                         src={image.url}
//                         alt={`${product.title} - Image ${index + 1}`}
//                         className="rounded-md w-full object-cover aspect-square"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* DETAILS SECTION */}
//             <div
//               ref={scrollRef}
//               className="space-y-6 md:h-screen"
//               style={{
//                 overflowY: "auto",
//                 scrollbarWidth: "none",
//                 msOverflowStyle: "none",
//               }}
//             >
//               <h1 className="text-4xl lg:text-5xl font-bold text-black mt-2 leading-tight">
//                 {product.title}
//               </h1>
//               <p className="text-black text-sm text-gray-500">
//                 Tax Excluded.{" "}
//                 <a
//                   href="/shipping-policy"
//                   className="font-medium text-blue-600 hover:underline"
//                 >
//                   Shipping
//                 </a> calculated at checkout.
//               </p>


//               {/* Money Back Badge - Adjusted to a more neutral/modern style */}
//               <button
//                 onClick={() => setShowEasebuzzModal(true)}
//                 className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left cursor-pointer"
//               >
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center gap-2">
//                     <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
//                       <span className="text-gray-600 font-bold text-xl">₹</span>
//                     </div>

//                     <div>
//                       <div className="font-semibold text-gray-800 text-sm flex items-center gap-1">
//                         Easebuzz
//                       </div>
//                       <div className="text-xs text-gray-700 font-medium">Money Back Promise</div>
//                     </div>
//                   </div>

//                   <div className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
//                     On Prepaid Orders
//                   </div>
//                 </div>

//                 <div className="mt-3 border-t border-gray-200 pt-2 flex items-center gap-2">
//                   <span className="text-red-500 text-lg">⚠</span>
//                   <span className="text-xs">
//                     <span className="font-semibold text-red-500">Get 100% refund</span> on non-delivery or defects
//                   </span>
//                 </div>
//               </button>


//               {/* PRICE - Updated colors to match the image (red discount, green save) */}
//               <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-md">
//                 {hasDiscount ? (
//                   <div className="space-y-2">
//                     <div className="flex items-baseline gap-4 flex-wrap">
//                       <span className="text-5xl font-bold text-black">
//                         ₹{price.toFixed(2)}
//                       </span>
//                       <span className="text-2xl line-through text-gray-400 font-medium">
//                         ₹{compare.toFixed(2)}
//                       </span>
//                       <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ml-auto">
//                         {percentage}% OFF
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-green-600 font-semibold text-sm">
//                         Save ₹{(compare - price).toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                 ) : (
//                   <span className="text-5xl font-bold text-black">
//                     ₹{price.toFixed(2)}
//                   </span>
//                 )}
//               </div>

//               {/* VARIANT SELECTOR - Modern blue theme with image switching */}
//               {product.variants.length > 1 && (
//                 <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-600/20">
//                   <h3 className="font-semibold text-lg text-blue-600 mb-4">
//                     Choose Variant
//                   </h3>

//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                     {product.variants.map((variant) => {
//                       const isActive = selectedVariant?.id === variant.id;

//                       return (
//                         <button
//                           key={variant.id}
//                           onClick={() => handleVariantChange(variant)}
//                           className={`
//               relative rounded-xl px-4 py-4 text-center font-medium
//               border-2 transition-all duration-200 cursor-pointer
//               ${isActive
//                               ? "border-blue-600 bg-blue-600 text-white shadow-md scale-[1.03]"
//                               : "border-gray-300 text-gray-800 hover:border-blue-600"
//                             }
//             `}
//                         >
//                           {isActive && (
//                             <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white text-blue-600 text-xs flex items-center justify-center font-bold">
//                               ✓
//                             </span>
//                           )}

//                           <span className="block text-sm font-semibold">
//                             {variant.title}
//                           </span>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}


//               {/* QUANTITY & ADD TO CART - Blue primary button */}
//               <div className="flex items-center gap-6">
//                 <div className="flex items-center bg-gray-50 border border-gray-300 rounded-full px-1 py-1 shadow-sm">
//                   <button
//                     onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//                     disabled={quantity <= 1}
//                     className="w-12 h-12 flex items-center justify-center rounded-full 
//                 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 
//                 transition shadow-sm text-2xl text-white font-bold cursor-pointer"
//                   >
//                     –
//                   </button>
//                   <span className="mx-4 text-xl font-semibold min-w-[40px] text-center">
//                     {quantity}
//                   </span>
//                   <button
//                     onClick={() => setQuantity((q) => q + 1)}
//                     className="w-12 h-12 flex items-center justify-center rounded-full 
//                 bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm 
//                 text-2xl font-bold cursor-pointer"
//                   >
//                     +
//                   </button>

//                 </div>

//                 <button
//                   onClick={handleBuyNow}
//                   disabled={buyNowLoading || !selectedVariant}
//                   className="w-44 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {buyNowLoading ? "Processing..." : "Buy Now"}
//                 </button>

//                 <button
//                   onClick={handleAddToCart}
//                   disabled={loading || !selectedVariant}
//                   className="flex-1 bg-blue-600 text-white font-bold py-6 px-8 rounded-lg 
//                 hover:bg-blue-700 transition-all duration-300 text-lg shadow-lg
//                 disabled:opacity-50 disabled:cursor-not-allowed
//                 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
//                 >
//                   {loading ? "Adding to Cart..." : "Add to Cart"}
//                 </button>
//               </div>

//               <AskExpert />

//               {/* DELIVERY TIMELINE - Neutral/modern */}
//               <div className="bg-gray-50 rounded-2xl p-6 mt-8 border border-gray-200">
//                 <div className="relative">
//                   <div className="flex items-center justify-between relative">
//                     <div className="absolute top-6 left-12 right-12 h-0.5 bg-gray-300"></div>

//                     {(() => {
//                       const today = new Date();
//                       const oneDay = 24 * 60 * 60 * 1000;

//                       const orderDate = today;
//                       const dispatchStart = new Date(today.getTime() + oneDay);
//                       const dispatchEnd = new Date(today.getTime() + 2 * oneDay);

//                       const deliveryStartCandidate = new Date(today.getTime() + 3 * oneDay);
//                       const endOfDay = new Date(today);
//                       endOfDay.setHours(23, 59, 59, 999);

//                       const deliveryStart =
//                         deliveryStartCandidate.getTime() > endOfDay.getTime()
//                           ? new Date(today.getTime() + 4 * oneDay)
//                           : deliveryStartCandidate;

//                       const deliveryEnd = new Date(today.getTime() + 7 * oneDay);

//                       const format = (d) =>
//                         d.toLocaleDateString("en-IN", {
//                           day: "2-digit",
//                           month: "2-digit",
//                         });

//                       return (
//                         <>
//                           <div className="flex flex-col items-center z-10">
//                             <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
//                               🛍️
//                             </div>
//                             <p className="mt-3 text-sm font-semibold text-gray-700">Order</p>
//                             <p className="text-xs text-gray-600">{format(orderDate)}</p>
//                           </div>

//                           <div className="flex flex-col items-center z-10">
//                             <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
//                               ✈️
//                             </div>
//                             <p className="mt-3 text-sm font-semibold text-gray-700">Order Dispatch</p>
//                             <p className="text-xs text-gray-600">
//                               {format(dispatchStart)} – {format(dispatchEnd)}
//                             </p>
//                           </div>

//                           <div className="flex flex-col items-center z-10">
//                             <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
//                               📦
//                             </div>
//                             <p className="mt-3 text-sm font-semibold text-gray-700">Delivery</p>
//                             <p className="text-xs text-gray-600">
//                               {format(deliveryStart)} – {format(deliveryEnd)}
//                             </p>
//                           </div>
//                         </>
//                       );
//                     })()}

//                   </div>
//                 </div>

//                 <div className="mt-8 space-y-3">
//                   <div className="flex flex-col gap-2 bg-white rounded-xl px-5 py-4 shadow-md">
//                     <div className="flex items-start gap-3">
//                       <span className="text-2xl">👉</span>
//                       <p className="text-gray-800 font-medium">
//                         Free Shipping In India (On Order Above ₹999)
//                       </p>
//                     </div>

//                     <div className="flex items-start gap-3">
//                       <span className="text-2xl">👉</span>
//                       <p className="text-gray-800 font-medium">
//                         Order within the next <CountdownTimer /> for <strong>dispatch today</strong>, and you'll receive your package between{" "}
//                         <strong>
//                           {new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'numeric' })}
//                           {" – "}
//                           {new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'numeric' })}
//                         </strong>
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//               </div>


//               <div className="bg-green-50 rounded-xl p-5 flex items-start gap-4 border border-green-200 shadow-sm">
//                 <HandCoins className="w-7 h-7 text-green-700" />

//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">Rewards</h3>
//                   <p className="text-gray-700 text-sm">
//                     Shop for Rs.999/- & Get Free Shipping
//                   </p>
//                 </div>
//               </div>

//               <div className="flex flex-col gap-4 mt-6">
//                 <div className="flex items-center gap-3">
//                   <Package className="w-6 h-6 text-gray-700" />
//                   <span className="text-gray-800 text-sm md:text-base">
//                     Free Shipping & Exchanges
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <Lock className="w-6 h-6 text-gray-700" />
//                   <span className="text-gray-800 text-sm md:text-base">
//                     Flexible and secure payment, pay on delivery
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <Award className="w-6 h-6 text-gray-700" />
//                   <span className="text-gray-800 text-sm md:text-base">
//                     800,000+ Happy customers
//                   </span>
//                 </div>
//               </div>




//               {/* Meta Feilds */}

//               <div className="space-y-3">
//                 {product.metafields.map((mf) => {
//                   const id = `${mf.namespace}.${mf.key}`;
//                   const isOpen = openItems.includes(id);

//                   const toggle = () => {
//                     setOpenItems(prev =>
//                       isOpen ? prev.filter(item => item !== id) : [...prev, id]
//                     );
//                   };

//                   let content;

//                   // ----- CONTENT LOGIC (FIXED) -----
//                   if (mf.key === "capacity") {
//                     let values = [];

//                     try {
//                       values = Array.isArray(mf.value)
//                         ? mf.value
//                         : JSON.parse(mf.value);
//                     } catch (e) {
//                       values = [mf.value];
//                     }

//                     content = (
//                       <ul className="list-disc pl-5 space-y-1 text-gray-700">
//                         {values.map((val, i) => (
//                           <li key={i}>{val}</li>
//                         ))}
//                       </ul>
//                     );
//                   }

//                   else if (mf.key === "care_advice") {
//                     content = mf.value.split("\n").map((line, i) => (
//                       <p key={i} className="text-gray-700 mb-1">
//                         {line}
//                       </p>
//                     ));
//                   }
//                   else {
//                     return null;
//                   }

//                   return (
//                     <div
//                       key={id}
//                       className="overflow-hidden rounded-xl bg-white shadow-md border border-gray-200 transition-all duration-300 hover:shadow-xl"
//                     >
//                       <button
//                         onClick={toggle}
//                         className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-gray-800 transition-all hover:bg-gradient-to-r hover:from-sky-100/80 hover:to-sky-50/50 focus:outline-none"
//                       >
//                         <span className="text-lg capitalize">
//                           {mf.key.replace("_", " ")}
//                         </span>

//                         <div
//                           className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
//                             }`}
//                         >
//                           {isOpen ? (
//                             <ChevronUp className="h-5 w-5 text-blue-600" />
//                           ) : (
//                             <ChevronDown className="h-5 w-5 text-blue-600" />
//                           )}
//                         </div>
//                       </button>

//                       <div
//                         className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//                           }`}
//                       >
//                         <div className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-5">
//                           {content}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>



//               {/* TRUST BADGES - Modern neutral */}
//               <div className="flex xl:flex-nowrap flex-wrap xl:justify-between justify-center gap-10 py-6">

//                 <div className="flex flex-col items-center">
//                   <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-gray-300 flex items-center justify-center">
//                     <Hammer className="text-gray-600 w-10 h-10" />
//                   </div>
//                   <p className="mt-2 text-sm font-semibold text-black text-center">Handcrafted</p>
//                 </div>

//                 <div className="flex flex-col items-center">
//                   <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-gray-300 flex items-center justify-center">
//                     <Trees className="text-gray-600 w-10 h-10" />
//                   </div>
//                   <p className="mt-2 text-sm font-semibold text-black text-center">Premium Wood</p>
//                 </div>

//                 <div className="flex flex-col items-center">
//                   <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-gray-300 flex items-center justify-center">
//                     <Heart className="text-gray-600 w-10 h-10" />
//                   </div>
//                   <p className="mt-2 text-sm font-semibold text-black text-center">Comfortable Swing</p>
//                 </div>

//                 <div className="flex flex-col items-center">
//                   <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-gray-300 flex items-center justify-center">
//                     <Home className="text-gray-600 w-10 h-10" />
//                   </div>
//                   <p className="mt-2 text-sm font-semibold text-black text-center">Traditional Design</p>
//                 </div>

//                 <div className="flex flex-col items-center">
//                   <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-gray-300 flex items-center justify-center">
//                     <Truck className="text-gray-600 w-10 h-10" />
//                   </div>
//                   <p className="mt-2 text-sm font-semibold text-black text-center">Fast Shipping</p>
//                 </div>

//               </div>
//             </div>
//           </div>

//           {product.descriptionHtml && (
//             <div className="mt-16 max-w-4xl mx-auto">
//               <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200">
//                 <h3 className="font-bold mb-6 text-2xl text-gray-800 text-center">
//                   Product Details
//                 </h3>
//                 <div
//                   className="prose prose-sm max-w-none text-gray-700 text-left leading-relaxed text-center"
//                   dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>



//       {/* EASEBUZZ MODAL - Updated to neutral */}
//       {showEasebuzzModal && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
//           onClick={() => setShowEasebuzzModal(false)}
//         >
//           <div
//             className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="bg-blue-600 text-white p-6 relative">
//               <button
//                 onClick={() => setShowEasebuzzModal(false)}
//                 className="absolute top-4 right-4 text-white"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
//                   <span className="text-2xl font-bold">₹</span>
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold">Protected by Easebuzz</h3>
//                   <p>Money Back Promise</p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 space-y-5">
//               <div className="bg-gray-50 rounded-xl p-5 text-center border border-gray-200">
//                 <p className="text-gray-700">
//                   If your order is <strong>incorrect, damaged, or not delivered</strong>,<br />
//                   get <strong>100% refund at zero cost</strong> from Easebuzz.
//                 </p>
//                 <p className="text-sm text-gray-600 font-medium mt-3">Valid on Prepaid orders only</p>
//               </div>

//               <div className="space-y-3">
//                 <div className="flex gap-3">
//                   <div className="w-8 h-8 bg-gray-100 rounded-full flex justify-center items-center">
//                     <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="font-bold">100% Refund</p>
//                     <p className="text-sm text-gray-600">on non-delivery or damaged items</p>
//                   </div>
//                 </div>

//                 <div className="flex gap-3">
//                   <div className="w-8 h-8 bg-gray-100 rounded-full flex justify-center items-center">
//                     <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="font-bold">100% Free</p>
//                     <p className="text-sm text-gray-600">no hidden charges</p>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={() => setShowEasebuzzModal(false)}
//                 className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl"
//               >
//                 Yes, got it
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* BUY NOW MODAL (OTP -> Address -> Confirm) */}
//       {showBuyNowModal && (
//         <div
//           onClick={resetBuyNowModal}
//           className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="bg-white rounded-2xl shadow-2xl max-w-xs sm:max-w-sm md:max-w-md w-full mx-4 overflow-hidden animate-slideUp"
//           >
//             {/* Header with gradient */}
//             <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-5 relative">
//               <h2 className="text-xl sm:text-2xl font-bold text-white">Quick Checkout</h2>
//               <p className="text-slate-300 text-xs sm:text-sm mt-1">Complete your purchase in minutes</p>
//               <button
//                 onClick={resetBuyNowModal}
//                 className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors text-2xl w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full"
//               >
//                 ×
//               </button>
//               {/* Progress indicator */}
//               <div className="flex gap-2 mt-4">
//                 <div className={`flex-1 h-1 rounded-full transition-all ${buyNowStep >= 0 ? 'bg-white' : 'bg-white/30'}`}></div>
//                 <div className={`flex-1 h-1 rounded-full transition-all ${buyNowStep >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
//                 <div className={`flex-1 h-1 rounded-full transition-all ${buyNowStep >= 3 ? 'bg-white' : 'bg-white/30'}`}></div>
//               </div>
//             </div>

//             {/* Content area */}
//             <div className="p-6">
//               {buyNowError && (
//                 <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-r-lg mb-4 text-xs sm:text-sm flex items-start gap-2 animate-shake">
//                   <span className="text-lg">⚠️</span>
//                   <span>{buyNowError}</span>
//                 </div>
//               )}

//               {/* Step 0: Email */}
//               {buyNowStep === 0 && (
//                 <div className="animate-fadeIn">
//                   <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-200">
//                     <div className="flex items-center gap-3 mb-2">
//                       <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg">
//                         📧
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-slate-900">Email Verification</h3>
//                         <p className="text-xs text-slate-600">We'll send a verification code</p>
//                       </div>
//                     </div>
//                   </div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
//                   <input
//                     type="email"
//                     value={bnEmail}
//                     onChange={(e) => setBnEmail(e.target.value)}
//                     className="w-full border-2 border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 rounded-xl px-4 py-3 mb-5 text-sm transition-all outline-none"
//                     placeholder="your.email@example.com"
//                   />
//                   <div className="flex gap-3">
//                     <button
//                       onClick={resetBuyNowModal}
//                       className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={sendBuyNowOtp}
//                       disabled={buyNowSendingOtp}
//                       className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
//                     >
//                       {buyNowSendingOtp ? (
//                         <span className="flex items-center justify-center gap-2">
//                           <span className="animate-spin">⏳</span> Sending...
//                         </span>
//                       ) : 'Continue →'}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Step 2: OTP */}
//               {buyNowStep === 2 && (
//                 <div className="animate-fadeIn">
//                   <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-200">
//                     <div className="flex items-center gap-3 mb-2">
//                       <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg">
//                         🔐
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-slate-900">Enter Verification Code</h3>
//                         <p className="text-xs text-slate-600">Sent to {bnEmail}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">6-Digit Code</label>
//                   <input
//                     type="text"
//                     value={bnOtp}
//                     onChange={(e) => setBnOtp(e.target.value)}
//                     className="w-full border-2 border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 rounded-xl px-4 py-3 mb-5 text-sm text-center font-mono text-lg tracking-widest transition-all outline-none"
//                     placeholder="000000"
//                     maxLength={6}
//                   />
//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => setBuyNowStep(0)}
//                       className="px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
//                     >
//                       ← Back
//                     </button>
//                     <button
//                       onClick={verifyBuyNowOtp}
//                       disabled={buyNowVerifying}
//                       className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
//                     >
//                       {buyNowVerifying ? (
//                         <span className="flex items-center justify-center gap-2">
//                           <span className="animate-spin">⏳</span> Verifying...
//                         </span>
//                       ) : 'Verify & Continue →'}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Step 3: Address & Payment */}
//               {buyNowStep === 3 && (
//                 <div className="animate-fadeIn">
//                   <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-200">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg">
//                         📦
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-slate-900">Shipping & Payment</h3>
//                         <p className="text-xs text-slate-600">Almost there!</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-4 mb-5 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <label className="block text-xs font-medium text-slate-700 mb-1.5">First Name</label>
//                         <input
//                           type="text"
//                           value={bnAddress.firstName}
//                           onChange={(e) => setBnAddress(prev => ({ ...prev, firstName: e.target.value }))}
//                           className="w-full border-2 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900/20 rounded-lg px-3 py-2 text-sm transition-all outline-none"
//                           placeholder="John"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-slate-700 mb-1.5">Last Name</label>
//                         <input
//                           type="text"
//                           value={bnAddress.lastName}
//                           onChange={(e) => setBnAddress(prev => ({ ...prev, lastName: e.target.value }))}
//                           className="w-full border-2 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900/20 rounded-lg px-3 py-2 text-sm transition-all outline-none"
//                           placeholder="Doe"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-xs font-medium text-slate-700 mb-1.5">Street Address</label>
//                       <input
//                         type="text"
//                         value={bnAddress.address1}
//                         onChange={(e) => setBnAddress(prev => ({ ...prev, address1: e.target.value }))}
//                         className="w-full border-2 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900/20 rounded-lg px-3 py-2 text-sm transition-all outline-none"
//                         placeholder="123 Main Street, Apt 4B"
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <label className="block text-xs font-medium text-slate-700 mb-1.5">City</label>
//                         <input
//                           type="text"
//                           value={bnAddress.city}
//                           onChange={(e) => setBnAddress(prev => ({ ...prev, city: e.target.value }))}
//                           className="w-full border-2 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900/20 rounded-lg px-3 py-2 text-sm transition-all outline-none"
//                           placeholder="Mumbai"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-slate-700 mb-1.5">State/Province</label>
//                         <input
//                           type="text"
//                           value={bnAddress.province}
//                           onChange={(e) => setBnAddress(prev => ({ ...prev, province: e.target.value }))}
//                           className="w-full border-2 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900/20 rounded-lg px-3 py-2 text-sm transition-all outline-none"
//                           placeholder="Maharashtra"
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <label className="block text-xs font-medium text-slate-700 mb-1.5">Postal Code</label>
//                         <input
//                           type="text"
//                           value={bnAddress.zip}
//                           onChange={(e) => setBnAddress(prev => ({ ...prev, zip: e.target.value }))}
//                           className="w-full border-2 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900/20 rounded-lg px-3 py-2 text-sm transition-all outline-none"
//                           placeholder="400001"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-medium text-slate-700 mb-1.5">Phone Number</label>
//                         <input
//                           type="tel"
//                           value={bnAddress.phone}
//                           onChange={(e) => setBnAddress(prev => ({ ...prev, phone: e.target.value }))}
//                           className="w-full border-2 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900/20 rounded-lg px-3 py-2 text-sm transition-all outline-none"
//                           placeholder="+91 98765 43210"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-xs font-medium text-slate-700 mb-2">Payment Method</label>
//                       <div className="grid grid-cols-2 gap-3">
//                         <button
//                           type="button"
//                           onClick={() => setBnPaymentMethod('online')}
//                           className={`border-2 rounded-lg px-4 py-3 text-sm font-medium transition-all ${bnPaymentMethod === 'online'
//                               ? 'border-slate-900 bg-slate-900 text-white'
//                               : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
//                             }`}
//                         >
//                           <div className="text-lg mb-1">💳</div>
//                           Online Payment
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => setBnPaymentMethod('cod')}
//                           className={`border-2 rounded-lg px-4 py-3 text-sm font-medium transition-all ${bnPaymentMethod === 'cod'
//                               ? 'border-slate-900 bg-slate-900 text-white'
//                               : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
//                             }`}
//                         >
//                           <div className="text-lg mb-1">💵</div>
//                           Cash on Delivery
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex gap-3 pt-4 border-t border-slate-200">
//                     <button
//                       onClick={() => setBuyNowStep(0)}
//                       className="px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
//                     >
//                       ← Back
//                     </button>
//                     <button
//                       onClick={confirmBuyNowCheckout}
//                       disabled={buyNowProcessing}
//                       className="flex-1 px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl text-sm font-medium hover:from-slate-800 hover:to-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
//                     >
//                       {buyNowProcessing ? (
//                         <span className="flex items-center justify-center gap-2">
//                           <span className="animate-spin">⏳</span> Processing...
//                         </span>
//                       ) : (
//                         <span className="flex items-center justify-center gap-2">
//                           Complete Purchase 🎉
//                         </span>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//       {showStickyBox && (
//         <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-50 border-t border-gray-200">
//           <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3">
//             <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">

//               <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
//                 <img
//                   src={displayImage}
//                   alt="product"
//                   className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0 border border-gray-200"
//                 />
//                 <div className="flex-1 min-w-0">
//                   <p className="font-semibold text-blue-600 text-xs sm:text-sm truncate">
//                     {product.title}
//                   </p>
//                   <p className="text-base sm:text-lg font-bold text-black">
//                     ₹{price.toFixed(2)}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

//                 {product.variants?.length > 1 && (
//                   <div className="relative">
//                     <select
//                       value={selectedVariant?.id || ""}
//                       onChange={(e) => {
//                         const variant = product.variants.find(v => v.id === e.target.value);
//                         handleVariantChange(variant);
//                       }}
//                       className="appearance-none bg-white border-2 border-gray-300 rounded-lg 
//                   px-3 sm:px-4 py-2 sm:py-2.5 pr-8 sm:pr-10 
//                   text-xs sm:text-sm font-medium text-gray-900 cursor-pointer
//                   hover:border-blue-600 focus:outline-none focus:border-blue-600 
//                   focus:ring-2 focus:ring-blue-600/20 transition-all"
//                     >
//                       <option value="">Select Variant</option>
//                       {product.variants.map((variant) => (
//                         <option key={variant.id} value={variant.id}>
//                           {variant.title}
//                         </option>
//                       ))}
//                     </select>

//                     <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                       <svg
//                         className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex items-center bg-gray-50 border border-gray-300 rounded-full px-1 py-1 shadow-sm">
//                   <button
//                     onClick={() => setQuantity(q => Math.max(1, q - 1))}
//                     disabled={quantity <= 1}
//                     className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full 
//                 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 
//                 transition text-lg sm:text-xl text-white font-bold cursor-pointer"
//                   >
//                     –
//                   </button>

//                   <span className="mx-2 sm:mx-3 text-sm sm:text-base font-semibold min-w-[24px] text-center">
//                     {quantity}
//                   </span>

//                   <button
//                     onClick={() => setQuantity(q => q + 1)}
//                     className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full 
//                 bg-blue-600 hover:bg-blue-700 transition 
//                 text-lg sm:text-xl text-white font-bold cursor-pointer"
//                   >
//                     +
//                   </button>
//                 </div>

//                 <button
//                   onClick={handleBuyNow}
//                   disabled={buyNowLoading || !selectedVariant}
//                   className="bg-green-600 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-xs sm:text-sm mr-2 cursor-pointer"
//                 >
//                   {buyNowLoading ? "Processing..." : "BUY NOW"}
//                 </button>

//                 <button
//                   onClick={handleAddToCart}
//                   disabled={loading || !selectedVariant}
//                   className="bg-blue-600 text-white font-semibold 
//               px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 rounded-lg 
//               hover:bg-blue-700 transition-all
//               disabled:opacity-50 disabled:cursor-not-allowed
//               shadow-md hover:shadow-lg whitespace-nowrap
//               text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
//                 >
//                   {loading ? "Adding..." : "ADD TO CART"}
//                 </button>

//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {showLoginPopup && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm text-center">
//             <h2 className="text-lg font-semibold mb-2">
//               Login Required
//             </h2>
//             <p className="text-sm text-gray-600 mb-5">
//               You are not logged in. Please login to add items to your cart.
//             </p>

//             <div className="flex gap-3 justify-center">
//               <button
//                 onClick={() => setShowLoginPopup(false)}
//                 className="px-4 py-2 border rounded-md text-gray-700 cursor-pointer"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={() => {
//                   setShowLoginPopup(false);
//                   window.location.href = "/auth/login";
//                 }}
//                 className="px-4 py-2 bg-black text-white rounded-md cursor-pointer"
//               >
//                 Login
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }