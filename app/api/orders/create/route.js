export async function POST(req) {
  try {
    const body = await req.json();
    const { email, shippingAddress, lineItems, paymentMethod } = body;

    const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
    const SHOPIFY_STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

    if (!SHOPIFY_ACCESS_TOKEN || !SHOPIFY_STORE) {
      return Response.json(
        { success: false, error: "Shopify credentials not set" },
        { status: 500 }
      );
    }

    // Address validation (India-specific example; extend as needed)
    if (shippingAddress.countryCode === "IN") {
      if (!/^\d{6}$/.test(shippingAddress.zip)) {
        return Response.json(
          { success: false, error: "Invalid Indian ZIP code (must be 6 digits)" },
          { status: 400 }
        );
      }
      if (!shippingAddress.provinceCode || shippingAddress.provinceCode.length < 2) {
        return Response.json(
          { success: false, error: "Invalid province code for India" },
          { status: 400 }
        );
      }
    }

    const gqlLineItems = lineItems.map((item) => ({
      variantId: item.variant_id.startsWith("gid://")
        ? item.variant_id
        : `gid://shopify/ProductVariant/${item.variant_id}`,
      quantity: Number(item.quantity),
      requiresShipping: true,
    }));

    const calculateRes = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/2025-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation CalculateShipping($input: DraftOrderInput!) {
              draftOrderCalculate(input: $input) {
                calculatedDraftOrder {
                  availableShippingRates {
                    title
                    handle
                    price {
                      amount
                      currencyCode
                    }
                  }
                  totalShippingPriceSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  totalTaxSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  subtotalPriceSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  totalPriceSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `,
          variables: {
            input: {
              email,
              lineItems: gqlLineItems,
              shippingAddress: {
                firstName: shippingAddress.firstName,
                lastName: shippingAddress.lastName,
                address1: shippingAddress.address1,
                city: shippingAddress.city,
                provinceCode: shippingAddress.provinceCode,
                countryCode: "IN",
                zip: shippingAddress.zip,
              },
              taxExempt: false,
            },
          },
        }),
      }
    );

    const calcData = await calculateRes.json();
    console.log("CALCULATION DATA:", JSON.stringify(calcData, null, 2));

    // Check for GraphQL errors
    if (calcData.errors) {
      console.error("GraphQL errors:", calcData.errors);
      return Response.json(
        { success: false, error: "Failed to calculate shipping" },
        { status: 400 }
      );
    }

    const calcResult = calcData.data?.draftOrderCalculate?.calculatedDraftOrder;

    if (calcData.data?.draftOrderCalculate?.userErrors?.length > 0) {
      console.error("User errors:", calcData.data.draftOrderCalculate.userErrors);
      return Response.json(
        { 
          success: false, 
          error: calcData.data.draftOrderCalculate.userErrors[0].message 
        },
        { status: 400 }
      );
    }

    if (!calcResult) {
      return Response.json(
        { success: false, error: "Failed to calculate draft order" },
        { status: 400 }
      );
    }

    // Handle shipping rates with fallback
    let selectedRate;
    let allShippingRates = calcResult.availableShippingRates || [];
    let isFallback = false;

    if (!allShippingRates.length) {
      console.error("No rates available - Address:", JSON.stringify({
        countryCode: "IN",
        provinceCode: shippingAddress.provinceCode,
        zip: shippingAddress.zip,
        city: shippingAddress.city
      }));

      // Fallback to a custom flat rate (e.g., 15.00 USD; adjust currency/amount for your store, e.g., "1200.00" for INR)
      selectedRate = {
        title: "Standard Shipping (Fallback)",
        handle: "fallback",
        price: { amount: "15.00", currencyCode: "USD" }
      };
      allShippingRates = [selectedRate];
      isFallback = true;
    } else {
      selectedRate = allShippingRates[0];
    }

    // Manually adjust totals if fallback (since calculate didn't include shipping)
    let adjustedTax = calcResult.totalTaxSet;
    let adjustedSubtotal = calcResult.subtotalPriceSet;
    let adjustedTotal = calcResult.totalPriceSet;

    if (isFallback) {
      const subtotalAmount = parseFloat(adjustedSubtotal.shopMoney.amount);
      const taxAmount = parseFloat(adjustedTax.shopMoney.amount);
      const shippingAmount = parseFloat(selectedRate.price.amount);
      const newTotalAmount = (subtotalAmount + taxAmount + shippingAmount).toFixed(2);

      adjustedTotal = {
        shopMoney: {
          amount: newTotalAmount,
          currencyCode: adjustedTotal.shopMoney.currencyCode
        }
      };
    }

    // ------------------------------------------------
    // STEP 2: CREATE DRAFT ORDER (REST API)
    // ------------------------------------------------
    const draftOrderRes = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/2024-10/draft_orders.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          draft_order: {
            email,
            line_items: lineItems.map((item) => ({
              variant_id: Number(
                item.variant_id.replace("gid://shopify/ProductVariant/", "")
              ),
              quantity: Number(item.quantity),
            })),
            shipping_address: {
              first_name: shippingAddress.firstName,
              last_name: shippingAddress.lastName,
              address1: shippingAddress.address1,
              city: shippingAddress.city,
              province: shippingAddress.provinceCode,
              country: "IN",
              zip: shippingAddress.zip,
            },
            shipping_line: {
              title: selectedRate.title,
              price: selectedRate.price.amount,
              handle: selectedRate.handle || null, // Null for fallback
            },
            tax_exempt: false,
            ...(paymentMethod && { payment_gateway: paymentMethod }), // Optional: Use if paymentMethod is a gateway name
          },
        }),
      }
    );

    const draftOrderData = await draftOrderRes.json();

    if (!draftOrderRes.ok) {
      console.error("Draft order creation failed:", draftOrderData);
      return Response.json(
        { success: false, error: draftOrderData.errors?.[0]?.message || "Failed to create draft order" },
        { status: 400 }
      );
    }

    const draftOrderId = draftOrderData.draft_order.id;

    // ------------------------------------------------
    // STEP 3: COMPLETE DRAFT ORDER (GraphQL)
    // ------------------------------------------------
    const completeRes = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/2025-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query: `
            mutation draftOrderComplete($id: ID!) {
              draftOrderComplete(id: $id, paymentPending: true) {
                draftOrder {
                  id
                  order {
                    id
                    name
                    processedAt
                  }
                }
                userErrors {  
                  field
                  message
                }
              }
            }
          `,
          variables: {
            id: `gid://shopify/DraftOrder/${draftOrderId}`,
          },
        }),
      }
    );

    const orderData = await completeRes.json();

    // Safety check
    if (orderData.errors || orderData.data?.draftOrderComplete?.userErrors?.length > 0) {
      console.error("Draft order completion failed:", orderData);
      // Optionally, delete the incomplete draft
      await fetch(
        `https://${SHOPIFY_STORE}/admin/api/2024-10/draft_orders/${draftOrderId}.json`,
        { method: "DELETE", headers: { "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN } }
      );
      return Response.json(
        { 
          success: false, 
          error: orderData.errors?.[0]?.message || orderData.data?.draftOrderComplete?.userErrors?.[0]?.message || "Draft order completion failed" 
        },
        { status: 400 }
      );
    }

    const completedOrder = orderData.data?.draftOrderComplete?.order;

    return Response.json(
      {
        success: true,
        order: completedOrder || orderData,
        orderId: completedOrder?.id,
        orderName: completedOrder?.name,
        shipping: selectedRate,
        tax: adjustedTax,
        subtotal: adjustedSubtotal,
        total: adjustedTotal,
        allShippingRates,
        isFallbackShipping: isFallback,
        paymentMethod, // Echo back for frontend
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}