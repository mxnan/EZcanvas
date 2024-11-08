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
import Image from "next/image";

export default function Authenticate() {
  return (
    <div className="relative w-full min-h-screen ">
        <Image
          src="/assets/luffy.gif"
          alt="logout"
          fill
          className="object-cover z-0 h-1/2 w-1/2"
        />
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
