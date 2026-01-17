// /app/api/cart/get/route.js – Robust version (handles expiration, guests, recovery)

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserCart from "@/lib/models/UserCart";
import { getCartById, createCart } from "@/lib/shopify";

export async function POST(req) {
  try {
    const body = await req.json();
    const { customerShopifyId, cartId: providedCartId } = body;

    let cart = null;
    let effectiveCartId = providedCartId;
    let expired = false;
    let message = "";
    let createdNew = false;

    if (customerShopifyId) {
      // ── Logged-in user ──
      await connectDB();
      let userCartDoc = await UserCart.findOne({ customerId: customerShopifyId });

      effectiveCartId = userCartDoc?.cartId || providedCartId;

      if (effectiveCartId) {
        cart = await getCartById(effectiveCartId);

        // Cart gone / expired / empty → treat as invalid
        if (!cart || cart.totalQuantity === 0) {
          expired = true;
          effectiveCartId = null;
          // Optional: clear old ID from DB
          await UserCart.updateOne(
            { customerId: customerShopifyId },
            { $unset: { cartId: "" } }
          );
        }
      }

      // No valid cart → create fresh one and associate
      if (!effectiveCartId || !cart) {
        cart = await createCart(); // can add buyerIdentity later if needed
        effectiveCartId = cart.id;
        createdNew = true;

        // Save / update in Mongo
        await UserCart.findOneAndUpdate(
          { customerId: customerShopifyId },
          {
            customerId: customerShopifyId,
            cartId: effectiveCartId,
            checkoutUrl: cart.checkoutUrl,
            totalQuantity: cart.totalQuantity || 0,
            items: cart.items || [],
            updatedAt: new Date(),
          },
          { upsert: true, new: true }
        );

        message = "Created new cart for logged-in user";
      } else {
        message = "Loaded existing customer cart";
      }
    } else {
      // ── Guest ──
      if (!providedCartId) {
        // No cartId → brand new guest
        cart = await createCart();
        effectiveCartId = cart.id;
        createdNew = true;
        message = "Created new empty cart for guest";
      } else {
        // Try to load existing guest cart
        cart = await getCartById(providedCartId);

        if (!cart || cart.totalQuantity === 0) {
          expired = true;
          cart = null;
          message = "Guest cart expired or not found";
        } else {
          message = "Guest cart loaded successfully";
        }
      }
    }

    // Final normalized response
    return NextResponse.json({
      success: true,
      cart: cart ? {
        id: cart.id,
        checkoutUrl: cart.checkoutUrl,
        totalQuantity: cart.totalQuantity || 0,
        items: cart.items || [],
      } : null,
      effectiveCartId,
      expired,
      createdNew,
      message,
    });
  } catch (err) {
    console.error("[GET CART] Error:", err.message, err.stack);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to fetch cart",
        expired: true,
      },
      { status: 500 }
    );
  }
}



// Updated /app/api/cart/get/route.js
// Key Changes:
// 1. Added support for guest carts via cartId (fetch by ID if provided)
// 2. If no customerShopifyId and no cartId, create empty cart (for new guests)
// 3. For guests with cartId, if expired/empty, clear localStorage cartId (via response flag)
// 4. Response includes 'expired' flag if cart was invalid, for client to clear cartId
// 5. No MongoDB ops for guests (only for logged-in)
// 6. Uses getCartById for both (for customer, still checks Mongo first for cartId)

// import connectDB from "@/lib/mongodb";
// import UserCart from "@/lib/models/UserCart";
// import { createCart, getCartById } from "@/lib/shopify"; // Import createCart
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { customerShopifyId, cartId: providedCartId } = await req.json();
    
//     let cart = null;
//     let effectiveCartId = providedCartId;
//     let isExpired = false;
//     let message = "";

//     if (customerShopifyId) {
//       // 1. For logged-in: Try to find saved cartId in MongoDB
//       let userCart = await UserCart.findOne({ customerId: customerShopifyId });
//       effectiveCartId = userCart?.cartId || providedCartId;
      
//       if (effectiveCartId) {
//         // 2. Fetch real-time from Shopify
//         cart = await getCartById(effectiveCartId);
//         // 3. If expired/empty, clear from Mongo and mark
//         if (!cart || cart.totalQuantity === 0 || (cart.items?.length === 0 && !cart.lines?.edges?.length)) {
//           await UserCart.updateOne({ customerId: customerShopifyId }, { $unset: { cartId: "" } });
//           userCart = null;
//           effectiveCartId = null;
//           isExpired = true;
//           message = "Customer cart expired/cleared";
//         }
//       }
      
//       // 4. If still no valid cart, create & save one
//       if (!effectiveCartId) {
//         cart = await createCart({ buyerIdentity: { customer: { id: customerShopifyId } } }); // Associate with customer
//         effectiveCartId = cart.id;
//         // Upsert into MongoDB
//         await UserCart.updateOne(
//           { customerId: customerShopifyId },
//           { $set: { cartId: effectiveCartId } },
//           { upsert: true }
//         );
//         message = "New cart created for customer";
//       }
//     } else if (providedCartId) {
//       // Guest: Fetch by provided cartId
//       cart = await getCartById(providedCartId);
//       if (!cart || cart.totalQuantity === 0 || (cart.items?.length === 0 && !cart.lines?.edges?.length)) {
//         isExpired = true;
//         cart = null; // Return empty
//         message = "Guest cart expired/empty";
//       } else {
//         message = "Guest cart loaded";
//       }
//       effectiveCartId = cart?.id || null;
//     } else {
//       // No IDs: Create empty cart for new guest/session
//       cart = await createCart();
//       effectiveCartId = cart.id;
//       message = "New empty cart created";
//     }

