// // app/api/address/create/route.js

// import { NextResponse } from "next/server";

// export async function POST(request) {
//   const { customerId, address } = await request.json();

//   // Basic validation
//   if (!customerId || !address) {
//     return NextResponse.json(
//       { success: false, message: "Missing customerId or address" },
//       { status: 400 }
//     );
//   }

//   try {
//     const response = await fetch(
//       `${process.env.SHOPIFY_ADMIN_API_BASE_URL}/2025-04/customers/${customerId}/addresses.json`,
//       {
//         method: "POST",
//         headers: {
//           "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           address: {
//             ...address,
//             default: address.default || false, // set as default if checked
//           },
//         }),
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.errors?.[0]?.message || "Failed to create address");
//     }

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("Create address error:", err);
//     return NextResponse.json(
//       { success: false, message: err.message },
//       { status: 500 }
//     );
//   }
// }








// app/api/address/create/route.js

import { NextResponse } from "next/server";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (parseErr) {
    console.error("JSON parse error:", parseErr);
    return NextResponse.json(
      { success: false, message: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  const { customerShopifyId, address } = body;

  // Log the incoming body for debugging (remove in prod)
  console.log("Incoming request body:", JSON.stringify(body, null, 2));

  // Enhanced validation
  if (!customerShopifyId || typeof customerShopifyId !== 'number' || customerShopifyId <= 0) {
    return NextResponse.json(
      { 
        success: false, 
        message: "Invalid or missing customerShopifyId (must be a positive number)",
        receivedBody: body // Temp: for debugging; remove later
      },
      { status: 400 }
    );
  }

  if (!address || typeof address !== 'object' || Object.keys(address).length === 0) {
    return NextResponse.json(
      { 
        success: false, 
        message: "Invalid or missing address object",
        receivedBody: body // Temp: for debugging; remove later
      },
      { status: 400 }
    );
  }

  // Validate required address fields for Shopify (add more as needed)
  const requiredAddressFields = ['address1', 'city', 'country'];
  const missingFields = requiredAddressFields.filter(field => !address[field] || address[field].toString().trim() === '');
  if (missingFields.length > 0) {
    return NextResponse.json(
      { 
        success: false, 
        message: `Missing required address fields: ${missingFields.join(', ')}`,
        receivedBody: body // Temp: for debugging; remove later
      },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.SHOPIFY_ADMIN_API_BASE_URL}/2025-04/customers/${customerShopifyId}/addresses.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: {
            ...address,
            default: address.default || false, // set as default if checked
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Shopify API error response:", data);
      throw new Error(data.errors?.[0]?.message || `Shopify error: ${response.status} ${response.statusText}`);
    }

    return NextResponse.json({ 
      success: true, 
      data: data.address // Optional: Return the created address for confirmation
    });
  } catch (err) {
    console.error("Create address error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}