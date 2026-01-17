// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import Slider from "react-slick";
// import { Star, ShoppingCart, Info } from "lucide-react";
// import { getAllProducts } from "@/lib/shopify";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// // Integrated Product Card Component for Slider
// function SliderProductCard({ product }) {
//   const [loading, setLoading] = useState(false);
//   const [averageRating, setAverageRating] = useState(0);
//   const [reviewCount, setReviewCount] = useState(0);
//   const router = useRouter();

//   // Robust image URL extraction
//   const getImageUrl = () => {
//     // Try all possible image structures
//     if (product?.featuredImage?.url) {
//       return product.featuredImage.url;
//     }
//     if (product?.images?.edges?.length > 0) {
//       return product.images.edges[0].node.url || product.images.edges[0].node.src;
//     }
//     if (product?.images?.nodes?.length > 0) {
//       return product.images.nodes[0].url || product.images.nodes[0].src;
//     }
//     if (Array.isArray(product?.images) && product.images.length > 0) {
//       const firstImage = product.images[0];
//       return typeof firstImage === "string" ? firstImage : (firstImage?.url || firstImage?.src);
//     }
//     if (product?.image?.url) {
//       return product.image.url;
//     }
//     if (product?.image?.src) {
//       return product.image.src;
//     }
//     return null;
//   };

//   const imageUrl = getImageUrl();
//   const hasValidImage = imageUrl && typeof imageUrl === "string" && (imageUrl.startsWith("http") || imageUrl.startsWith("/"));

//   // Fetch reviews
//   useEffect(() => {
//     const fetchReviews = async () => {
//       if (!product?.id) return;

//       try {
//         const res = await fetch(`/api/reviews/list?productId=${encodeURIComponent(product.id)}`);
//         if (!res.ok) return;
//         const data = await res.json();
//         const reviewList = data.reviews || [];

//         setReviewCount(reviewList.length);
//         const avg = reviewList.length > 0
//           ? reviewList.reduce((acc, r) => acc + r.rating, 0) / reviewList.length
//           : 0;
//         setAverageRating(avg);
//       } catch (err) {
//         console.error("Failed to fetch reviews:", err);
//       }
//     };

//     fetchReviews();
//   }, [product?.id]);

//   // Price handling with multiple fallbacks
//   const getPriceData = () => {
//     let priceAmount = 0;
//     let compareAtAmount = 0;

//     // Try different price structures
//     if (product?.priceRangeV2?.minVariantPrice?.amount) {
//       priceAmount = product.priceRangeV2.minVariantPrice.amount;
//       if (product.compareAtPriceRange?.minVariantPrice?.amount) {
//         compareAtAmount = product.compareAtPriceRange.minVariantPrice.amount;
//       }
//     } else if (product?.priceRange?.minVariantPrice?.amount) {
//       priceAmount = product.priceRange.minVariantPrice.amount;
//       if (product.compareAtPriceRange?.minVariantPrice?.amount) {
//         compareAtAmount = product.compareAtPriceRange.minVariantPrice.amount;
//       }
//     } else if (product?.price?.amount) {
//       priceAmount = product.price.amount;
//       compareAtAmount = product.compareAtPrice?.amount || 0;
//     } else if (product?.price) {
//       priceAmount = product.price;
//       compareAtAmount = product.compareAtPrice || 0;
//     } else if (product?.variants?.edges?.[0]?.node?.price?.amount) {
//       priceAmount = product.variants.edges[0].node.price.amount;
//       compareAtAmount = product.variants.edges[0].node.compareAtPrice?.amount || 0;
//     } else if (product?.variants?.nodes?.[0]?.price?.amount) {
//       priceAmount = product.variants.nodes[0].price.amount;
//       compareAtAmount = product.variants.nodes[0].compareAtPrice?.amount || 0;
//     } else if (product?.variants?.[0]?.price?.amount) {
//       priceAmount = product.variants[0].price.amount;
//       compareAtAmount = product.variants[0].compareAtPrice?.amount || 0;
//     } else if (product?.variants?.[0]?.price) {
//       priceAmount = product.variants[0].price;
//       compareAtAmount = product.variants[0].compareAtPrice || 0;
//     }

