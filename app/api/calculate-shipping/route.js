export async function POST(req) {
  try {
    const body = await req.json();
    const { email, shippingAddress, lineItems } = body;

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

    // Check for errors
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

    let responseData = {
      success: true,
      tax: calcResult.totalTaxSet,
      subtotal: calcResult.subtotalPriceSet,
      total: calcResult.totalPriceSet,
      allShippingRates: calcResult.availableShippingRates || [],
    };

    if (!calcResult.availableShippingRates?.length) {
      console.error("No rates - Address:", JSON.stringify({
        countryCode: "IN",
        provinceCode: shippingAddress.provinceCode,
        zip: shippingAddress.zip,
        city: shippingAddress.city
      }));

      // Fallback to a custom flat rate (e.g., $15 USD; adjust as needed)
      const fallbackRate = {
        title: "Standard Shipping (Fallback)",
        handle: "fallback",
        price: { amount: "15.00", currencyCode: "USD" }
      };

      responseData.allShippingRates = [fallbackRate];
      responseData.shipping = fallbackRate;

      // Manually recalculate total with fallback shipping (assuming USD; match your store currency)
      const subtotalAmount = parseFloat(responseData.subtotal.shopMoney.amount);
      const taxAmount = parseFloat(responseData.tax.shopMoney.amount);
      const fallbackAmount = parseFloat(fallbackRate.price.amount);
      const newTotal = (subtotalAmount + fallbackAmount + taxAmount).toFixed(2);

      responseData.total = {
        shopMoney: {
          amount: newTotal,
          currencyCode: responseData.total.shopMoney.currencyCode
        }
      };

      // Update shipping total in response (though not directly used, for consistency)
      responseData.shippingTotal = fallbackRate.price;
    } else {
      const selectedRate = calcResult.availableShippingRates[0];
      responseData.shipping = selectedRate;
    }

    return Response.json(responseData, { status: 200 });
  } catch (error) {
    console.error("CALCULATION ERROR:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}