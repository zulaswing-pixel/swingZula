import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const payload = await req.json();

    // DEBUG: Log the full incoming payload to inspect cart.items
    console.log("🔍 Incoming tracking payload:", JSON.stringify(payload, null, 2));

    // Optional: validate that required fields exist (e.g., event === "checkout_started")
    // if (!payload.event || payload.event !== "checkout_started") { ... }

    const res = await fetch("https://adminrocket.megascale.co.in/api/track/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    // DEBUG: Log the raw response text from upstream tracker
    console.log("🔍 Upstream tracker response:", text);

    let data;
    try {
      data = text ? JSON.parse(text) : {}; // handle empty body
    } catch (parseError) {
      console.error("Non-JSON response from tracker:", text);
      return NextResponse.json(
        { success: false, error: "Invalid response from tracking service" },
        { status: 502 }
      );
    }

    // DEBUG: Log the parsed data before forwarding
    console.log("🔍 Parsed data to forward:", JSON.stringify(data, null, 2));

    // Forward the tracker's response (success or error) back to client
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json(
      { success: false, error: "Internal proxy error" },
      { status: 500 }
    );
  }
}