//     return {
//       price: Number(priceAmount) || 0,
//       compareAt: Number(compareAtAmount) || 0
//     };
//   };

//   const { price, compareAt } = getPriceData();
//   const hasDiscount = compareAt > price && compareAt > 0;
//   const discountPercent = hasDiscount ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

//   const handleAddToCart = async (e) => {
//     e.stopPropagation();
//     e.preventDefault();

//     let variantId = product.variantId;
//     if (!variantId && product?.variants?.edges?.[0]?.node?.id) {
//       variantId = product.variants.edges[0].node.id;
//     }
//     if (!variantId && product?.variants?.nodes?.[0]?.id) {
//       variantId = product.variants.nodes[0].id;
//     }
//     if (!variantId && product?.variants?.[0]?.id) {
//       variantId = product.variants[0].id;
//     }
    
//     if (!variantId) {
//       alert("No variant available");
//       return;
//     }

//     const customerShopifyId = localStorage.getItem("customerShopifyId");
//     const cleanVariantId = variantId.includes("gid://") ? variantId.split("/").pop() : variantId;

//     setLoading(true);

//     try {
//       const res = await fetch("/api/cart/add", {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",
//           "X-Cart-Id": localStorage.getItem("cartId") || "",
//         },
//         body: JSON.stringify({
//           variantId: cleanVariantId,
//           quantity: 1,
//           customerShopifyId: customerShopifyId || null,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok || !data?.success) {
//         throw new Error(data?.error || "Add to cart failed");
//       }

//       if (data.cart?.id) {
//         localStorage.setItem("guestCartId", data.cart.id);
//         localStorage.setItem("cartId", data.cart.id);
//       }

//       window.dispatchEvent(new Event("cart-updated"));
//       window.dispatchEvent(new Event("open-cart-drawer"));
//     } catch (err) {
//       console.error("Add to cart error:", err);
//       alert(`Failed to add: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderStars = () => {
//     const displayRating = reviewCount === 0 ? 5 : averageRating;
//     return (
//       <div className="flex items-center gap-1">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Star
//             key={star}
//             className={`w-3 h-3 ${
//               star <= Math.round(displayRating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
//             }`}
//           />
//         ))}
//       </div>
//     );
//   };

//   const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltG3bA8w1j3aR9a7iT7nT3jX0l5x4v//Z";

//   return (
//     <div 
//       className="group cursor-pointer relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full"
//       onClick={() => router.push(`/product/${product?.handle}`)}
//     >
//       {/* Discount Badge */}
//       {hasDiscount && (
//         <div className="absolute top-3 right-3 z-20 bg-gradient-to-br from-red-500 to-pink-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
//           {discountPercent}% OFF
//         </div>
//       )}

//       {/* Product Image */}
//       <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
//         {hasValidImage ? (
//           <Image
//             src={imageUrl}
//             alt={product?.title || "Product image"}
//             fill
//             sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
//             className="object-cover transition-transform duration-500 group-hover:scale-110"
//             unoptimized={true}
//             priority={false}
//             placeholder="blur"
//             blurDataURL={blurDataURL}
//             onError={(e) => {
//               console.error("Image load failed:", imageUrl);
//               e.target.style.display = "none";
//             }}
//           />
//         ) : (
//           <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-center px-4">
//             <span className="text-gray-500 text-xs font-medium">No Image</span>
//             <span className="text-gray-400 text-[10px] mt-1 line-clamp-2">{product?.title}</span>
//           </div>
//         )}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//       </div>

//       {/* Product Info */}
//       <div className="p-3">
//         {/* Vendor */}
//         {product?.vendor && (
//           <p className="text-slate-500 text-xs mb-1 uppercase tracking-wide">{product.vendor}</p>
//         )}

//         {/* Stars */}
//         <div className="flex items-center gap-1.5 mb-2">
//           {renderStars()}
//           {reviewCount > 0 && (
//             <span className="text-xs text-slate-600">
//               {averageRating.toFixed(1)} ({reviewCount})
//             </span>
//           )}
//         </div>

