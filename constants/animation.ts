/* eslint-disable @typescript-eslint/no-explicit-any */
export type EasingPreset = [number, number, number, number];

export interface AnimationPreset {
  name: string;
  description: string;
  variant: {
    initial: any;
    animate: any;
    exit?: any;
  };
}