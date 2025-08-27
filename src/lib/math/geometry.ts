/**
 * Geometric utility functions for String Art generation
 * Extracted from the original implementation
 */

import type { Point, PinCoordinate } from '../../types';

/**
 * Calculate the Euclidean distance between two points
 */
export function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate the distance between two pin coordinates
 */
export function calculatePinDistance(pin1: PinCoordinate, pin2: PinCoordinate): number {
  const dx = pin2[0] - pin1[0];
  const dy = pin2[1] - pin1[1];
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate pin positions around a circle
 * Extracted from NonBlockingCalculatePins function
 */
export function calculatePinPositions(
  numberOfPins: number,
  center: number,
  radius: number
): PinCoordinate[] {
  const pinCoords: PinCoordinate[] = [];
  
  for (let i = 0; i < numberOfPins; i++) {
    const angle = (2 * Math.PI * i) / numberOfPins;
    const x = Math.floor(center + radius * Math.cos(angle));
    const y = Math.floor(center + radius * Math.sin(angle));
    pinCoords.push([x, y]);
  }
  
  return pinCoords;
}

/**
 * Check if a point is inside a circle
 */
export function isPointInCircle(
  point: Point,
  center: Point,
  radius: number
): boolean {
  const distance = calculateDistance(point, center);
  return distance <= radius;
}

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Normalize an angle to be within 0 to 2À radians
 */
export function normalizeAngle(angle: number): number {
  while (angle < 0) {
    angle += 2 * Math.PI;
  }
  while (angle >= 2 * Math.PI) {
    angle -= 2 * Math.PI;
  }
  return angle;
}