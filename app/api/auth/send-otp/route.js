// // app/api/auth/send-otp/route.js
// export async function POST(request) {
//   const body = await request.json();
//   console.log("Received OTP request:", { ...body , storename: "hit-megascale.myshopify.com" });
//   const res = await fetch(`${process.env.NEXT_PUBLIC_OTP_API_BASE_URL}/annapurnakhakhra/send-otp`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ ...body , storeName: "hit-megascale.myshopify.com" }),
//   });
  
//   const data = await res.json();
//   return Response.json(data);
// }




// app/api/auth/send-otp/route.js

export async function POST(request) {
  try {
    const body = await request.json();

    // Log for debugging
    console.log("Received OTP request:", body);

    const otpApiUrl = `${process.env.NEXT_PUBLIC_OTP_API_BASE_URL}/swingzulla/send-otp`;

    if (!process.env.NEXT_PUBLIC_OTP_API_BASE_URL) {
      console.error("NEXT_PUBLIC_OTP_API_BASE_URL is not defined in env");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500 }
      );
    }

    const response = await fetch(otpApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: body.phone,
        storeName: "swing-9926.myshopify.com", // Hardcoded as per your cURL
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OTP API error:", data);
      return new Response(JSON.stringify(data || { error: "Failed to send OTP" }), {
        status: response.status,
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-otp API:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}