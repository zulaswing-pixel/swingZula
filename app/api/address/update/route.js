// app/api/address/update/route.js

export async function PUT(request) {
  const body = await request.json();

  const customerId = body.customerId || body.customerShopifyId;
  const { addressId, address } = body;

  const cid = Number(customerId);
  const aid = Number(addressId);

  if (!cid || !aid || !address) {
    return Response.json(
      { success: false, message: "Missing or invalid required fields" },
      { status: 400 }
    );
  }

  try {
    // 1️⃣ UPDATE ADDRESS
    const shopifyResponse = await fetch(
      `${process.env.SHOPIFY_ADMIN_API_BASE_URL}/2025-04/customers/${cid}/addresses/${aid}.json`,
      {
        method: "PUT",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: {
            address1: address.address1 ?? "",
            address2: address.address2 ?? null,
            city: address.city ?? "",
            province: address.province ?? "",
            zip: address.zip ?? "",
            country: address.country ?? "India",
            phone: address.phone ?? null,
          },
        }),
      }
    );

    const data = await shopifyResponse.json();

    if (!shopifyResponse.ok) {
      console.error("Shopify Error:", data);
      return Response.json(
        {
          success: false,
          message:
            data.errors?.address?.[0] ||
            data.errors ||
            "Failed to update address",
        },
        { status: 400 }
      );
    }

    // 2️⃣ SET DEFAULT ADDRESS
    if (address.default === true) {
      await fetch(
        `${process.env.SHOPIFY_ADMIN_API_BASE_URL}/2025-04/customers/${cid}/addresses/${aid}/default.json`,
        {
          method: "PUT",
          headers: {
            "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN,
          },
        }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Server Error:", err);
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
