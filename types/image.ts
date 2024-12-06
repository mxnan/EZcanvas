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
  scaleFactor: number;
}