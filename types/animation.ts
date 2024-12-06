export type AnimationType = 'fadeInSlideUp' | 'slideInFadeOut';

export interface AnimationConfig {
  type: AnimationType;
}

// Define specific keyframes for each animation phase
export interface AnimationKeyframe {
  opacity?: number;
  y?: number;
  scale?: number;
}

export const ANIMATION_VARIANTS = {
  fadeInSlideUp: {
    initial: { opacity: 0, y: 0 },
    fadeIn: { opacity: 1, y: 0 },
    slideUp: { opacity: 1, y: -50 },
    exit: { opacity: 1, y: -100 }
  },
  slideInFadeOut: {
    initial: { opacity: 0, y: -50 },
    enter: { opacity: 1, y: 0 },
    fadeOut: { opacity: 0, y: 0 },
    exit: { opacity: 0, y: 0 }
  }
};

// Separate timing interfaces for each animation type
interface FadeInSlideUpTiming {
  type: 'fadeInSlideUp';
  fadeInDuration: number;
  slideUpDelay: number;
  totalFrames: number;
}

interface SlideInFadeOutTiming {
  type: 'slideInFadeOut';
  slideInDuration: number;
  fadeOutDelay: number;
  totalFrames: number;
}

// Union type for all animation timings
export type AnimationTiming = FadeInSlideUpTiming | SlideInFadeOutTiming;

export const ANIMATION_TIMING: Record<AnimationType, AnimationTiming> = {
  fadeInSlideUp: {
    type: 'fadeInSlideUp',
    fadeInDuration: 20,
    slideUpDelay: 30,
    totalFrames: 60
  },
  slideInFadeOut: {
    type: 'slideInFadeOut',
    slideInDuration: 20,
    fadeOutDelay: 30,
    totalFrames: 60
  }
};

// Update the calculation function to handle different timing types
export const calculateAnimationState = (
  animationType: AnimationType,
  frameIndex: number
): AnimationKeyframe => {
  const timing = ANIMATION_TIMING[animationType];

  if (timing.type === 'fadeInSlideUp') {
    if (frameIndex < timing.fadeInDuration) {
      const progress = frameIndex / timing.fadeInDuration;
      return {
        opacity: progress,
        y: 0
      };
    } else if (frameIndex < timing.slideUpDelay) {
      return {
        opacity: 1,
        y: 0
      };
    } else {
      const progress = (frameIndex - timing.slideUpDelay) / 
                      (timing.totalFrames - timing.slideUpDelay);
      return {
        opacity: 1,
        y: -100 * progress
      };
    }
  } else {
    // slideInFadeOut
    if (frameIndex < timing.slideInDuration) {
      const progress = frameIndex / timing.slideInDuration;
      return {
        opacity: progress,
        y: -50 * (1 - progress)
      };
    } else if (frameIndex < timing.fadeOutDelay) {
      return {
        opacity: 1,
        y: 0
      };
    } else {
      const progress = (frameIndex - timing.fadeOutDelay) / 
                      (timing.totalFrames - timing.fadeOutDelay);
      return {
        opacity: 1 - progress,
        y: 0
      };
    }
  }
};