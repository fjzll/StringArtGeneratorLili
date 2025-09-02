/**
 * Line optimization algorithm for String Art generation
 * Extracted from NonBlockingPrecalculateLines and NonBlockingLineCalculator functions
 */

import type { PinCoordinate, LineCache, StringArtParameters, OptimizationProgress } from '../../types';
import { linspace } from '../math/interpolation';
// Removed unused import: getSum
import { calculatePinDistance } from '../math/geometry';
import { getValidTargetPins } from './pinCalculation';
import { DEFAULT_CONFIG } from '../utils/constants';

/**
 * Precalculate all possible lines between pins for optimization
 * Extracted from NonBlockingPrecalculateLines function
 */
export function precalculateLineCache(
  pinCoords: PinCoordinate[],
  minDistance: number = DEFAULT_CONFIG.MIN_DISTANCE
): LineCache {
  const numPins = pinCoords.length;
  const cache: LineCache = {
    x: new Array(numPins * numPins).fill(null),
    y: new Array(numPins * numPins).fill(null),
    length: new Array(numPins * numPins).fill(0),
    weight: new Array(numPins * numPins).fill(1),
  };

  for (let a = 0; a < numPins; a++) {
    for (let b = a + minDistance; b < numPins; b++) {
      const [x0, y0] = pinCoords[a];
      const [x1, y1] = pinCoords[b];

      // Calculate line length
      const distance = Math.floor(calculatePinDistance(pinCoords[a], pinCoords[b]));

      // Generate line coordinates using linear interpolation
      const xs = linspace(x0, x1, distance);
      const ys = linspace(y0, y1, distance);

      // Store in both directions (a->b and b->a)
      const indexAB = a * numPins + b;
      const indexBA = b * numPins + a;

      cache.x[indexAB] = xs;
      cache.x[indexBA] = xs;
      cache.y[indexAB] = ys;
      cache.y[indexBA] = ys;
      cache.length[indexAB] = distance;
      cache.length[indexBA] = distance;
    }
  }

  return cache;
}

/**
 * Calculate error for a specific line on the error matrix
 * Extracted from getLineErr function
 */
export function calculateLineError(
  errorMatrix: Float32Array | Uint8Array,
  lineCoords: { x: number[]; y: number[] },
  imgWidth: number
): number {
  const { x: xs, y: ys } = lineCoords;
  let totalError = 0;

  for (let i = 0; i < xs.length; i++) {
    const pixelIndex = ys[i] * imgWidth + xs[i];
    if (pixelIndex >= 0 && pixelIndex < errorMatrix.length) {
      totalError += errorMatrix[pixelIndex];
    }
  }

  return totalError;
}

/**
 * Apply line mask to error matrix (subtract line from error)
 * Extracted from setLine function
 */
export function applyLineMask(
  errorMatrix: Float32Array,
  lineCoords: { x: number[]; y: number[] },
  lineWeight: number,
  imgWidth: number
): void {
  const { x: xs, y: ys } = lineCoords;

  for (let i = 0; i < xs.length; i++) {
    const pixelIndex = ys[i] * imgWidth + xs[i];
    if (pixelIndex >= 0 && pixelIndex < errorMatrix.length) {
      let newValue = errorMatrix[pixelIndex] - lineWeight;
      
      // Clamp to valid range
      if (newValue < 0) newValue = 0;
      if (newValue > 255) newValue = 255;
      
      errorMatrix[pixelIndex] = newValue;
    }
  }
}

/**
 * Find the best next pin for the optimization algorithm
 * Extracted from the core optimization loop
 */
export function findBestNextPin(
  currentPin: number,
  errorMatrix: Float32Array,
  lineCache: LineCache,
  lastPins: number[],
  params: StringArtParameters
): { bestPin: number; error: number } {
  let maxError = -1;
  let bestPin = -1;

  const validPins = getValidTargetPins(
    currentPin,
    params.minDistance,
    params.numberOfPins,
    lastPins
  );

  for (const testPin of validPins) {
    const cacheIndex = testPin * params.numberOfPins + currentPin;
    const xs = lineCache.x[cacheIndex];
    const ys = lineCache.y[cacheIndex];

    if (xs && ys) {
      const lineError = calculateLineError(
        errorMatrix,
        { x: xs, y: ys },
        params.imgSize
      ) * lineCache.weight[cacheIndex];

      if (lineError > maxError) {
        maxError = lineError;
        bestPin = testPin;
      }
    }
  }

  return { bestPin, error: maxError };
}

/**
 * Main optimization algorithm
 * Extracted from NonBlockingLineCalculator function
 */
export async function optimizeStringArt(
  errorMatrix: Float32Array,
  pinCoords: PinCoordinate[],
  lineCache: LineCache,
  params: StringArtParameters,
  onProgress?: (progress: OptimizationProgress, currentLineSequence?: number[], pinCoordinates?: PinCoordinate[]) => void
): Promise<{
  lineSequence: number[];
  totalThreadLength: number;
}> {
  const lineSequence: number[] = [];
  let currentPin = 0;
  let totalThreadLength = 0;
  const lastPins: number[] = [];
  
  lineSequence.push(currentPin);

  for (let lineIndex = 0; lineIndex < params.numberOfLines; lineIndex++) {
    // Find best next pin
    const { bestPin } = findBestNextPin(
      currentPin,
      errorMatrix,
      lineCache,
      lastPins,
      params
    );

    if (bestPin === -1) {
      console.warn('No valid next pin found, stopping optimization');
      break;
    }

    // Add to sequence
    lineSequence.push(bestPin);

    // Apply the line to the error matrix
    const cacheIndex = bestPin * params.numberOfPins + currentPin;
    const xs = lineCache.x[cacheIndex];
    const ys = lineCache.y[cacheIndex];

    if (xs && ys) {
      applyLineMask(errorMatrix, { x: xs, y: ys }, params.lineWeight, params.imgSize);
    }

    // Calculate thread length
    const distance = calculatePinDistance(pinCoords[currentPin], pinCoords[bestPin]);
    totalThreadLength += (params.hoopDiameter / params.imgSize) * distance;

    // Update last pins (prevent immediate backtracking)
    lastPins.push(bestPin);
    if (lastPins.length > 20) {
      lastPins.shift();
    }

    currentPin = bestPin;

    // Report progress (every 10 lines like original, not every OPTIMIZATION_BATCH_SIZE)
    if (onProgress && (lineIndex % 10 === 0 || lineIndex === params.numberOfLines - 1)) {
      console.log(`Line ${lineIndex + 1}/${params.numberOfLines}: Calling progress callback`)
      
      const progress: OptimizationProgress = {
        linesDrawn: lineIndex + 1,
        totalLines: params.numberOfLines,
        percentComplete: ((lineIndex + 1) / params.numberOfLines) * 100,
        currentPin: currentPin,
        nextPin: bestPin,
        threadLength: totalThreadLength,
      };
      
      // Pass current line sequence and pin coordinates for progressive drawing
      onProgress(progress, [...lineSequence], pinCoords);
      
      // Yield control to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  return {
    lineSequence,
    totalThreadLength,
  };
}

/**
 * Initialize error matrix from processed image data
 */
export function createErrorMatrix(
  processedImageData: Uint8Array,
  imgSize: number
): Float32Array {
  const errorMatrix = new Float32Array(imgSize * imgSize);
  
  // Error = 255 - pixel_value (invert so darker pixels have higher error)
  for (let i = 0; i < processedImageData.length; i++) {
    errorMatrix[i] = 255 - processedImageData[i];
  }
  
  return errorMatrix;
}