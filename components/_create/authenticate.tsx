"use client";
import { signInWithGoogle } from "@/lib/auth-actions";
import React from "react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Loader } from "lucide-react";

export default function Authenticate() {
  return (
    <div className="relative w-full min-h-screen ">
      <div className="absolute inset-0 w-full h-[40vh] flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>

      {/* <Image
          src="/assets/luffy.gif"
          alt="logout"
          fill
          sizes="(100vw, 100vh)"
          className="object-cover z-0 h-1/2 w-1/2"
        /> */}
      <AlertDialog defaultOpen>
        <AlertDialogTrigger>
          <> </>
        </AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Authenticate with Google</AlertDialogTitle>
            <AlertDialogDescription>
              To continue, please sign in with your Google account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => signInWithGoogle()}
            >
              {/* <FcGoogle /> */}
              Sign in with Google
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
