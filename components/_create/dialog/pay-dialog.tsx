/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Loader } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useUserStore } from "@/store/use-user-store";

interface PayDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PayDialog({ isOpen, onClose }: PayDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { profile, fetchProfile } = useUserStore();

  const createOrder = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/create-order", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      const paymentData = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: data.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/verify-order", {
              method: "POST",
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                userId: data.userId
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.isOk) {
              toast.success("Payment successful! You now have lifetime access.");
              await fetchProfile(); // Refresh user profile to update UI
              onClose();
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            toast.error("Something went wrong");
            console.error("Payment verification error:", error);
          }
        },
        prefill: {
          name: profile?.email?.split('@')[0] || "User",
          email: profile?.email || "",
        },
        theme: {
          color: "#000000",
        },
      };

      const payment = new (window as any).Razorpay(paymentData);
      payment.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initiate payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            Upgrade to Lifetime Access
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="rounded-lg border p-4 space-y-3">
            <h3 className="font-bold text-2xl">₹499</h3>
            <ul className="space-y-2 text-sm">
              <li>✓ Unlimited generations</li>
              <li>✓ Priority support</li>
              <li>✓ Early access to new features</li>
              <li>✓ No watermarks</li>
            </ul>
          </div>
          <Button 
            onClick={createOrder} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                Processing... <Loader className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Upgrade Now"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
