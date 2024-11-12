"use client";
import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "../theme/theme-toggle";
import UserDetails from "./user-details";
import CTAButton from "./cta-button";

// Navigation container variants - simplified with easeInOut
const navVariants = {
  collapsed: {
    width: "80px",
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  expanded: {
    width: "auto",
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

// Side element variants - simple fade with slight delay
const sideElementVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      delay: 0.3,
    },
  },
};

export default function Navbar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const isLogoutPage = pathname === "/logout";

  return (
    <header
      className={cn(
        "z-50 fixed top-2 left-1/2 -translate-x-1/2 ",
        isLogoutPage && "hidden"
      )}
    >
      <motion.nav
        className={cn(
          "relative h-14  flex items-center gap-4 justify-center rounded-2xl bg-secondary/30 backdrop-blur-md border overflow-hidden"
        )}
        variants={navVariants}
        initial="collapsed"
        animate={isHovered ? "expanded" : "collapsed"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="sync">
          {isHovered && (
            <motion.div
              variants={sideElementVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex items-center flex-shrink-0 ml-2"
            >
              <ThemeToggle />
            </motion.div>
          )}
        </AnimatePresence>

        <UserDetails />

        <AnimatePresence mode="sync">
          {isHovered && (
            <motion.div
              variants={sideElementVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex items-center flex-shrink-0 mr-2"
            >
              <CTAButton />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
