"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart, Info, Eye, X } from "lucide-react";

export default function ProductCard({ product: initialProduct }) {
  const [product, setProduct] = useState(initialProduct);
  const [loadingProduct, setLoadingProduct] = useState(!initialProduct);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const router = useRouter();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false); // NEW STATE
  const [customerShopifyId, setCustomerShopifyId] = useState(null);

  // Fetch product from your custom API if no full product data is provided
  useEffect(() => {
    const fetchProduct = async () => {
      if (initialProduct && (initialProduct.title || initialProduct.images)) {
        // Already have sufficient product data
        setProduct(initialProduct);
        setLoadingProduct(false);
        return;
      }

      // Use handle or id if available to fetch full product
      const handle = initialProduct?.handle;
      const id = initialProduct?.id;

      if (!handle && !id) {
        console.error("ProductCard: No product data, handle, or id provided");
        setLoadingProduct(false);
        return;
      }

      try {
        setLoadingProduct(true);
        const res = await fetch(`https://adminrocket.megascale.co.in/api/products${handle ? `?handle=${handle}` : `?id=${id}`}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        // Assuming the API returns an array or single object — adjust based on actual response
        const fetchedProduct = Array.isArray(data) ? data[0] : data;
        setProduct(fetchedProduct);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [initialProduct]);

  if (loadingProduct) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 animate-pulse">
        <div className="aspect-square bg-slate-200"></div>
        <div className="p-3 sm:p-4 md:p-5 space-y-3">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="h-8 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null; // Or a "Product not found" placeholder
  }

  // Robust image URL extraction
  let imageUrl = null;
  if (product?.featuredImage?.url) {
    imageUrl = product.featuredImage.url;
  } else if (product?.images?.edges?.length > 0) {
    imageUrl = product.images.edges[0].node.url;
  } else if (product?.images?.nodes?.length > 0) {
    imageUrl = product.images.nodes[0].url;
  } else if (Array.isArray(product?.images) && product.images.length > 0) {
    imageUrl = typeof product.images[0] === "string" ? product.images[0] : product.images[0].url;
  }

  const hasValidImage = imageUrl && typeof imageUrl === "string" && imageUrl.startsWith("http");

  // Reviews fetch
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?.id) return;
      try {
        const res = await fetch(`/api/reviews/list?productId=${encodeURIComponent(product.id)}`);
        if (!res.ok) throw new Error('Reviews fetch failed');
        const data = await res.json();
        const reviewList = data.reviews || [];
        setReviewCount(reviewList.length);
        const avg = reviewList.length > 0 ? reviewList.reduce((acc, r) => acc + r.rating, 0) / reviewList.length : 0;
        setAverageRating(avg);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };

    fetchReviews();
  }, [product?.id]);

  // IMPROVED: Get variant ID with multiple fallback options
  const getVariantId = () => {
    // Try all possible locations for variant ID
    if (product.variantId) return product.variantId;
    if (product.variants?.edges?.[0]?.node?.id) return product.variants.edges[0].node.id;
    if (product.variants?.nodes?.[0]?.id) return product.variants.nodes[0].id;
    if (product.variants?.[0]?.id) return product.variants[0].id;
    // Last resort: use product ID if available
    if (product.id) return product.id;
    return null;
  };

  // IMPROVED: Add to Cart handler with better error handling and logging
  // const handleAddToCart = async (e) => {
  //   // Allow clicking from modal without card interference if needed
  //   if(e) e.stopPropagation(); 

  //   const customerShopifyId = localStorage.getItem("customerShopifyId");
  //   if (!customerShopifyId) {
  //     setShowLoginPopup(true);
  //     return;
  //   }

  //   const variantId = getVariantId();
  //   if (!variantId) {
  //     console.error("No variant ID found. Product data:", product);
  //     alert("No variant available—please check product data");
  //     return;
  //   }

  //   const cleanVariantId = variantId.includes("gid://") ? variantId.split("/").pop() : variantId;

  //   console.log("Adding to cart:", {
  //     variantId: cleanVariantId,
  //     productTitle: product.title,
  //     customerShopifyId
  //   });

  //   setLoading(true);
  //   try {
  //     const cartId = localStorage.getItem("cartId") || localStorage.getItem("guestCartId") || "";
  //     const res = await fetch("/api/cart/add", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "X-Cart-Id": cartId,
  //       },
  //       body: JSON.stringify({
  //         variantId: cleanVariantId,
  //         quantity: 1,
  //         customerShopifyId: customerShopifyId || null,
  //       }),
  //     });

  //     const data = await res.json();
  //     console.log("Add to cart response:", data);

  //     if (!res.ok || !data?.success) {
  //       throw new Error(data?.error || data?.message || "Add to cart failed—check Shopify creds");
  //     }

  //     // Store cart ID
  //     if (data.cart?.id) {
  //       localStorage.setItem("guestCartId", data.cart.id);
  //       localStorage.setItem("cartId", data.cart.id);
  //     }

  //     // Dispatch events
  //     window.dispatchEvent(new Event("cart-updated"));
  //     window.dispatchEvent(new Event("open-cart-drawer"));

  //     // Close quick view if open
  //     setShowQuickView(false);

  //     console.log("Successfully added to cart");
  //   } catch (err) {
  //     console.error("Add to cart error:", err);
  //     alert(`Failed to add: ${err.message}. Verify Shopify API token in .env.local.`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // IMPROVED: Add to Cart handler with GUEST support
const handleAddToCart = async (e) => {
  if (e) e.stopPropagation(); // Prevent card click navigation

  const variantId = getVariantId();
  if (!variantId) {
    console.error("No variant ID found. Product data:", product);
    alert("No variant available—please check product data");
    return;
  }

  const cleanVariantId = variantId.includes("gid://") ? variantId.split("/").pop() : variantId;

  // Get customer ID (may be null for guests)
  const customerShopifyId = localStorage.getItem("customerShopifyId") || null;

  // Get existing cart ID (guest or logged-in)
  let cartId = localStorage.getItem("cartId") || localStorage.getItem("guestCartId") || "";

  console.log("Adding to cart:", {
    variantId: cleanVariantId,
    productTitle: product.title,
    customerShopifyId: customerShopifyId || "GUEST",
    existingCartId: cartId || "NEW",
  });

  setLoading(true);

  try {
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Cart-Id": cartId, // Send existing cart ID if any
      },
      body: JSON.stringify({
        variantId: cleanVariantId,
        quantity: 1,
        customerShopifyId: customerShopifyId || null, // null for guest
      }),
    });

    const data = await res.json();
    console.log("Add to cart response:", data);

    if (!res.ok || !data?.success) {
      throw new Error(data?.error || data?.message || "Add to cart failed");
    }

    // IMPORTANT: Update localStorage with the latest cart ID
    if (data.cart?.id) {
      const newCartId = data.cart.id;

      // Store in both keys so it works for guest & logged-in
      localStorage.setItem("guestCartId", newCartId);
      localStorage.setItem("cartId", newCartId);
    }

    // Dispatch events to update UI (cart count, open drawer)
    window.dispatchEvent(new Event("cart-updated"));
    window.dispatchEvent(new Event("open-cart-drawer"));

    // Close quick view if open
    setShowQuickView(false);

    console.log("✅ Successfully added to cart (guest or logged-in)");
  } catch (err) {
    console.error("Add to cart error:", err);
    alert(`Failed to add: ${err.message}. Please try again.`);
  } finally {
    setLoading(false);
  }
};
 

  // IMPROVED PRICE HANDLING - Multiple fallback options
  const getPriceData = () => {
    let priceAmount = 0;
    let compareAtAmount = 0;

    // Option 1: priceRangeV2 (Shopify Storefront API format)
    if (product?.priceRangeV2?.minVariantPrice?.amount) {
      priceAmount = product.priceRangeV2.minVariantPrice.amount;
      if (product.compareAtPriceRange?.minVariantPrice?.amount) {
        compareAtAmount = product.compareAtPriceRange.minVariantPrice.amount;
      }
    }
    // Option 2: priceRange (alternative Shopify format)
    else if (product?.priceRange?.minVariantPrice?.amount) {
      priceAmount = product.priceRange.minVariantPrice.amount;
      if (product.compareAtPriceRange?.minVariantPrice?.amount) {
        compareAtAmount = product.compareAtPriceRange.minVariantPrice.amount;
      }
    }
    // Option 3: Direct price object
    else if (product?.price?.amount) {
      priceAmount = product.price.amount;
      compareAtAmount = product.compareAtPrice?.amount || 0;
    }
    // Option 4: Price as direct property
    else if (product?.price) {
      priceAmount = product.price;
      compareAtAmount = product.compareAtPrice || 0;
    }
    // Option 5: Variants array (edges format)
    else if (product?.variants?.edges?.[0]?.node?.price?.amount) {
      priceAmount = product.variants.edges[0].node.price.amount;
      compareAtAmount = product.variants.edges[0].node.compareAtPrice?.amount || 0;
    }
    // Option 6: Variants array (nodes format)
    else if (product?.variants?.nodes?.[0]?.price?.amount) {
      priceAmount = product.variants.nodes[0].price.amount;
      compareAtAmount = product.variants.nodes[0].compareAtPrice?.amount || 0;
    }
    // Option 7: Variants array (direct array with object)
    else if (product?.variants?.[0]?.price?.amount) {
      priceAmount = product.variants[0].price.amount;
      compareAtAmount = product.variants[0].compareAtPrice?.amount || 0;
    }
    // Option 8: Variants array (direct array with number)
    else if (product?.variants?.[0]?.price) {
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

  const renderStars = () => {
    const displayRating = reviewCount === 0 ? 5 : averageRating;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ${star <= displayRating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-slate-200 text-slate-200"
              }`}
          />
        ))}
      </div>
    );
  };

  const shortDescription = product?.description
    ? product.description.replace(/<[^>]*>/g, "").substring(0, 100) + "..."
    : "";

  const fullDescription = product?.description
    ? product.description.replace(/<[^>]*>/g, "")
    : "No description available.";

  const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltG3bA8w1j3aR9a7iT7nT3jX0l5x4v//Z";

  const variantId = getVariantId();

  return (
    <>
      <div
        className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full w-full max-w-sm mx-auto group relative"
        onClick={() => router.push(`/product/${product?.handle}`)}
      >
        {/* Image Container with Discount Badge */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg animate-pulse">
              {discountPercent}% OFF
            </div>
          )}

          {hasValidImage ? (
            <Image
              src={imageUrl}
              alt={product?.title || "Product"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              placeholder="blur"
              blurDataURL={blurDataURL}
              onError={(e) => {
                console.error("Image load failed:", imageUrl);
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
              <div className="text-center px-4">
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2">📦</div>
                <p className="text-xs sm:text-sm">No Image</p>
                <p className="text-xs mt-1 opacity-60 line-clamp-2">{product?.title}</p>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-grow">
          {/* Vendor Badge */}
          {product?.vendor && (
            <div className="mb-2">
              <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md font-medium">
                {product.vendor}
              </span>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            {renderStars()}
            {reviewCount > 0 && (
              <span className="text-xs sm:text-sm text-slate-600 ml-1">
                {averageRating.toFixed(1)} ({reviewCount})
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm sm:text-base md:text-lg text-slate-800 mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
            {product?.title || "Untitled Product"}
          </h3>

          {/* Description */}
          {shortDescription && (
            <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4 line-clamp-2 flex-grow">
              {shortDescription}
            </p>
          )}

          {/* Price Section */}
          <div className="mb-3 sm:mb-4">
            {price > 0 ? (
              <>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                    ₹ {price.toLocaleString("en-IN")}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-xs sm:text-sm text-slate-400 line-through">
                        ₹ {compareAt.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs sm:text-sm text-green-600 font-semibold">
                        Save ₹{(compareAt - price).toLocaleString("en-IN")}
                      </span>
                    </>
                  )}
                </div>
              </>
            ) : (
              <span className="text-sm sm:text-base text-slate-500 italic">Price not available</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-auto">
            {/* UPDATED: Quick View Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigating to product page
                setShowQuickView(true);
              }}
              className="bg-slate-100 text-slate-700 px-2 py-2 sm:px-3 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-200 transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Quick View</span>
              <span className="sm:hidden">View</span>
            </button>

            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="bg-blue-600 text-white px-2 py-2 sm:px-3 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer"
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">{loading ? "Adding..." : "Add to Cart"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-[#00000069] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-xs sm:max-w-sm md:max-w-md w-full mx-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-slate-900">
              Login Required
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 mb-4 sm:mb-5 md:mb-6">
              You are not logged in. Please login to add items to your cart.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="w-full sm:flex-1 px-3 py-2 sm:px-4 sm:py-2.5 border border-slate-300 rounded-lg text-xs sm:text-sm md:text-base text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  window.location.href = "/auth/login";
                }}
                className="w-full sm:flex-1 px-3 py-2 sm:px-4 sm:py-2.5 bg-black text-white rounded-lg text-xs sm:text-sm md:text-base hover:bg-slate-800 transition-colors font-medium cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowQuickView(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-slate-100 transition-colors text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Image Side */}
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-slate-100 relative">
                {hasValidImage ? (
                  <Image
                    src={imageUrl}
                    alt={product?.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <div className="text-6xl">📦</div>
                  </div>
                )}
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col">
                {product?.vendor && (
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    {product.vendor}
                  </span>
                )}

                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                  {product?.title}
                </h2>

                <div className="flex items-center gap-2 mb-4">
                  {renderStars()}
                  {reviewCount > 0 && (
                    <span className="text-sm text-slate-500">
                      ({reviewCount} reviews)
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  {price > 0 ? (
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-slate-900">
                        ₹ {price.toLocaleString("en-IN")}
                      </span>
                      {hasDiscount && (
                        <span className="text-lg text-slate-400 line-through">
                          ₹ {compareAt.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-500 italic">Price not available</span>
                  )}
                </div>

                <div className="prose prose-sm sm:prose-base text-slate-600 mb-8 overflow-y-auto max-h-40 md:max-h-60 pr-2 custom-scrollbar">
                  <p>{fullDescription}</p>
                </div>

                <div className="mt-auto flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {loading ? "Adding..." : "Add to Cart"}
                  </button>

                  <button
                    onClick={() => {
                      setShowQuickView(false);
                      router.push(`/product/${product?.handle}`);
                    }}
                    className="flex-1 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}