//         {/* Title */}
//         <h3 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem]">
//           {product?.title || "Untitled Product"}
//         </h3>

//         {/* Price */}
//         <div className="flex items-baseline gap-1.5 mb-3">
//           {price > 0 ? (
//             <>
//               <span className="text-xs text-slate-500">Rs.</span>
//               <span className="text-lg font-bold text-blue-600">{price.toLocaleString("en-IN")}</span>
//               {hasDiscount && (
//                 <span className="text-sm text-slate-400 line-through">
//                   {compareAt.toLocaleString("en-IN")}
//                 </span>
//               )}
//             </>
//           ) : (
//             <span className="text-sm text-slate-500 italic">Price not available</span>
//           )}
//         </div>

//         {/* Buttons */}
//         <div className="grid grid-cols-2 gap-2">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               router.push(`/product/${product?.handle}`);
//             }}
//             className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
//           >
//             <Info className="w-3 h-3" />
//             Details
//           </button>

//           <button
//             onClick={handleAddToCart}
//             disabled={loading}
//             className={`border-2 border-blue-600 text-blue-600 px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
//               loading ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             <ShoppingCart className="w-3 h-3" />
//             {loading ? "Adding..." : "Add"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Main Recently Viewed Component
// export default function RecentlyViewedProducts() {
//   const [products, setProducts] = useState([]);
//   const [mounted, setMounted] = useState(false);
//   const [windowWidth, setWindowWidth] = useState(0);

//   // Track window width for custom breakpoints
//   useEffect(() => {
//     setMounted(true);
    
//     // Set initial width
//     setWindowWidth(window.innerWidth);
    
