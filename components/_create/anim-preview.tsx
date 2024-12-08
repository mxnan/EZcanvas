/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { AnimationConfig } from "@/registry/anim-reg";

interface PreviewProps {
  config: AnimationConfig;
  text: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function AnimationPreview({
  config,
  text,
  isSelected,
  onClick,
}: PreviewProps) {
  const getAnimationProps = () => {
    const initial: any = {};
    const animate: any = {};

    Object.entries(config.properties).forEach(([key, [start, end]]) => {
      initial[key] = start;
      animate[key] = end;
    });

    return { initial, animate };
  };

  const { initial, animate } = getAnimationProps();

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 p-4 cursor-pointer transition-all",
        isSelected
          ? "border-primary bg-primary/10"
          : "border-border hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <div className="text-sm font-medium mb-2">{config.type}</div>
      <div className="h-24 bg-secondary/20 rounded-md overflow-hidden">
        <motion.div
          className="w-full h-full flex items-center justify-center"
          initial={initial}
          animate={animate}
          transition={{
            duration: config.duration / 60,
            ease: config.easing,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <span className="text-sm">{text}</span>
        </motion.div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{config.description}</p>
    </div>
  );
}
