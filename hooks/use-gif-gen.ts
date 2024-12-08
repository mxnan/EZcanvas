/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from "react";
import { encode } from "modern-gif";

import { toast } from "sonner";

import { TextSet } from "@/types/text";
import {
  AnimationConfig,
  EASING_FUNCTIONS,
  ANIMATION_REGISTRY,
} from "@/registry/anim-reg";

interface GifOptions {
  images: string[];
  textData: TextSet[];
  gifWidth?: number;
  gifHeight?: number;
  delay?: number;
}

export function useGifGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGif, setGeneratedGif] = useState<string | null>(null);

  const calculateAnimationProgress = (
    frameIndex: number,
    totalFrames: number,
    config: AnimationConfig
  ) => {
    const progress = frameIndex / totalFrames;
    const easingFunction = EASING_FUNCTIONS[config.easing];
    return easingFunction(progress);
  };

  const applyAnimationProperties = (
    ctx: CanvasRenderingContext2D,
    textSet: TextSet,
    frameIndex: number,
    TOTAL_FRAMES: number
  ) => {
    const animationType = textSet.animation?.type || "fadeIn";
    const config = ANIMATION_REGISTRY[animationType];

    if (!config) return;

    const progress = calculateAnimationProgress(
      frameIndex,
      TOTAL_FRAMES,
      config
    );
    const properties = config.properties;

    // Calculate all transformations first
    let opacity = textSet.opacity;
    let scaleValue = 1;
    let translateX = 0;
    let translateY = 0;
    let rotationValue = textSet.rotation;

    Object.entries(properties).forEach(([key, [start, end]]) => {
      const value = start + (end - start) * progress;

      switch (key) {
        case "opacity":
          opacity *= value;
          break;
        case "scale":
          scaleValue = value;
          break;
        case "y":
          translateY = value;
          break;
        case "x":
          translateX = value;
          break;
        case "rotation":
          rotationValue += value;
          break;
      }
    });
    // Apply transformations in the correct order
    ctx.globalAlpha = opacity;
    ctx.translate(translateX, translateY);
    ctx.scale(scaleValue, scaleValue);
    ctx.rotate((rotationValue * Math.PI) / 180);
  };

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
      const FRAME_DELAY = 40; // 20fps

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
          ctx.save(); // Save context state before transformations

          // Calculate base position
          const x = canvas.width * (textSet.left / 100);
          const y = canvas.height * (textSet.top / 100);

          // Move to text position first
          ctx.translate(x, y);

          // Apply animation transformations
          applyAnimationProperties(ctx, textSet, frameIndex, TOTAL_FRAMES);

          // Set text properties
          ctx.font = `${textSet.fontWeight} ${textSet.fontSize}px ${textSet.fontFamily}`;
          ctx.fillStyle = textSet.color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Draw the text at origin (0,0) since we've already translated
          ctx.fillText(textSet.text, 0, 0);

          ctx.restore(); // Restore context state after drawing
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
        maxColors: 255,
        format: "blob",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { generateGif, isGenerating, generatedGif, setGeneratedGif };
}
