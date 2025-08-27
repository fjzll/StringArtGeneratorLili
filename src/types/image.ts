/**
 * Types for image processing operations
 */

export type ImageData2D = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
};

export type GrayscaleWeights = {
  red: number;
  green: number;
  blue: number;
};

export type CropRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ProcessedImageData = {
  originalImage: HTMLImageElement;
  croppedImage: ImageData2D;
  grayscaleImage: ImageData2D;
  circularMaskedImage: ImageData2D;
  dimensions: {
    width: number;
    height: number;
  };
};

export type ImageProcessingProgress = {
  stage: 'loading' | 'cropping' | 'grayscale' | 'masking' | 'complete';
  percentComplete: number;
  message: string;
};

export type ImageUploadResult = {
  file: File;
  dataUrl: string;
  dimensions: {
    width: number;
    height: number;
  };
};