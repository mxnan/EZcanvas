"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  rightElement?: React.ReactNode;
}

// Minimal animation variants
const contentVariants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.2 },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const Accordion = ({
  title,
  children,
  isOpen,
  onToggle,
  rightElement,
}: AccordionProps) => {
  return (
    <div className=" rounded-lg m-2">
      <button
        className="w-full rounded-2xl flex items-center justify-between p-3 bg-muted/50 hover:bg-muted/80"
        onClick={onToggle}
        type="button"
      >
        <div className="flex items-center gap-2">
          <ChevronRight
            className="h-5 w-5 stroke-[3px] transition-transform ease-in-out duration-500"
            style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
          />
          <span className="font-medium">{title}</span>
        </div>
        {rightElement}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={contentVariants}
            className="overflow-hidden"
          >
            <div className="p-3 bg-background">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />
    </div>
  );
};

export default Accordion;
