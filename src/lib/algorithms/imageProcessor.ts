/**
 * Image processing utilities for String Art generation
 * Extracted from the original implementation
 */

import type { GrayscaleWeights, ProcessedImageData } from '../../types';
import { DEFAULT_CONFIG, GRAYSCALE_WEIGHTS } from '../utils/constants';

/**
 * Crop image to square format, centered
 * Extracted from the original cropping logic
 */
export function cropToSquare(
  imageElement: HTMLImageElement,
  targetSize: number = DEFAULT_CONFIG.IMG_SIZE
): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = targetSize;
  canvas.height = targetSize;
  
  const { width: imgWidth, height: imgHeight } = imageElement;
  
  // Calculate crop region for square center crop
  let selectedWidth: number;
  let selectedHeight: number;
  let xOffset = 0;
  let yOffset = 0;
  
  if (imgHeight > imgWidth) {
    selectedWidth = imgWidth;
    selectedHeight = imgWidth;
    yOffset = Math.floor((imgHeight - imgWidth) / 2);
  } else if (imgWidth > imgHeight) {
    selectedWidth = imgHeight;
    selectedHeight = imgHeight;
    xOffset = Math.floor((imgWidth - imgHeight) / 2);
  } else {
    selectedWidth = imgWidth;
    selectedHeight = imgHeight;
  }
  
  // Draw cropped and scaled image
  ctx.drawImage(
    imageElement,
    xOffset, yOffset, selectedWidth, selectedHeight,
    0, 0, targetSize, targetSize
  );
  
  return ctx.getImageData(0, 0, targetSize, targetSize);
}

/**
 * Convert image to grayscale using weighted formula
 * Extracted from the original grayscale conversion
 */
export function convertToGrayscale(
  imageData: ImageData,
  weights: GrayscaleWeights = { red: GRAYSCALE_WEIGHTS.RED, green: GRAYSCALE_WEIGHTS.GREEN, blue: GRAYSCALE_WEIGHTS.BLUE }
): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  
  // Create a copy of the image data
  const processedData = ctx.createImageData(imageData.width, imageData.height);
  const data = processedData.data;
  const originalData = imageData.data;
  
  // Apply weighted grayscale conversion
  for (let i = 0; i < originalData.length; i += 4) {
    const r = originalData[i];
    const g = originalData[i + 1];
    const b = originalData[i + 2];
    const a = originalData[i + 3];
    
    // Calculate grayscale value using weighted formula
    const gray = Math.round(
      weights.red * r +
      weights.green * g +
      weights.blue * b
    );
    
    // Set all color channels to the grayscale value
    data[i] = gray;     // Red
    data[i + 1] = gray; // Green
    data[i + 2] = gray; // Blue
    data[i + 3] = a;    // Alpha (unchanged)
  }
  
  return processedData;
}

/**
 * Apply circular mask to image data
 * Extracted from the original circular masking logic
 */
export function applyCircularMask(imageData: ImageData): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  
  // Draw the image data to canvas
  ctx.putImageData(imageData, 0, 0);
  
  // Apply circular mask using destination-in composite operation
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  ctx.arc(
    imageData.width / 2,
    imageData.height / 2,
    imageData.width / 2,
    0,
    Math.PI * 2
  );
  ctx.closePath();
  ctx.fill();
  
  return ctx.getImageData(0, 0, imageData.width, imageData.height);
}

/**
 * Process image through the complete pipeline
 * Crop -> Grayscale -> Circular Mask
 */
export function processImageForStringArt(
  imageElement: HTMLImageElement,
  targetSize: number = DEFAULT_CONFIG.IMG_SIZE
): ProcessedImageData {
  // Step 1: Crop to square
  const croppedImageData = cropToSquare(imageElement, targetSize);
  
  // Step 2: Convert to grayscale
  const grayscaleImageData = convertToGrayscale(croppedImageData);
  
  // Step 3: Apply circular mask
  const circularMaskedImageData = applyCircularMask(grayscaleImageData);
  
  return {
    originalImage: imageElement,
    croppedImage: {
      data: croppedImageData.data,
      width: croppedImageData.width,
      height: croppedImageData.height,
    },
    grayscaleImage: {
      data: grayscaleImageData.data,
      width: grayscaleImageData.width,
      height: grayscaleImageData.height,
    },
    circularMaskedImage: {
      data: circularMaskedImageData.data,
      width: circularMaskedImageData.width,
      height: circularMaskedImageData.height,
    },
    dimensions: {
      width: targetSize,
      height: targetSize,
    },
  };
}

/**
 * Convert ImageData to a 2D array for algorithm processing
 */
export function imageDataTo2DArray(imageData: ImageData): number[][] {
  const { width, height, data } = imageData;
  const result: number[][] = [];
  
  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      // Use the red channel (since it's grayscale, all channels should be the same)
      row.push(data[index]);
    }
    result.push(row);
  }
  
  return result;
}

/**
 * Convert ImageData to a flat 1D array for algorithm processing
 */
export function imageDataToFlatArray(imageData: ImageData): Uint8Array {
  const { width, height, data } = imageData;
  const result = new Uint8Array(width * height);
  
  for (let i = 0; i < width * height; i++) {
    // Use the red channel (since it's grayscale, all channels should be the same)
    result[i] = data[i * 4];
  }
  
  return result;
}

/**
 * Validate image dimensions
 */
export function validateImageDimensions(image: HTMLImageElement): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (image.width < 100 || image.height < 100) {
    errors.push('Image dimensions must be at least 100x100 pixels');
  }
  
  if (image.width > 4000 || image.height > 4000) {
    errors.push('Image dimensions should not exceed 4000x4000 pixels for performance reasons');
  }
  
  const aspectRatio = image.width / image.height;
  if (aspectRatio > 3 || aspectRatio < 1/3) {
    errors.push('Image aspect ratio is too extreme. Consider using a more square image');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}