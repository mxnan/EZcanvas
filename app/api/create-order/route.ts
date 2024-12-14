import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/utils/supabase/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const body = await req.json(); // Parse request body
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user already has lifetime subscription
    const { data: profile } = await supabase
      .from("profiles")
      .select("lifetime_subscription")
      .eq("id", user.id)
      .single();

    if (profile?.lifetime_subscription) {
      return NextResponse.json(
        { error: "User already has lifetime subscription" },
        { status: 400 }
      );
    }

    // Create shorter receipt ID (max 40 chars)
    const shortUserId = user.id.slice(0, 8); // Take first 8 chars of UUID
    const timestamp = Date.now().toString().slice(-8); // Take last 8 digits of timestamp
    const receiptId = `rcpt_${shortUserId}_${timestamp}`;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: 49900, // ₹499 in paise
      currency: "INR",
      receipt: receiptId,
      notes: {
        userId: user.id
      }
    });

    return NextResponse.json({ ...order, userId: user.id });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
