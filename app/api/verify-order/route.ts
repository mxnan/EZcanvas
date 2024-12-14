import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET as string;
  return crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
};

export async function POST(request: NextRequest) {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature, userId } = 
      await request.json();

    // Verify payment signature
    const signature = generatedSignature(orderId, razorpayPaymentId);
    if (signature !== razorpaySignature) {
      return NextResponse.json(
        { message: "Payment verification failed", isOk: false },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Update profile to enable lifetime subscription
    const { data: profile, error: updateError } = await supabase
      .from("profiles")
      .update({
        lifetime_subscription: true,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(
      { 
        message: "Payment verified successfully", 
        isOk: true,
        profile 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { message: "Payment verification failed", isOk: false },
      { status: 500 }
    );
  }
}