import React from "react";

import { cn } from "@/lib/utils";

import ThemeToggle from "../theme/theme-toggle";
import UserDetails from "./user-details";
import CTAButton from "./cta-button";

export default function Navbar() {
  return (
    <header className={cn("z-50 fixed top-2 left-1/2 -translate-x-1/2 ")}>
      <nav
        className={cn(
          "relative h-14  flex items-center gap-4 justify-center rounded-2xl bg-secondary/30 backdrop-blur-md border overflow-hidden"
        )}
      >
        <div className="flex items-center flex-shrink-0 ml-2">
          <ThemeToggle />
        </div>
        <UserDetails />

        <div className="flex items-center flex-shrink-0 mr-2">
          <CTAButton />
        </div>
      </nav>
    </header>
  );
}
