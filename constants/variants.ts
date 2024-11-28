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
    initial: { y: [0,-20] },
    animate: {
      y: [0,20,0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
      
      },
    },
  },
};
