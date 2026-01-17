import connectDB from "@/lib/mongodb";
import UserCart from "@/lib/models/UserCart";
import {
  getCartById,
  createCart,
  updateCartLine,
  removeCartLine,
  addToCartServer,
} from "@/lib/shopify";
import { NextResponse } from "next/server";

/**
 * Normalize to full Shopify Cart GID
 */
function normalizeCartId(cartId) {
  if (!cartId) return null;
  return cartId.startsWith("gid://")
    ? cartId
    : `gid://shopify/Cart/${cartId}`;
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      action,
      customerShopifyId,
      customerAccessToken,
      localCartId, // 👈 cartId from localStorage
    } = body;

    /* -------------------- RECOVER CART -------------------- */
    if (action === "recover") {
      const { abandonedCartId } = body;

      if (!abandonedCartId) {
        return NextResponse.json(
          { error: "abandonedCartId required" },
          { status: 400 }
        );
      }

      const cartId = normalizeCartId(abandonedCartId);
      let cart = await getCartById(cartId);

      if (!cart) {
        cart = await createCart(customerAccessToken);
      }

      if (customerShopifyId && cart?.id) {
        await UserCart.updateOne(
          { customerId: customerShopifyId },
          { $set: { cartId: cart.id } },
          { upsert: true }
        );
      }

      return NextResponse.json({ success: true, cart });
    }

    /* -------------------- UPDATE LINE -------------------- */
    if (action === "updateLine") {
      const { cartId, lineId, quantity } = body;

      if (!cartId || !lineId || quantity == null) {
        return NextResponse.json(
          { error: "cartId, lineId & quantity required" },
          { status: 400 }
        );
      }

      const cart = await updateCartLine(
        normalizeCartId(cartId),
        lineId,
        quantity
      );

      return NextResponse.json({ success: true, cart });
    }

    /* -------------------- REMOVE LINE -------------------- */
    if (action === "removeLine") {
      const { cartId, lineId } = body;

      if (!cartId || !lineId) {
        return NextResponse.json(
          { error: "cartId & lineId required" },
          { status: 400 }
        );
      }

      const cart = await removeCartLine(
        normalizeCartId(cartId),
        lineId
      );

      return NextResponse.json({ success: true, cart });
    }

    /* -------------------- ADD LINE -------------------- */
    if (action === "addLine") {
      const { cartId, variantId, quantity } = body;

      if (!cartId || !variantId || quantity == null) {
        return NextResponse.json(
          { error: "cartId, variantId & quantity required" },
          { status: 400 }
        );
      }

      const cart = await addToCartServer(
        variantId,
        quantity,
        normalizeCartId(cartId)
      );

      return NextResponse.json({ success: true, cart });
    }

    /* -------------------- DEFAULT: GET / CREATE CART -------------------- */
    if (!customerShopifyId) {
      return NextResponse.json(
        { error: "customerShopifyId required" },
        { status: 400 }
      );
    }

    let cart = null;
    let cartId = null;

    /* ---------- 1️⃣ TRY LOCAL STORAGE CART ---------- */
    cartId = normalizeCartId(localCartId);

    if (cartId) {
      cart = await getCartById(cartId);

      if (cart) {
        await UserCart.updateOne(
          { customerId: customerShopifyId },
          { $set: { cartId } },
          { upsert: true }
        );

        return NextResponse.json({
          success: true,
          cart,
          checkoutUrl: cart.checkoutUrl,
          totalQuantity: cart.totalQuantity,
          source: "localStorage",
        });
      }
    }

    /* ---------- 2️⃣ TRY MONGODB CART ---------- */
    const userCart = await UserCart.findOne({
      customerId: customerShopifyId,
    });

    cartId = normalizeCartId(userCart?.cartId);

    if (cartId) {
      cart = await getCartById(cartId);

      if (cart) {
        return NextResponse.json({
          success: true,
          cart,
          checkoutUrl: cart.checkoutUrl,
          totalQuantity: cart.totalQuantity,
          source: "mongodb",
        });
      }
    }

    /* ---------- 3️⃣ CREATE NEW CART ---------- */
    cart = await createCart(customerAccessToken);

    await UserCart.updateOne(
      { customerId: customerShopifyId },
      { $set: { cartId: cart.id } },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      cart,
      checkoutUrl: cart.checkoutUrl,
      totalQuantity: cart.totalQuantity,
      source: "new",
    });

  } catch (error) {
    console.error("CART API ERROR:", error);

    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 }
    );
  }
}
