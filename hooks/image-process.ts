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
  { containerWidth, containerHeight, scaleFactor }: ImageProcessorOptions
) {
  let previewWidth = containerWidth;
  let previewHeight = containerHeight;
  const aspectRatio = originalWidth / originalHeight;

  if (originalHeight > originalWidth) {
    previewHeight = containerHeight;
    previewWidth = previewHeight * aspectRatio;
  } else {
    previewWidth = containerWidth;
    previewHeight = previewWidth / aspectRatio;
  }

  return {
    preview: { width: previewWidth, height: previewHeight },
    final: { 
      width: previewWidth * scaleFactor,
      height: previewHeight * scaleFactor 
    },
  };
}