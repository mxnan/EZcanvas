/* eslint-disable @typescript-eslint/no-explicit-any */
// constants/variants.ts

// Define the type for animation variants
type AnimationVariant = {
  initial: { [key: string]: any }; // You can specify more specific types if needed
  animate: { [key: string]: any };
};

// Define the type for the entire animation variants object
type AnimationVariants = {
  [key: string]: AnimationVariant;
};

// Define the animation variants
export const animationVariants: AnimationVariants = {
  none: {
    initial: {},
    animate: {},
  },
  bounce: {
    initial: { y: -10 },
    animate: {
      y: 10,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1.2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: [0.4, 0, 0.2, 1],
      },
    },
  },
  fade: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1.2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: [0.4, 0, 0.2, 1],
      },
    },
  },
  // fade: {
  //   initial: { opacity: 0 },
  //   animate: {
  //     opacity: 1,
  //     transition: {
  //       duration: 0.5,
  //       ease: [0.4, 0, 0.2, 1],
  //       repeat: Infinity,
  //       repeatType: "reverse",
  //     },
  //   },
  // },
  // scale: {
  //   initial: { scale: 0.9 },
  //   animate: {
  //     scale: 1.3,
  //     transition: {
  //       duration: 0.5,
  //       ease: [0.4, 0, 0.2, 1],
  //       repeat: Infinity,
  //       repeatType: "reverse",
  //     },
  //   },
  // }
} as const;
