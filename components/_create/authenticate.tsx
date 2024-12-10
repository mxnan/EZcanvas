import { signInWithGoogle } from "@/lib/auth-actions";
import React from "react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Loader } from "lucide-react";

interface AuthenticateProps {
  showDialog?: boolean;
}

export default function Authenticate({ showDialog = false }: AuthenticateProps) {
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
        <AlertDialogContent className="sm:max-w-[600px] ">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center mb-4">Authenticate with Google</AlertDialogTitle>
            <AlertDialogDescription className="text-center ">
              To continue, please sign in with your Google account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              variant="default"
              className="w-full gap-2"
              onClick={() => signInWithGoogle()}
            >
              Sign in with Google
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