//     // Handle resize
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     async function load() {
//       const ids = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
//       if (!ids.length) return;

//       const allProducts = await getAllProducts(100);

//       const viewedProducts = ids
//         .map((id) => allProducts.find((p) => p.id === id))
//         .filter(Boolean);

//       setProducts(viewedProducts);
      
//       // Debug logging
//       console.log("=== RECENTLY VIEWED DEBUG ===");
//       console.log("Recently viewed IDs:", ids);
//       console.log("Found products:", viewedProducts.length);
//       if (viewedProducts.length > 0) {
//         console.log("First product:", viewedProducts[0]);
//       }
//       console.log("============================");
//     }

//     if (mounted) {
//       load();
//     }
//   }, [mounted]);

//   if (!products.length || !mounted) return null;

//   // Custom breakpoint logic using if statements
//   let slidesToShow = 4; // Default for desktop
//   let showArrows = true;
//   let showDots = true;
//   let infinite = products.length > 4;

//   if (windowWidth < 480) {
//     // Mobile portrait
//     slidesToShow = 1;
//     showArrows = false;
//     showDots = true;
//     infinite = products.length > 1;
//   } else if (windowWidth >= 480 && windowWidth < 768) {
//     // Mobile landscape
//     slidesToShow = 2;
//     showArrows = false;
//     showDots = true;
//     infinite = products.length > 2;
//   } else if (windowWidth >= 768 && windowWidth < 1024) {
//     // Tablet
//     slidesToShow = 3;
//     showArrows = true;
//     showDots = true;
//     infinite = products.length > 3;
//   } else if (windowWidth >= 1024) {
//     // Desktop
//     slidesToShow = 4;
//     showArrows = true;
//     showDots = true;
//     infinite = products.length > 4;
//   }

//   // Ensure we don't show more slides than products
//   slidesToShow = Math.min(slidesToShow, products.length);

//   const settings = {
//     dots: showDots,
//     arrows: showArrows,
//     infinite: infinite,
//     speed: 500,
//     slidesToShow: slidesToShow,
//     slidesToScroll: 1,
//     nextArrow: showArrows ? <SampleNextArrow /> : null,
//     prevArrow: showArrows ? <SamplePrevArrow /> : null,
//   };

//   return (
//     <section className="mt-12 relative bg-gradient-to-br from-blue-50 to-sky-50 py-8">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
//           Recently Viewed
//         </h2>
        
//         <div className="relative px-4 md:px-12">
//           <Slider {...settings} key={windowWidth}>
//             {products.map((product, index) => (
//               <div key={product.id || index} className="px-2">
//                 <SliderProductCard product={product} />
//               </div>
//             ))}
//           </Slider>
//         </div>

//         {/* Debug info - remove in production */}
//         {/* <div className="text-center mt-4 text-sm text-gray-600">
//           Window Width: {windowWidth}px | Slides: {slidesToShow} | Arrows: {showArrows ? 'Yes' : 'No'}
//         </div> */}
//       </div>
//     </section>
//   );
// }

// // Custom Arrow Components
// function SampleNextArrow({ onClick }) {
//   return (
//     <button
//       className="absolute top-1/2 right-[-60px] transform -translate-y-1/2 z-30 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
//       onClick={onClick}
//       aria-label="Next slide"
//     >
//       <svg 
//         className="w-5 h-5" 
//         fill="none" 
//         stroke="currentColor" 
//         viewBox="0 0 24 24"
//       >
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//       </svg>
//     </button>
//   );
// }

// function SamplePrevArrow({ onClick }) {
//   return (
//     <button
//       className="absolute top-1/2 left-[-60px] transform -translate-y-1/2 z-30 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer"
//       onClick={onClick}
//       aria-label="Previous slide"
//     >
//       <svg 
//         className="w-5 h-5" 
//         fill="none" 
//         stroke="currentColor" 
//         viewBox="0 0 24 24"
//       >
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//       </svg>
//     </button>
//   );
// }






"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import { Star, ShoppingCart, Info } from "lucide-react";
import { getAllProducts } from "@/lib/shopify";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Integrated Product Card Component for Slider
function SliderProductCard({ product }) {
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const router = useRouter();

  // Robust image URL extraction
  const getImageUrl = () => {
    // Try all possible image structures
    if (product?.featuredImage?.url) {
      return product.featuredImage.url;
    }
    if (product?.images?.edges?.length > 0) {
      return product.images.edges[0].node.url || product.images.edges[0].node.src;
    }
    if (product?.images?.nodes?.length > 0) {
      return product.images.nodes[0].url || product.images.nodes[0].src;
    }
    if (Array.isArray(product?.images) && product.images.length > 0) {
      const firstImage = product.images[0];
      return typeof firstImage === "string" ? firstImage : (firstImage?.url || firstImage?.src);
    }
    if (product?.image?.url) {
      return product.image.url;
    }
    if (product?.image?.src) {
      return product.image.src;
    }
    return null;
  };

  const imageUrl = getImageUrl();
  const hasValidImage = imageUrl && typeof imageUrl === "string" && (imageUrl.startsWith("http") || imageUrl.startsWith("/"));

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?.id) return;

      try {
        const res = await fetch(`/api/reviews/list?productId=${encodeURIComponent(product.id)}`);
        if (!res.ok) return;
        const data = await res.json();
        const reviewList = data.reviews || [];

        setReviewCount(reviewList.length);
        const avg = reviewList.length > 0
          ? reviewList.reduce((acc, r) => acc + r.rating, 0) / reviewList.length
          : 0;
        setAverageRating(avg);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };

    fetchReviews();
  }, [product?.id]);

  // Price handling with multiple fallbacks
  const getPriceData = () => {
    let priceAmount = 0;
    let compareAtAmount = 0;

    // Try different price structures
    if (product?.priceRangeV2?.minVariantPrice?.amount) {
      priceAmount = product.priceRangeV2.minVariantPrice.amount;
      if (product.compareAtPriceRange?.minVariantPrice?.amount) {
        compareAtAmount = product.compareAtPriceRange.minVariantPrice.amount;
      }
    } else if (product?.priceRange?.minVariantPrice?.amount) {
      priceAmount = product.priceRange.minVariantPrice.amount;
      if (product.compareAtPriceRange?.minVariantPrice?.amount) {
        compareAtAmount = product.compareAtPriceRange.minVariantPrice.amount;
      }
    } else if (product?.price?.amount) {
      priceAmount = product.price.amount;
      compareAtAmount = product.compareAtPrice?.amount || 0;
    } else if (product?.price) {
      priceAmount = product.price;
      compareAtAmount = product.compareAtPrice || 0;
    } else if (product?.variants?.edges?.[0]?.node?.price?.amount) {
      priceAmount = product.variants.edges[0].node.price.amount;
      compareAtAmount = product.variants.edges[0].node.compareAtPrice?.amount || 0;
    } else if (product?.variants?.nodes?.[0]?.price?.amount) {
      priceAmount = product.variants.nodes[0].price.amount;
      compareAtAmount = product.variants.nodes[0].compareAtPrice?.amount || 0;
    } else if (product?.variants?.[0]?.price?.amount) {
      priceAmount = product.variants[0].price.amount;
      compareAtAmount = product.variants[0].compareAtPrice?.amount || 0;
    } else if (product?.variants?.[0]?.price) {
      priceAmount = product.variants[0].price;
      compareAtAmount = product.variants[0].compareAtPrice || 0;
    }

    return {
      price: Number(priceAmount) || 0,
      compareAt: Number(compareAtAmount) || 0
    };
  };

  const { price, compareAt } = getPriceData();
  const hasDiscount = compareAt > price && compareAt > 0;
  const discountPercent = hasDiscount ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    let variantId = product.variantId;
    if (!variantId && product?.variants?.edges?.[0]?.node?.id) {
      variantId = product.variants.edges[0].node.id;
    }
    if (!variantId && product?.variants?.nodes?.[0]?.id) {
      variantId = product.variants.nodes[0].id;
    }
    if (!variantId && product?.variants?.[0]?.id) {
      variantId = product.variants[0].id;
    }
    
    if (!variantId) {
      alert("No variant available");
      return;
    }

    const customerShopifyId = localStorage.getItem("customerShopifyId");
    const cleanVariantId = variantId.includes("gid://") ? variantId.split("/").pop() : variantId;

    setLoading(true);

    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Cart-Id": localStorage.getItem("cartId") || "",
        },
        body: JSON.stringify({
          variantId: cleanVariantId,
          quantity: 1,
          customerShopifyId: customerShopifyId || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Add to cart failed");
      }

      if (data.cart?.id) {
        localStorage.setItem("guestCartId", data.cart.id);
        localStorage.setItem("cartId", data.cart.id);
      }

      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(new Event("open-cart-drawer"));
    } catch (err) {
      console.error("Add to cart error:", err);
      alert(`Failed to add: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const displayRating = reviewCount === 0 ? 5 : averageRating;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= Math.round(displayRating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltG3bA8w1j3aR9a7iT7nT3jX0l5x4v//Z";

  return (
    <div 
      className="group cursor-pointer relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
      onClick={() => router.push(`/product/${product?.handle}`)}
    >
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-3 right-3 z-20 bg-gradient-to-br from-red-500 to-pink-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
          {discountPercent}% OFF
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {hasValidImage ? (
          <Image
            src={imageUrl}
            alt={product?.title || "Product image"}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized={true}
            priority={false}
            placeholder="blur"
            blurDataURL={blurDataURL}
            onError={(e) => {
              console.error("Image load failed:", imageUrl);
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-center px-4">
            <span className="text-gray-500 text-xs font-medium">No Image</span>
            <span className="text-gray-400 text-[10px] mt-1 line-clamp-2">{product?.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Info */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Vendor */}
        {product?.vendor && (
          <p className="text-slate-500 text-xs mb-1 uppercase tracking-wide">{product.vendor}</p>
        )}

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-2">
          {renderStars()}
          {reviewCount > 0 && (
            <span className="text-xs text-slate-600">
              {averageRating.toFixed(1)} ({reviewCount})
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem]">
          {product?.title || "Untitled Product"}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-3">
          {price > 0 ? (
            <>
              <span className="text-xs text-slate-500">Rs.</span>
              <span className="text-lg font-bold text-blue-600">{price.toLocaleString("en-IN")}</span>
              {hasDiscount && (
                <span className="text-sm text-slate-400 line-through">
                  {compareAt.toLocaleString("en-IN")}
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-slate-500 italic">Price not available</span>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/product/${product?.handle}`);
            }}
            className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Info className="w-3 h-3" />
            Details
          </button>

          <button
            onClick={handleAddToCart}
            disabled={loading}
            className={`border-2 border-blue-600 text-blue-600 px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ShoppingCart className="w-3 h-3" />
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Recently Viewed Component
export default function RecentlyViewedProducts() {
  const [products, setProducts] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  // Track window width for custom breakpoints
  useEffect(() => {
    setMounted(true);
    
    // Set initial width
    setWindowWidth(window.innerWidth);
    
    // Handle resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function load() {
      const ids = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      if (!ids.length) return;

      const allProducts = await getAllProducts(100);

      const viewedProducts = ids
        .map((id) => allProducts.find((p) => p.id === id))
        .filter(Boolean);

      setProducts(viewedProducts);
      
      // Debug logging
      console.log("=== RECENTLY VIEWED DEBUG ===");
      console.log("Recently viewed IDs:", ids);
      console.log("Found products:", viewedProducts.length);
      if (viewedProducts.length > 0) {
        console.log("First product:", viewedProducts[0]);
      }
      console.log("============================");
    }

    if (mounted) {
      load();
    }
  }, [mounted]);

  if (!products.length || !mounted) return null;

  // Custom breakpoint logic using if statements
  let slidesToShow = 4; // Default for desktop
  let showArrows = true;
  let showDots = true;
  let infinite = products.length > 4;

  if (windowWidth < 480) {
    // Mobile portrait
    slidesToShow = 1;
    showArrows = false;
    showDots = true;
    infinite = products.length > 1;
  } else if (windowWidth >= 480 && windowWidth < 768) {
    // Mobile landscape
    slidesToShow = 2;
    showArrows = false;
    showDots = true;
    infinite = products.length > 2;
  } else if (windowWidth >= 768 && windowWidth < 1024) {
    // Tablet
    slidesToShow = 3;
    showArrows = true;
    showDots = true;
    infinite = products.length > 3;
  } else if (windowWidth >= 1024) {
    // Desktop
    slidesToShow = 4;
    showArrows = true;
    showDots = true;
    infinite = products.length > 4;
  }

  // Ensure we don't show more slides than products
  slidesToShow = Math.min(slidesToShow, products.length);

  const settings = {
    dots: showDots,
    arrows: showArrows,
    infinite: infinite,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    nextArrow: showArrows ? <SampleNextArrow /> : null,
    prevArrow: showArrows ? <SamplePrevArrow /> : null,
    variableWidth: false, // Ensure consistent width
    adaptiveHeight: false, // Prevent height adaptation
    centerMode: false, // Disable center mode
  };

  return (
    <section className="mt-12 relative bg-gradient-to-br from-blue-50 to-sky-50 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
          Recently Viewed
        </h2>
        
        <div className="relative px-4 md:px-12">
          {/* Wrapper with max-width to constrain card sizes */}
          <div className="max-w-[1400px] mx-auto">
            <Slider {...settings} key={windowWidth}>
              {products.map((product, index) => (
                <div key={product.id || index} className="px-2">
                  <div className="max-w-[350px] mx-auto">
                    <SliderProductCard product={product} />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Debug info - remove in production */}
        {/* <div className="text-center mt-4 text-sm text-gray-600">
          Window Width: {windowWidth}px | Slides: {slidesToShow} | Arrows: {showArrows ? 'Yes' : 'No'}
        </div> */}
      </div>
    </section>
  );
}

// Custom Arrow Components
function SampleNextArrow({ onClick }) {
  return (
    <button
      className="absolute top-1/2 right-[-60px] transform -translate-y-1/2 z-30 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer"
      onClick={onClick}
      aria-label="Next slide"
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

function SamplePrevArrow({ onClick }) {
  return (
    <button
      className="absolute top-1/2 left-[-60px] transform -translate-y-1/2 z-30 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer"
      onClick={onClick}
      aria-label="Previous slide"
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}