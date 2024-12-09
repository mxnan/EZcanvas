import { removeBackground } from "@imgly/background-removal";
import type { ImageProcessorResult, ImageProcessorOptions, ImageDimensions } from "@/types/image";

export async function processImage(
  file: File,
  options: ImageProcessorOptions
): Promise<ImageProcessorResult> {
  const result = await removeBackground(file);
  const originalUrl = URL.createObjectURL(file);
  const bgRemovedUrl = URL.createObjectURL(result);

  // Get image dimensions
  const dimensions = await calculateImageDimensions(originalUrl, options);
  
  return {
    originalUrl,
    bgRemovedUrl,
    dimensions,
  };
}

export async function processUnsplashImage(
  url: string,
  options: ImageProcessorOptions
): Promise<ImageProcessorResult> {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], "unsplash-image", { type: blob.type });
  
  return processImage(file, options);
}

async function calculateImageDimensions(
  imageUrl: string,
  options: ImageProcessorOptions
): Promise<ImageDimensions> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const dimensions = calculateDimensions(
        img.naturalWidth,
        img.naturalHeight,
        options
      );
      resolve(dimensions);
    };
    img.src = imageUrl;
  });
}

function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  options: ImageProcessorOptions
): ImageDimensions {
  // Keep original dimensions for final output
  const finalWidth = originalWidth;
  const finalHeight = originalHeight;

  // Calculate preview dimensions for UI
  const containerRatio = options.containerWidth / options.containerHeight;
  const imageRatio = originalWidth / originalHeight;
  
  let previewWidth: number;
  let previewHeight: number;

  if (imageRatio > containerRatio) {
    // Image is wider than container
    previewWidth = options.containerWidth;
    previewHeight = options.containerWidth / imageRatio;
  } else {
    // Image is taller than container
    previewHeight = options.containerHeight;
    previewWidth = options.containerHeight * imageRatio;
  }

  return {
    preview: {
      width: Math.round(previewWidth),
      height: Math.round(previewHeight)
    },
    final: {
      width: finalWidth,
      height: finalHeight
    }
  };
}