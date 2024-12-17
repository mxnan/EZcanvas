/* eslint-disable @typescript-eslint/no-explicit-any */
export type EasingFunction = "linear" | "easeIn" | "easeOut" | "easeInOut";

export interface AnimationProperties {
  opacity?: any;
  scale?: any;
  y?: any;
  x?: any;
  rotation?: any;
}

export interface AnimationConfig {
  type: string;
  duration: number;
  delay?: number;
  easing: EasingFunction;
  properties: AnimationProperties;
  description: string;
  category:
    | "basic"
    | "emphasis"
    | "entrance"
    | "exit"
    | "attention"
    | "special";
}

export const EASING_FUNCTIONS = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 2),
  easeInOut: (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
};

export const ANIMATION_REGISTRY: Record<string, AnimationConfig> = {
  // Basic Animations
  fadeInAndOut: {
    type: "fade",
    duration: 60,
    delay: 30,
    easing: "easeInOut",
    properties: {
      opacity: [0, 1, 0],
    },
    description: "Fade in and out",
    category: "basic",
  },
  slideUp: {
    type: "slide",
    duration: 60,
    delay: 40,
    easing: "easeInOut",
    properties: {
      y: [400, 0, 400],
      opacity: [0, 1, 0],
    },
    description: "Slide up with fade",
    category: "basic",
  },
  slideLeft: {
    type: "slide",
    duration: 60,
    delay: 40,
    easing: "easeInOut",
    properties: {
      x: [400, 0, 400],
      opacity: [0, 1, 0],
    },
    description: "Slide left with fade",
    category: "basic",
  },
  slideRight: {
    type: "slide",
    duration: 60,
    delay: 40,
    easing: "easeInOut",
    properties: {
      x: [-400, 0, -400],
      opacity: [0, 1, 0],
    },
    description: "Slide right with fade",
    category: "basic",
  },
  slideDown: {
    type: "slide",
    duration: 60,
    delay: 40,
    easing: "easeInOut",
    properties: {
      y: [-400, 0, -400],
      opacity: [0, 1, 0],
    },
    description: "Slide down with fade",
    category: "basic",
  },

  // // Emphasis Animations
  // pulse: {
  //   type: "pulse",
  //   duration: 40,
  //   easing: "easeInOut",
  //   properties: {
  //     scale: [1, 1.05, 1],
  //   },
  //   description: "Gentle pulse effect",
  //   category: "emphasis",
  // },
  // bounce: {
  //   type: "bounce",
  //   duration: 50,
  //   easing: "easeOut",
  //   properties: {
  //     y: [0, -20, 0],
  //     scale: [1, 0.95, 1],
  //   },
  //   description: "Bouncy effect",
  //   category: "emphasis",
  // },
  // shake: {
  //   type: "shake",
  //   duration: 30,
  //   easing: "linear",
  //   properties: {
  //     x: [-10, 10, -10, 10, 0],
  //   },
  //   description: "Shake horizontally",
  //   category: "emphasis",
  // },

  // // Entrance Animations
  // popIn: {
  //   type: "pop",
  //   duration: 40,
  //   easing: "easeOut",
  //   properties: {
  //     scale: [0, 1.1, 1],
  //     opacity: [0, 1],
  //   },
  //   description: "Pop in with overshoot",
  //   category: "entrance",
  // },
  // flipIn: {
  //   type: "flip",
  //   duration: 50,
  //   easing: "easeOut",
  //   properties: {
  //     rotation: [-180, 0],
  //     opacity: [0, 1],
  //   },
  //   description: "Flip in horizontally",
  //   category: "entrance",
  // },
  // expandIn: {
  //   type: "expand",
  //   duration: 45,
  //   easing: "easeOut",
  //   properties: {
  //     scale: [0, 1],
  //     opacity: [0, 1],
  //   },
  //   description: "Expand from center",
  //   category: "entrance",
  // },

  // // Exit Animations
  // popOut: {
  //   type: "pop",
  //   duration: 40,
  //   easing: "easeIn",
  //   properties: {
  //     scale: [1, 1.1, 0],
  //     opacity: [1, 0],
  //   },
  //   description: "Pop out with overshoot",
  //   category: "exit",
  // },
  // flipOut: {
  //   type: "flip",
  //   duration: 50,
  //   easing: "easeIn",
  //   properties: {
  //     rotation: [0, 180],
  //     opacity: [1, 0],
  //   },
  //   description: "Flip out horizontally",
  //   category: "exit",
  // },

  // // Attention Animations
  // rubberBand: {
  //   type: "rubber",
  //   duration: 60,
  //   easing: "easeOut",
  //   properties: {
  //     scale: [1, 1.25, 0.75, 1.15, 0.95, 1],
  //   },
  //   description: "Rubber band effect",
  //   category: "attention",
  // },
  // swing: {
  //   type: "swing",
  //   duration: 50,
  //   easing: "easeInOut",
  //   properties: {
  //     rotation: [0, 15, -10, 5, -5, 0],
  //   },
  //   description: "Swinging motion",
  //   category: "attention",
  // },
  // heartbeat: {
  //   type: "heartbeat",
  //   duration: 70,
  //   easing: "easeInOut",
  //   properties: {
  //     scale: [1, 1.3, 1, 1.3, 1],
  //   },
  //   description: "Heartbeat effect",
  //   category: "attention",
  // },

  // // Special Effects
  // glitch: {
  //   type: "glitch",
  //   duration: 40,
  //   easing: "linear",
  //   properties: {
  //     x: [-2, 2, -2, 2, 0],
  //     y: [2, -2, 2, -2, 0],
  //     opacity: [1, 0.8, 1, 0.8, 1],
  //   },
  //   description: "Digital glitch effect",
  //   category: "special",
  // },
  // spiral: {
  //   type: "spiral",
  //   duration: 60,
  //   easing: "easeInOut",
  //   properties: {
  //     rotation: [0, 360],
  //     scale: [1, 0],
  //     opacity: [1, 0],
  //   },
  //   description: "Spiral out effect",
  //   category: "special",
  // },
  // jello: {
  //   type: "jello",
  //   duration: 65,
  //   easing: "easeOut",
  //   properties: {
  //     scale: [1, 1.25, 0.9, 1.1, 0.9, 1.05, 0.95, 1],
  //     rotation: [0, -12, 9, -6, 3, -2, 1, 0],
  //   },
  //   description: "Jello wiggle effect",
  //   category: "special",
  // },
};
