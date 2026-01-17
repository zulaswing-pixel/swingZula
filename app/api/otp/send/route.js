import { NextResponse } from 'next/server'; // Or res.json() in Pages Router

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, shop } = body;

    // Validate inputs
    if (!email || !shop) {
      return NextResponse.json({ success: false, error: 'Missing email or shop' }, { status: 400 });
    }

    // Your OTP logic here (e.g., generate OTP, send via email/SMS)
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Simple 6-digit OTP
    // Example: await sendEmail(email, otp); // Implement your email function

    // Store OTP temporarily (e.g., in Redis, DB, or session)
    // await storeOTP(email, otp, shop);

    console.log(`OTP ${otp} sent to ${email} for shop ${shop}`);

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });

  } catch (err) {
    console.error('Send OTP error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}