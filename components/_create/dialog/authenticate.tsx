"use client";

import { signInWithGoogle } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader } from "lucide-react";
import { toast } from "sonner";

interface AuthenticateProps {
  showDialog?: boolean;
}

export default function Authenticate({ showDialog = false }: AuthenticateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithGoogle();
      
      if (result?.url) {
        // Client-side redirect to the OAuth URL
        window.location.href = result.url;
      } else {
        toast.error("Failed to initialize sign in");
        router.push("/error?message=authentication-failed");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Failed to sign in with Google");
      router.push("/error?message=authentication-failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!showDialog) {
    return (
      <div className="relative w-full min-h-screen">
        <div className="absolute inset-0 w-full h-[40vh] flex items-center justify-center">
          <Loader className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen">
      <AlertDialog defaultOpen>
        <AlertDialogContent className="sm:max-w-[600px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center mb-4">
              Authenticate with Google
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              To continue, please sign in with your Google account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              variant="default"
              className="w-full gap-2"
              onClick={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  
                  Signing in...<Loader className="h-4 w-4 animate-spin" />
                </>
              ) : (
                "Sign in with Google"
              )}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}