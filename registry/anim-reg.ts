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
  category: "basic" | "emphasis" | "entrance" | "exit";
}

export const EASING_FUNCTIONS = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 2),
  easeInOut: (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
};

export const ANIMATION_REGISTRY: Record<string, AnimationConfig> = {
  slideTop: {
    type: "slide",
    duration: 60,
    delay: 40,
    easing: "easeInOut",
    properties: {
      opacity: [0, 1, 0],
      y: [-400, 0, -400],
    },
    description: "Slide from top",
    category: "basic",
  },
  slideBottom: {
    type: "slide",
    duration: 60,
    delay: 40,
    easing: "easeInOut",
    properties: {
      opacity: [0, 1, 0],
      y: [400, 0, 400],
    },
    description: "Slide from bottom",
    category: "basic",
  },
  slideLeft: {
    type: "slide",
    duration: 60,
    delay: 40,
    easing: "easeInOut",
    properties: {
      opacity: [0, 1, 0],
      x: [-400, 0, -400],
    },
    description: "Slide from left",
    category: "basic",
  },
  slideRight: {
    type: "slide",
    duration: 60,
    delay: 40,
    easing: "easeInOut",
    properties: {
      opacity: [0, 1, 0],
      x: [400, 0, 400],
    },
    description: "Slide from right",
    category: "basic",
  },
  //basic
  // slideUp: {
  //   type: "slideUp",
  //   duration: 15,
  //   easing: "easeOut",
  //   properties: {
  //     y: [50, 0],
  //     opacity: [0, 1],
  //   },
  //   description: "Slide up with fade",
  //   category: "entrance",
  // },
  // bounceIn: {
  //   type: "bounceInOut",
  //   duration: 30,
  //   easing: "linear",
  //   properties: {
  //     scale: [0.3, 1.1],
  //     opacity: [0, 1, 0.5, 1],
  //   },
  //   description: "Bounce in and out effect",
  //   category: "emphasis",
  // },
  // rotateIn: {
  //   type: "rotateIn",
  //   duration: 25,
  //   easing: "easeOut",
  //   properties: {
  //     rotation: [-180, 0],
  //     opacity: [0, 1],
  //   },
  //   description: "Rotate while fading in",
  //   category: "entrance",
  // },
};
