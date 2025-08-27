/**
 * Tests for pin calculation algorithm
 */

import { describe, it, expect } from 'vitest';
import {
  calculatePins,
  validatePinParameters,
  calculateAngularSeparation,
  getPinAtOffset,
  calculateMinPinDistance,
  getValidTargetPins,
} from '../../src/lib/algorithms/pinCalculation';
import { DEFAULT_CONFIG } from '../../src/lib/utils/constants';

describe('Pin Calculation', () => {
  describe('calculatePins', () => {
    it('should calculate correct number of pins with default parameters', () => {
      const pins = calculatePins();
      expect(pins).toHaveLength(DEFAULT_CONFIG.N_PINS);
    });

    it('should calculate correct number of pins with custom parameters', () => {
      const pins = calculatePins({ numberOfPins: 16 });
      expect(pins).toHaveLength(16);
    });

    it('should place pins in a circle around image boundary', () => {
      const pins = calculatePins({ numberOfPins: 8, imgSize: 200 });
      
      // All pins should be close to the boundary (due to Math.floor, expect ~99-100)
      const center = 100;
      const expectedMinRadius = 95;  // Allow some tolerance for flooring effects
      const expectedMaxRadius = 105;
      
      pins.forEach(([x, y]) => {
        const distance = Math.sqrt((x - center) ** 2 + (y - center) ** 2);
        expect(distance).toBeGreaterThanOrEqual(expectedMinRadius);
        expect(distance).toBeLessThanOrEqual(expectedMaxRadius);
      });
    });

    it('should distribute pins evenly around circle', () => {
      const pins = calculatePins({ numberOfPins: 4, imgSize: 200 });
      const center = 100;
      
      // Calculate angles for each pin
      const angles = pins.map(([x, y]) => Math.atan2(y - center, x - center));
      
      // Normalize angles to [0, 2π]
      const normalizedAngles = angles.map(angle => 
        angle < 0 ? angle + 2 * Math.PI : angle
      );
      
      // Sort angles
      normalizedAngles.sort((a, b) => a - b);
      
      // Check that angles are approximately evenly spaced (π/2 apart for 4 pins)
      const expectedSeparation = (2 * Math.PI) / 4;
      for (let i = 1; i < normalizedAngles.length; i++) {
        const separation = normalizedAngles[i] - normalizedAngles[i - 1];
        expect(separation).toBeCloseTo(expectedSeparation, 1);
      }
    });
  });

  describe('validatePinParameters', () => {
    it('should pass validation for valid parameters', () => {
      const result = validatePinParameters({
        numberOfPins: 100,
        imgSize: 500,
      });
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for too few pins', () => {
      const result = validatePinParameters({ numberOfPins: 2 });
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Number of pins must be at least 3');
    });

    it('should fail validation for too many pins', () => {
      const result = validatePinParameters({ numberOfPins: 1500 });
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Number of pins should not exceed 1000 for performance reasons');
    });

    it('should fail validation for non-integer pins', () => {
      const result = validatePinParameters({ numberOfPins: 10.5 });
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Number of pins must be an integer');
    });

    it('should fail validation for invalid image size', () => {
      const result = validatePinParameters({ imgSize: 50 });
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Image size must be at least 100 pixels');
    });
  });

  describe('calculateAngularSeparation', () => {
    it('should calculate correct angular separation', () => {
      expect(calculateAngularSeparation(4)).toBeCloseTo(Math.PI / 2);
      expect(calculateAngularSeparation(8)).toBeCloseTo(Math.PI / 4);
      expect(calculateAngularSeparation(360)).toBeCloseTo(Math.PI / 180);
    });
  });

  describe('getPinAtOffset', () => {
    it('should calculate pin at offset correctly', () => {
      expect(getPinAtOffset(0, 5, 10)).toBe(5);
      expect(getPinAtOffset(7, 5, 10)).toBe(2); // Wraps around
      expect(getPinAtOffset(3, -2, 10)).toBe(1);
    });

    it('should handle wrapping correctly', () => {
      expect(getPinAtOffset(9, 2, 10)).toBe(1); // 9 + 2 = 11, 11 % 10 = 1
      expect(getPinAtOffset(0, 10, 10)).toBe(0); // Full circle
    });
  });

  describe('calculateMinPinDistance', () => {
    it('should calculate minimum distance between pins', () => {
      expect(calculateMinPinDistance(1, 5, 10)).toBe(4);
      expect(calculateMinPinDistance(9, 1, 10)).toBe(2); // Wraps around
      expect(calculateMinPinDistance(0, 5, 10)).toBe(5);
    });

    it('should handle wrapping distance correctly', () => {
      expect(calculateMinPinDistance(1, 9, 10)).toBe(2);
      expect(calculateMinPinDistance(9, 1, 10)).toBe(2);
    });
  });

  describe('getValidTargetPins', () => {
    it('should return pins within minimum distance range', () => {
      const validPins = getValidTargetPins(0, 2, 10);
      
      // Should include pins 2, 3, 4, 5, 6, 7 (excluding pins 8, 9, 0, 1 due to minDistance)
      expect(validPins).toContain(2);
      expect(validPins).toContain(7);
      expect(validPins).not.toContain(0);
      expect(validPins).not.toContain(1);
      expect(validPins).not.toContain(8);
      expect(validPins).not.toContain(9);
    });

    it('should exclude specified pins', () => {
      const validPins = getValidTargetPins(0, 2, 10, [3, 5]);
      
      expect(validPins).not.toContain(3);
      expect(validPins).not.toContain(5);
      expect(validPins).toContain(2);
      expect(validPins).toContain(4);
    });

    it('should handle edge cases with small pin count', () => {
      const validPins = getValidTargetPins(0, 1, 4);
      
      // With 4 pins and minDistance 1, valid targets are pins 1, 2
      expect(validPins).toEqual([1, 2]);
    });
  });
});