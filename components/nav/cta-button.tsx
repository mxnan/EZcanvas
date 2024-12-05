"use client";
import React from "react";
import { Button } from "../ui/button";
import { signout } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowDownLeft, ArrowDownRight } from "lucide-react";
import { useUserStore } from "@/store/use-user-store";

const CTAButton = () => {
  const { profile, reset } = useUserStore();
  const router = useRouter();

  const handleSignOut = async () => {
    const success = await signout();
    if (success) {
      reset();
      router.push("/");
      router.refresh();
    }
  };

  return (
    <>
      {profile ? (
        <Button
          size="icon"
          variant="destructive"
          className="text-sm font-bold"
          onClick={handleSignOut}
        >
          <ArrowDownLeft />
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
