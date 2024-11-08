"use client";
import React from "react";
import ThemeToggle from "./theme/theme-toggle";
import UserDetails from "./user-details";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import CTAButton from "./cta-button";

export default function Navbar() {
  const pathname = usePathname();

  const isLogoutPage = pathname === "/logout";
  return (
    <header
      className={cn(
        "z-50 fixed top-2 left-1/2 -translate-x-1/2 w-max rounded-2xl bg-secondary/30 backdrop-blur-md border",
        isLogoutPage && "hidden"
      )}
    >
      <nav
        className={cn(
          "h-14 px-8 max-w-sm mx-auto flex gap-4 items-center justify-between"
        )}
      >
        <ThemeToggle />
        <UserDetails />
        <CTAButton />
      </nav>
    </header>
  );
}
