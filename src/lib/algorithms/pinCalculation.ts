/**
 * Pin calculation algorithm for String Art generation
 * Extracted from NonBlockingCalculatePins function
 */

import type { PinCoordinate, StringArtParameters } from '../../types';
import { calculatePinPositions } from '../math/geometry';
import { DEFAULT_CONFIG } from '../utils/constants';

/**
 * Calculate pin coordinates around a circular boundary
 */
export function calculatePins(params: Partial<StringArtParameters> = {}): PinCoordinate[] {
  const {
    numberOfPins = DEFAULT_CONFIG.N_PINS,
    imgSize = DEFAULT_CONFIG.IMG_SIZE,
  } = params;

  const center = imgSize / 2;
  const radius = imgSize / 2 - 0.5; // Leave half-pixel margin

  return calculatePinPositions(numberOfPins, center, radius);
}

/**
 * Validate pin parameters
 */
export function validatePinParameters(params: Partial<StringArtParameters>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (params.numberOfPins !== undefined) {
    if (params.numberOfPins < 3) {
      errors.push('Number of pins must be at least 3');
    }
    if (params.numberOfPins > 1000) {
      errors.push('Number of pins should not exceed 1000 for performance reasons');
    }
    if (!Number.isInteger(params.numberOfPins)) {
      errors.push('Number of pins must be an integer');
    }
  }

  if (params.imgSize !== undefined) {
    if (params.imgSize < 100) {
      errors.push('Image size must be at least 100 pixels');
    }
    if (params.imgSize > 2000) {
      errors.push('Image size should not exceed 2000 pixels for performance reasons');
    }
    if (!Number.isInteger(params.imgSize)) {
      errors.push('Image size must be an integer');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate the angular separation between adjacent pins
 */
export function calculateAngularSeparation(numberOfPins: number): number {
  return (2 * Math.PI) / numberOfPins;
}

/**
 * Get the pin index that is at a specific angle offset from a given pin
 */
export function getPinAtOffset(
  currentPin: number,
  offset: number,
  numberOfPins: number
): number {
  return (currentPin + offset) % numberOfPins;
}

/**
 * Calculate the minimum distance between two pins (in terms of pin indices)
 */
export function calculateMinPinDistance(
  pin1: number,
  pin2: number,
  numberOfPins: number
): number {
  const direct = Math.abs(pin2 - pin1);
  const wraparound = numberOfPins - direct;
  return Math.min(direct, wraparound);
}

/**
 * Get all pins within a minimum distance range from a given pin
 */
export function getValidTargetPins(
  currentPin: number,
  minDistance: number,
  numberOfPins: number,
  excludePins: number[] = []
): number[] {
  const validPins: number[] = [];
  
  for (let offset = minDistance; offset < numberOfPins - minDistance; offset++) {
    const targetPin = getPinAtOffset(currentPin, offset, numberOfPins);
    
    if (!excludePins.includes(targetPin)) {
      validPins.push(targetPin);
    }
  }
  
  return validPins;
}