//     // 5. Final response
//     return NextResponse.json({
//       success: true,
//       cart,
//       checkoutUrl: cart?.checkoutUrl || null,
//       totalQuantity: cart?.totalQuantity || 0,
//       expired: isExpired, // Client can clear localStorage if true and guest
//       message,
//     });
//   } catch (error) {
//     console.error("GET CART ERROR:", error);
//     return NextResponse.json(
//       { error: true, message: error.message || "Failed to load cart" },
//       { status: 500 }
//     );
//   }
// }













// import connectDB from "@/lib/mongodb";
// import UserCart from "@/lib/models/UserCart";
// import { getCartById, createCart } from "@/lib/shopify";
// import { NextResponse } from "next/server";

// function normalizeCart(cart) {
//   const items = (cart?.lines?.edges || []).map(({ node }) => {
//     const merch = node.merchandise || {};
//     const product = merch.product || {};
//     return {
//       variantId: merch.id || node.id,
//       title: merch.title || product.title || "",
//       productTitle: product.title || merch.productTitle || "",
//       quantity: node.quantity || 1,
//       price: parseFloat(merch.price?.amount || 0),
//       image: product.featuredImage?.url || product.images?.edges?.[0]?.node?.url || merch.image?.url || "",
//     };
//   });

//   return {
//     id: cart.id,
//     checkoutUrl: cart.checkoutUrl,
//     totalQuantity: cart.totalQuantity || items.reduce((s, it) => s + (it.quantity || 0), 0),
//     items,
//     raw: cart,  // Always include full raw cart with lines for drawer rendering
//   };
// }

// export async function POST(req) {
//   try {
//     const { customerShopifyId, cartId: providedCartId } = await req.json();

//     if (!customerShopifyId && !providedCartId) {
//       return NextResponse.json(
//         { error: "customerShopifyId or cartId required" },
//         { status: 400 }
//       );
//     }

//     let shopifyCart;
//     let normCart;

//     if (customerShopifyId) {
//       await connectDB();
//       // 1. Find saved cart in MongoDB
//       const userCart = await UserCart.findOne({ customerId: customerShopifyId });

//       if (!userCart?.cartId) {
//         // Create new cart for the user (empty initially)
//         shopifyCart = await createCart();

//         normCart = normalizeCart(shopifyCart);

//         // Save to MongoDB
//         await UserCart.create({
//           customerId: customerShopifyId,
//           cartId: shopifyCart.id,
//           checkoutUrl: shopifyCart.checkoutUrl,
//           totalQuantity: normCart.totalQuantity,
//           items: normCart.items,
//           updatedAt: new Date(),
//         });

//         return NextResponse.json({
//           success: true,
//           cart: normCart,
//           checkoutUrl: normCart.checkoutUrl,
//           totalQuantity: normCart.totalQuantity,
//           isNew: true,
//         });
//       }

//       const savedCartId = userCart.cartId;

//       // 2. Fetch real-time cart from Shopify (ensure full query with lines)
//       shopifyCart = await getCartById(savedCartId);

//       // 3. If Shopify cart expired / deleted or empty (recreate if needed)
//       if (!shopifyCart || !shopifyCart.lines?.edges?.length) {
//         console.log("🔄 Recreating expired/empty cart for customer:", customerShopifyId);
//         shopifyCart = await createCart();
//         normCart = normalizeCart(shopifyCart);

//         await UserCart.updateOne(
//           { customerId: customerShopifyId },
//           {
//             cartId: shopifyCart.id,
//             checkoutUrl: shopifyCart.checkoutUrl,
//             totalQuantity: normCart.totalQuantity,
//             items: normCart.items,
//             updatedAt: new Date(),
//           }
//         );
//       } else {
//         normCart = normalizeCart(shopifyCart);

//         // Update stored user cart metadata
//         await UserCart.updateOne(
//           { customerId: customerShopifyId },
//           {
//             cartId: normCart.id,
//             checkoutUrl: normCart.checkoutUrl,
//             totalQuantity: normCart.totalQuantity,
//             items: normCart.items,
//             updatedAt: new Date(),
//           }
//         );
//       }
//     } else {
//       // Guest cart - fetch by cartId
//       if (!providedCartId) {
//         return NextResponse.json(
//           { error: "cartId required for guest" },
//           { status: 400 }
//         );
//       }

//       shopifyCart = await getCartById(providedCartId);

//       // If Shopify cart expired / deleted or empty
//       if (!shopifyCart || !shopifyCart.lines?.edges?.length) {
//         return NextResponse.json({
//           cart: null,
//           expired: true,
//           message: "Cart expired or deleted on Shopify",
//         });
//       }

//       normCart = normalizeCart(shopifyCart);
//     }

//     return NextResponse.json({
//       success: true,
//       cart: normCart,
//       checkoutUrl: normCart.checkoutUrl,
//       totalQuantity: normCart.totalQuantity,
//     });

//   } catch (error) {
//     console.error("GET CART ERROR:", error);

//     return NextResponse.json(
//       { error: true, message: error.message },
//       { status: 500 }
//     );
//   }
// }