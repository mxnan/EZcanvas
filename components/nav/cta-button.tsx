"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { signout } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowDownLeft, ArrowDownRight, Loader } from "lucide-react";
import { useUserStore } from "@/store/use-user-store";

const CTAButton = () => {
  const { profile, reset } = useUserStore();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const success = await signout();
    if (success) {
      router.push("/");
      reset();
      router.refresh();
    }
    setIsSigningOut(false);
  };

  return (
    <>
      {profile ? (
        <Button
          size="icon"
          variant="destructive"
          className="text-sm font-bold"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowDownLeft />
          )}
        </Button>
      ) : (
        <Link href="/create">
          <Button className="text-sm font-bold" size="icon" variant="default">
            <ArrowDownRight />
          </Button>
        </Link>
      )}
    </>
  );
};

export default CTAButton;
