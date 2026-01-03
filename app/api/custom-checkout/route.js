export async function POST(req) {
  let bodyData; // Store body once
  try {
    bodyData = await req.json();
    const { shop, email, name, address, paymentMethod, lineItems } = bodyData;
    const ADMIN_API_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;
    console.log("Creating custom checkout with data:", bodyData);
    
    // Validation
    if (!shop || !email || !lineItems || lineItems.length === 0) {
      console.log("Validation failed: Missing required fields");
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400 }
      );
    }
    
    // Calculate total for tracking
    const totalValue = lineItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1) || 0), 0);
    
    // Call custom checkout API
    console.log("Calling custom checkout API at:", `${ADMIN_API_BASE_URL.replace(/\/$/, "")}/api/custom-checkout`);
    const response = await fetch(`${ADMIN_API_BASE_URL.replace(/\/$/, "")}/api/custom-checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shop,
        email,
        name,
        address,
        paymentMethod,
        lineItems,
      }),
    });
    
    let data;
    try {
      data = await response.json();
    } catch (parseErr) {
      console.error("Failed to parse custom checkout response:", parseErr);
      data = { error: "Invalid response from API" };
    }
    
    console.log("Custom checkout API response:", data);
    const cartId = data.checkoutId || `temp-${Date.now()}`; // Use response ID or temp
    
    if (!response.ok) {
      console.log("Custom checkout failed, tracking as payment_canceled");
      // Track as payment canceled/abandonment
      const trackingPayload = {
        eventType: "payment_canceled",
        cartId,
        customerName: name || "Anonymous",
        email: email,
        totalValue,
        metadata: {
          reason: "payment_canceled",
          lineItems,
          address,
          paymentMethod,
          error: data.error || "Checkout failed",
          shop
        }
      };
      console.log("Sending tracking payload (canceled):", trackingPayload);
      
      // Send to tracking API
      const trackingUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://adminrocket.megascale.co.in'}/api/abandoned-checkouts`;
      console.log("Tracking URL:", trackingUrl);
      const trackRes = await fetch(trackingUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trackingPayload),
      });
      console.log("Tracking response status:", trackRes.status);
      if (!trackRes.ok) {
        console.error("Tracking API failed on cancel:", await trackRes.text());
      }
      
      return new Response(
        JSON.stringify({ success: false, error: data }),
        { status: response.status }
      );
    }
    
    // On success: Track as order completed
    console.log("Custom checkout success, tracking as order_completed");
    const trackingPayload = {
      eventType: "order_completed",
      cartId,
      customerName: name || "Anonymous",
      email: email,
      totalValue,
      metadata: {
        status: "completed",
        checkoutId: cartId,
        lineItems,
        address,
        paymentMethod,
        orderData: data,
        shop
      }
    };
    console.log("Sending tracking payload (success):", trackingPayload);
    
    // Send to tracking API
    const trackingUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://adminrocket.megascale.co.in'}/api/abandoned-checkouts`;
    console.log("Tracking URL:", trackingUrl);
    const trackRes = await fetch(trackingUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trackingPayload),
    });
    console.log("Tracking response status:", trackRes.status);
    if (!trackRes.ok) {
      console.error("Tracking API failed on success:", await trackRes.text());
    }
    
    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (error) {
    console.error("Error in custom checkout route:", error);
    
    // Track error as abandonment (use stored body)
    if (bodyData) {
      const { shop, email, name, lineItems } = bodyData;
      const totalValue = lineItems ? lineItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1) || 0), 0) : 0;
      const trackingPayload = {
        eventType: "checkout_error",
        cartId: `error-${Date.now()}`,
        customerName: name || "Anonymous",
        email: email || "",
        totalValue,
        metadata: {
          reason: "system_error",
          error: error.message,
          shop
        }
      };
      console.log("Sending tracking payload (error):", trackingPayload);
      
      const trackingUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://adminrocket.megascale.co.in'}/api/abandoned-checkouts`;
      console.log("Tracking URL:", trackingUrl);
      const trackRes = await fetch(trackingUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trackingPayload),
      }).catch(trackErr => {
        console.error("Failed to track error:", trackErr);
      });
      if (trackRes && !trackRes.ok) {
        console.error("Tracking API failed on error:", trackRes.status);
      }
    }
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}