"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { toast } from "sonner";

interface PayDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PayDialog({ isOpen, onClose }: PayDialogProps) {
  const handleUpgrade = () => {
    // TODO: Implement Razorpay logic here
    toast.success("clicked")
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            Upgrade to Lifetime Access
          </DialogTitle>
          <DialogDescription>
            Unlock unlimited generations and premium features forever.
          </DialogDescription>
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
          <Button onClick={handleUpgrade} className="w-full">
            Upgrade Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}