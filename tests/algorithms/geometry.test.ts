/**
 * Tests for geometry utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  calculateDistance,
  calculatePinDistance,
  calculatePinPositions,
  isPointInCircle,
  degreesToRadians,
  radiansToDegrees,
  normalizeAngle,
} from '../../src/lib/math/geometry';
import type { Point } from '../../src/types';

describe('Geometry Utilities', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points correctly', () => {
      const p1: Point = { x: 0, y: 0 };
      const p2: Point = { x: 3, y: 4 };
      
      expect(calculateDistance(p1, p2)).toBe(5);
    });

    it('should return 0 for same points', () => {
      const p1: Point = { x: 5, y: 5 };
      const p2: Point = { x: 5, y: 5 };
      
      expect(calculateDistance(p1, p2)).toBe(0);
    });
  });

  describe('calculatePinDistance', () => {
    it('should calculate distance between two pins', () => {
      expect(calculatePinDistance([0, 0], [3, 4])).toBe(5);
    });
  });

  describe('calculatePinPositions', () => {
    it('should calculate correct number of pins', () => {
      const pins = calculatePinPositions(8, 250, 200);
      expect(pins).toHaveLength(8);
    });

    it('should place pins in a circle', () => {
      const pins = calculatePinPositions(4, 100, 50);
      
      // Check that all pins are approximately 50 units from center
      pins.forEach(([x, y]) => {
        const distance = Math.sqrt((x - 100) ** 2 + (y - 100) ** 2);
        expect(distance).toBeCloseTo(50, 1);
      });
    });

    it('should distribute pins evenly around circle', () => {
      const pins = calculatePinPositions(4, 100, 50);
      
      // For 4 pins, we expect them at 0, 90, 180, 270 degrees
      // Pin 0 should be at (150, 100) - rightmost
      expect(pins[0][0]).toBeCloseTo(150, 1);
      expect(pins[0][1]).toBeCloseTo(100, 1);
      
      // Pin 1 should be at (100, 150) - bottom
      expect(pins[1][0]).toBeCloseTo(100, 1);
      expect(pins[1][1]).toBeCloseTo(150, 1);
    });
  });

  describe('isPointInCircle', () => {
    it('should return true for points inside circle', () => {
      const center: Point = { x: 0, y: 0 };
      const point: Point = { x: 3, y: 4 };
      
      expect(isPointInCircle(point, center, 10)).toBe(true);
    });

    it('should return false for points outside circle', () => {
      const center: Point = { x: 0, y: 0 };
      const point: Point = { x: 10, y: 10 };
      
      expect(isPointInCircle(point, center, 5)).toBe(false);
    });

    it('should return true for points exactly on circle edge', () => {
      const center: Point = { x: 0, y: 0 };
      const point: Point = { x: 3, y: 4 };
      
      expect(isPointInCircle(point, center, 5)).toBe(true);
    });
  });

  describe('angle conversions', () => {
    it('should convert degrees to radians correctly', () => {
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI);
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2);
      expect(degreesToRadians(360)).toBeCloseTo(2 * Math.PI);
    });

    it('should convert radians to degrees correctly', () => {
      expect(radiansToDegrees(Math.PI)).toBeCloseTo(180);
      expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90);
      expect(radiansToDegrees(2 * Math.PI)).toBeCloseTo(360);
    });

    it('should normalize angles correctly', () => {
      expect(normalizeAngle(-Math.PI)).toBeCloseTo(Math.PI);
      expect(normalizeAngle(3 * Math.PI)).toBeCloseTo(Math.PI);
      expect(normalizeAngle(Math.PI / 2)).toBeCloseTo(Math.PI / 2);
    });
  });
});