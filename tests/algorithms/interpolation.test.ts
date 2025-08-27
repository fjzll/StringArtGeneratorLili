/**
 * Tests for interpolation utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  linspace,
  lerp,
  inverseLerp,
  clamp,
  smoothstep,
} from '../../src/lib/math/interpolation';

describe('Interpolation Utilities', () => {
  describe('linspace', () => {
    it('should generate linearly spaced numbers', () => {
      const result = linspace(0, 10, 11);
      expect(result).toHaveLength(11);
      expect(result[0]).toBe(0);
      expect(result[10]).toBe(10);
      expect(result[5]).toBe(5);
    });

    it('should handle default number of points', () => {
      const result = linspace(0, 5);
      expect(result).toHaveLength(6); // 5 - 0 + 1
      expect(result).toEqual([0, 1, 2, 3, 4, 5]);
    });

    it('should handle single point', () => {
      const result = linspace(5, 5, 1);
      expect(result).toEqual([5]);
    });

    it('should return empty array for zero points', () => {
      const result = linspace(0, 10, 0);
      expect(result).toEqual([]);
    });

    it('should floor values to integers', () => {
      const result = linspace(0, 10, 3);
      // Should be [0, 5, 10] but floored
      expect(result.every(x => Number.isInteger(x))).toBe(true);
    });
  });

  describe('lerp', () => {
    it('should interpolate between two values', () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 1)).toBe(10);
    });

    it('should handle negative values', () => {
      expect(lerp(-10, 10, 0.5)).toBe(0);
      expect(lerp(-5, -1, 0.5)).toBe(-3);
    });
  });

  describe('inverseLerp', () => {
    it('should find t value for interpolated value', () => {
      expect(inverseLerp(0, 10, 5)).toBe(0.5);
      expect(inverseLerp(0, 10, 0)).toBe(0);
      expect(inverseLerp(0, 10, 10)).toBe(1);
    });

    it('should handle same start and end values', () => {
      expect(inverseLerp(5, 5, 5)).toBe(0);
    });
  });

  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should handle edge cases', () => {
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });
  });

  describe('smoothstep', () => {
    it('should return smooth interpolation', () => {
      expect(smoothstep(0, 1, 0)).toBe(0);
      expect(smoothstep(0, 1, 1)).toBe(1);
      expect(smoothstep(0, 1, 0.5)).toBe(0.5);
    });

    it('should clamp values outside range', () => {
      expect(smoothstep(0, 1, -1)).toBe(0);
      expect(smoothstep(0, 1, 2)).toBe(1);
    });
  });
});