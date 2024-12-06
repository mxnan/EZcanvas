/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from "react";
import { encode } from "modern-gif";

import { toast } from "sonner";

interface GifOptions {
  images: string[];
  textData: TextSet[];
  gifWidth?: number;
  gifHeight?: number;
  delay?: number;
}

interface TextSet {
  id: number;
  text: string;
  fontFamily: string;
  top: number;
  left: number;
  color: string;
  fontSize: number;
  fontWeight: number;
  opacity: number;
  rotation: number;
  zIndex: number;
}

const renderText = (
  ctx: CanvasRenderingContext2D,
  textSet: TextSet,
  canvas: HTMLCanvasElement
) => {
  ctx.save();

  // Calculate center position (percentages remain the same)
  const x = canvas.width * (textSet.left / 100);
  const y = canvas.height * (textSet.top / 100);

  // Text properties are already scaled up in handleGifGeneration
  ctx.font = `${textSet.fontWeight} ${textSet.fontSize}px ${textSet.fontFamily}`;
  ctx.fillStyle = textSet.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.globalAlpha = textSet.opacity;

  // Apply transformation for rotation
  ctx.translate(x, y);
  ctx.rotate((textSet.rotation * Math.PI) / 180);

  // Draw text at origin (0, 0) since we've translated the context
  ctx.fillText(textSet.text, 0, 0);

  ctx.restore();
};

export function useGifGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGif, setGeneratedGif] = useState<string | null>(null);

  const generateGif = useCallback(async (options: GifOptions) => {
    setIsGenerating(true);

    try {
      // Load images with proper cross-origin handling
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

      // Create canvas with proper dimensions
      const canvas = document.createElement("canvas");
      canvas.width = options.gifWidth || baseImage.naturalWidth;
      canvas.height = options.gifHeight || baseImage.naturalHeight;

      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
        alpha: true, // Enable alpha channel
      });

      if (!ctx) throw new Error("Failed to get canvas context");

      // Clear canvas and draw base image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // Sort text overlays by zIndex before rendering
      const sortedTextData = [...options.textData].sort(
        (a, b) => a.zIndex - b.zIndex
      );

      // Draw text overlays in order of zIndex
      sortedTextData.forEach((textSet) => {
        renderText(ctx, textSet, canvas);
      });

      // Draw background-removed image on top
      ctx.drawImage(bgRemovedImage, 0, 0, canvas.width, canvas.height);

      // Create GIF frame
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const frames = [
        {
          data: imageData.data,
          delay: options.delay || 0,
        },
      ];

      // Generate GIF with proper dimensions
      const output = await encode({
        width: canvas.width,
        height: canvas.height,
        frames,
        // quality: 1 // Uncomment if you want to adjust quality
      });

      const blob = new Blob([output], { type: "image/gif" });
      const gifUrl = URL.createObjectURL(blob);

      setGeneratedGif(gifUrl);
      toast.success("GIF generated successfully!");
      return gifUrl;
    } catch (error) {
      console.error("GIF generation error:", error);
      toast.error("Failed to generate GIF");
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    isGenerating,
    generatedGif,
    generateGif,
    setGeneratedGif,
  };
}
