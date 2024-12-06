/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from "react";
import { encode } from "modern-gif";

import { toast } from "sonner";
import {
  ANIMATION_VARIANTS,
  AnimationType,
  AnimationKeyframe,
  ANIMATION_TIMING,
} from "@/types/animation";
import { TextSet } from "@/types/text";
import { calculateAnimationState } from "@/types/animation";

interface GifOptions {
  images: string[];
  textData: TextSet[];
  gifWidth?: number;
  gifHeight?: number;
  delay?: number;
}

// const renderText = (
//   ctx: CanvasRenderingContext2D,
//   textSet: TextSet,
//   canvas: HTMLCanvasElement
// ) => {
//   ctx.save();

//   // Calculate center position (percentages remain the same)
//   const x = canvas.width * (textSet.left / 100);
//   const y = canvas.height * (textSet.top / 100);

//   // Text properties are already scaled up in handleGifGeneration
//   ctx.font = `${textSet.fontWeight} ${textSet.fontSize}px ${textSet.fontFamily}`;
//   ctx.fillStyle = textSet.color;
//   ctx.textAlign = "center";
//   ctx.textBaseline = "middle";
//   ctx.globalAlpha = textSet.opacity;

//   // Apply transformation for rotation
//   ctx.translate(x, y);
//   ctx.rotate((textSet.rotation * Math.PI) / 180);

//   // Draw text at origin (0, 0) since we've translated the context
//   ctx.fillText(textSet.text, 0, 0);

//   ctx.restore();
// };

export function useGifGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGif, setGeneratedGif] = useState<string | null>(null);

  const generateGif = useCallback(async (options: GifOptions) => {
    setIsGenerating(true);

    try {
      // Load images
      const [baseImage, bgRemovedImage] = await Promise.all(
        options.images.map(async (imgUrl) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = imgUrl;
          });
          return img;
        })
      );

      const canvas = document.createElement("canvas");
      canvas.width = options.gifWidth || baseImage.naturalWidth;
      canvas.height = options.gifHeight || baseImage.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Failed to get canvas context");

      // Generate animation frames
      const frames: { data: Uint8ClampedArray; delay: number }[] = [];
      const TOTAL_FRAMES = 60; // Total frames for the animation
      const FRAME_DELAY = 50; // 20fps

      // Create frames for the animation sequence
      for (let frameIndex = 0; frameIndex < TOTAL_FRAMES; frameIndex++) {
        // Clear and draw background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        // Sort text by zIndex
        const sortedTextData = [...options.textData].sort(
          (a, b) => a.zIndex - b.zIndex
        );

        // Draw each text with animation
        sortedTextData.forEach((textSet) => {
          const animState = calculateAnimationState(
            textSet.animation?.type || "fadeInSlideUp",
            frameIndex
          );

          ctx.save();
          ctx.globalAlpha = animState.opacity || textSet.opacity;

          // Calculate position with animation offset
          const x = canvas.width * (textSet.left / 100);
          const y = canvas.height * (textSet.top / 100) + (animState.y || 0);

          // Set text properties
          ctx.font = `${textSet.fontWeight} ${textSet.fontSize}px ${textSet.fontFamily}`;
          ctx.fillStyle = textSet.color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Apply transformations
          ctx.translate(x, y);
          ctx.rotate((textSet.rotation * Math.PI) / 180);

          // Draw text
          ctx.fillText(textSet.text, 0, 0);
          ctx.restore();
        });

        // Draw background image if exists
        if (bgRemovedImage) {
          ctx.drawImage(bgRemovedImage, 0, 0, canvas.width, canvas.height);
        }

        // Capture frame
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        frames.push({
          data: imageData.data,
          delay: FRAME_DELAY,
        });
      }

      // Generate GIF
      const output = await encode({
        width: canvas.width,
        height: canvas.height,
        frames,
        // quality: 10,
      });

      const blob = new Blob([output], { type: "image/gif" });
      const gifUrl = URL.createObjectURL(blob);
      setGeneratedGif(gifUrl);
      return gifUrl;
    } catch (error) {
      console.error("GIF generation error:", error);
      toast.error("Failed to generate GIF");
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generateGif, isGenerating, generatedGif, setGeneratedGif };
}
