import { toast } from "sonner";
import { processImage, processUnsplashImage } from "@/hooks/image-process";
import type { ImageProcessorResult } from "@/types/image";
import { useCallback, useMemo } from "react";

interface ImageProcessorProps {
  onImageProcess: (result: ImageProcessorResult) => void;
  onLoading: (loading: boolean) => void;
  onShowPayDialog: () => void;
  checkCanGenerate: () => boolean;
  decrementGenerations: () => Promise<boolean | void>;
  containerWidth: number;
  containerHeight: number;
  scaleFactor: number;
}

export function useImageProcessor({
  onImageProcess,
  onLoading,
  onShowPayDialog,
  checkCanGenerate,
  decrementGenerations,
  containerWidth,
  containerHeight,
  scaleFactor,
}: ImageProcessorProps) {
  const processOptions = useMemo(
    () => ({
      containerWidth,
      containerHeight,
      scaleFactor,
    }),
    [containerWidth, containerHeight, scaleFactor]
  );

  const handleFileUpload = useCallback(async (file: File) => {
    if (!checkCanGenerate()) {
      onShowPayDialog();
      return;
    }

    onLoading(true);

    try {
      const result = await processImage(file, processOptions);
      onImageProcess(result);
      await decrementGenerations();
      toast.success("Image uploaded and processed successfully!");
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process the image.");
    } finally {
      onLoading(false);
    }
  }, [checkCanGenerate, decrementGenerations, onImageProcess, onLoading, onShowPayDialog, processOptions]);

  const handleUnsplashUpload = useCallback(async (url: string) => {
    if (!checkCanGenerate()) {
      onShowPayDialog();
      return;
    }

    onLoading(true);

    try {
      const result = await processUnsplashImage(url, processOptions);
      onImageProcess(result);
      await decrementGenerations();
      toast.success("Unsplash image processed successfully!");
    } catch (error) {
      console.error("Error processing Unsplash image:", error);
      toast.error("Failed to process the Unsplash image.");
    } finally {
      onLoading(false);
    }
  }, [checkCanGenerate, decrementGenerations, onImageProcess, onLoading, onShowPayDialog, processOptions]);

  return {
    handleFileUpload,
    handleUnsplashUpload,
  };
}