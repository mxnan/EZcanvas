/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimationPreset } from "./animation";

const EASE_IN_OUT: [number, number, number, number] = [0.4, 0, 0.2, 1];

export const ANIMATION_PRESETS: Record<string, AnimationPreset> = {
  none: {
    name: "None",
    description: "No animation effect",
    variant: {
      initial: {},
      animate: {},
    },
  },
  bounce: {
    name: "Bounce",
    description: "Smooth bouncing effect",
    variant: {
      initial: { y: 0 },
      animate: {
        y: [-30, 30],
        transition: {
          duration: 2,
          ease: EASE_IN_OUT,
          repeat: Infinity,
          repeatType: "reverse",
          type: "tween",
        },
      },
    },
  },
  fade: {
    name: "Fade",
    description: "Smooth fade in/out",
    variant: {
      initial: { opacity: 1 },
      animate: {
        opacity: [1, 0],
        transition: {
          duration: 1.5,
          delay:0.5,
          ease: EASE_IN_OUT,
          repeat: Infinity,
          repeatType: "reverse",
          type: "tween",
        },
      },
    },
  },
  scale: {
    name: "Scale",
    description: "Scale in/out effect",
    variant: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.5],
        transition: {
          duration: 1.5,
          ease: EASE_IN_OUT,
          repeat: Infinity,
          repeatType: "reverse",
          type: "tween",
        },
      },
    },
  },
  rotate: {
    name: "Rotate",
    description: "Rotating animation",
    variant: {
      initial: { rotate: 0 },
      animate: {
        rotate: [-5, 5],
        transition: {
          duration: 1.5,
          ease: EASE_IN_OUT,
          repeat: Infinity,
          repeatType: "reverse",
          type: "tween",
        },
      },
    },
  },
} as const;

export const getAnimationPreset = (preset: string) => {
  return ANIMATION_PRESETS[preset] || ANIMATION_PRESETS.none;
};