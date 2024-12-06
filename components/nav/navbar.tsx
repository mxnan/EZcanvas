import React from "react";
import ThemeToggle from "../theme/theme-toggle";
import UserDetails from "./user-details";
import CTAButton from "./cta-button";

export default function Navbar() {
  return (
    <header className="relative flex-1">
      <nav className="relative h-14 flex items-center justify-center gap-4 overflow-hidden">
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
