import { TextSet } from "./text";

export interface ImageProcessorResult {
  originalUrl: string;
  bgRemovedUrl: string;
  dimensions: ImageDimensions;
}

export interface ImageDimensions {
  preview: {
    width: number;
    height: number;
  };
  final: {
    width: number;
    height: number;
  };
}

export interface ImageProcessorOptions {
  containerWidth: number;
  containerHeight: number;
}

export interface GifOptions {
  images: string[];
  textData: TextSet[];
  previewWidth: number;
  previewHeight: number;
}