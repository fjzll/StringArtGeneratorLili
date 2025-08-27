/**
 * Tests for array utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  getSum,
  subtractArraysWithClamping,
  subtractArrays,
  addThreeArrays,
  createFilledArray,
  range,
  argMax,
  argMin,
} from '../../src/lib/math/arrays';

describe('Array Utilities', () => {
  describe('getSum', () => {
    it('should calculate sum of array elements', () => {
      expect(getSum([1, 2, 3, 4, 5])).toBe(15);
      expect(getSum([0, 0, 0])).toBe(0);
      expect(getSum([-1, 1, -2, 2])).toBe(0);
    });

    it('should handle empty array', () => {
      expect(getSum([])).toBe(0);
    });

    it('should work with typed arrays', () => {
      const arr = new Uint8Array([1, 2, 3, 4]);
      expect(getSum(arr)).toBe(10);
    });
  });

  describe('subtractArraysWithClamping', () => {
    it('should subtract arrays with clamping', () => {
      const arr1 = new Uint8Array([100, 200, 50]);
      const arr2 = new Uint8Array([50, 250, 100]);
      
      const result = subtractArraysWithClamping(arr1, arr2);
      
      expect(result[0]).toBe(50);  // 100 - 50 = 50
      expect(result[1]).toBe(0);   // 200 - 250 = -50, clamped to 0
      expect(result[2]).toBe(0);   // 50 - 100 = -50, clamped to 0
    });

    it('should clamp values above 255', () => {
      const arr1 = new Float32Array([300, 400]);
      const arr2 = new Float32Array([50, 50]);
      
      const result = subtractArraysWithClamping(arr1, arr2);
      
      expect(result[0]).toBe(250); // 300 - 50 = 250
      expect(result[1]).toBe(255); // 400 - 50 = 350, clamped to 255
    });
  });

  describe('subtractArrays', () => {
    it('should subtract arrays without clamping', () => {
      const arr1 = [10, 20, 30];
      const arr2 = [5, 15, 35];
      
      const result = subtractArrays(arr1, arr2);
      
      expect(result).toEqual([5, 5, -5]);
    });

    it('should handle different length arrays', () => {
      const arr1 = [10, 20, 30, 40];
      const arr2 = [5, 15];
      
      const result = subtractArrays(arr1, arr2);
      
      expect(result).toEqual([5, 5]);
    });
  });

  describe('addThreeArrays', () => {
    it('should add three arrays element-wise', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [4, 5, 6];
      const arr3 = [7, 8, 9];
      
      const result = addThreeArrays(arr1, arr2, arr3);
      
      expect(result).toEqual([12, 15, 18]);
    });

    it('should handle different length arrays', () => {
      const arr1 = [1, 2, 3, 4];
      const arr2 = [1, 1];
      const arr3 = [2, 2, 2];
      
      const result = addThreeArrays(arr1, arr2, arr3);
      
      expect(result).toHaveLength(2);
      expect(result).toEqual([4, 5]);
    });
  });

  describe('createFilledArray', () => {
    it('should create array filled with specific value', () => {
      const result = createFilledArray(5, 42);
      
      expect(result).toHaveLength(5);
      expect(result.every(x => x === 42)).toBe(true);
    });

    it('should handle zero length', () => {
      const result = createFilledArray(0, 1);
      expect(result).toEqual([]);
    });
  });

  describe('range', () => {
    it('should create range of numbers', () => {
      expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
      expect(range(1, 4)).toEqual([1, 2, 3]);
    });

    it('should handle custom step', () => {
      expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
      expect(range(1, 8, 3)).toEqual([1, 4, 7]);
    });

    it('should handle empty range', () => {
      expect(range(5, 5)).toEqual([]);
      expect(range(5, 3)).toEqual([]);
    });
  });

  describe('argMax', () => {
    it('should find index of maximum value', () => {
      expect(argMax([1, 3, 2, 5, 4])).toBe(3);
      expect(argMax([10, 5, 2])).toBe(0);
      expect(argMax([1, 2, 2, 1])).toBe(1); // First occurrence
    });

    it('should handle empty array', () => {
      expect(argMax([])).toBe(-1);
    });

    it('should handle single element', () => {
      expect(argMax([42])).toBe(0);
    });
  });

  describe('argMin', () => {
    it('should find index of minimum value', () => {
      expect(argMin([1, 3, 2, 5, 4])).toBe(0);
      expect(argMin([10, 5, 2])).toBe(2);
      expect(argMin([3, 1, 1, 2])).toBe(1); // First occurrence
    });

    it('should handle empty array', () => {
      expect(argMin([])).toBe(-1);
    });

    it('should handle single element', () => {
      expect(argMin([42])).toBe(0);
    });
  });
});