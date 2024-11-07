"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const LogoutPage = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => router.push("/"), 2000);
    toast.message("loggin you out")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div className="flex-center min-h-screen">You have logged out... redirecting in a sec.</div>;
};

export default LogoutPage;
