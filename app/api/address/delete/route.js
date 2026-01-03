// app/api/address/delete/route.js

export async function DELETE(request) {
  const body = await request.json();

  const customerId = body.customerId || body.customerShopifyId;
  const { addressId } = body;

  const cid = Number(customerId);
  const aid = Number(addressId);

  if (!cid || !aid) {
    return Response.json(
      { success: false, message: "Missing customerId or addressId" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.SHOPIFY_ADMIN_API_BASE_URL}/2025-04/customers/${cid}/addresses/${aid}.json`,
      {
        method: "DELETE",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Shopify Delete Error:", errorData);
      throw new Error(
        errorData.errors?.address?.[0] ||
          errorData.errors ||
          "Failed to delete address"
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
