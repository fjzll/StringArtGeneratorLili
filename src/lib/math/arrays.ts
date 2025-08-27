/**
 * Array utility functions for mathematical operations
 * Extracted from the original implementation
 */

/**
 * Calculate the sum of all elements in an array
 * Extracted from getSum function
 */
export function getSum(arr: ArrayLike<number>): number {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

/**
 * Subtract two arrays element-wise with clamping between 0-255
 * Extracted from subtractArrays function
 */
export function subtractArraysWithClamping(
  arr1: Float32Array | Uint8Array,
  arr2: Float32Array | Uint8Array
): Float32Array | Uint8Array {
  const result = new (arr1.constructor as any)(arr1.length);
  
  for (let i = 0; i < arr1.length; i++) {
    let value = arr1[i] - arr2[i];
    
    // Clamp between 0 and 255
    if (value < 0) {
      value = 0;
    } else if (value > 255) {
      value = 255;
    }
    
    result[i] = value;
  }
  
  return result;
}

/**
 * Simple array subtraction without clamping
 * Extracted from subtractArraysSimple function
 */
export function subtractArrays(
  arr1: number[],
  arr2: number[]
): number[] {
  const result: number[] = [];
  const minLength = Math.min(arr1.length, arr2.length);
  
  for (let i = 0; i < minLength; i++) {
    result[i] = arr1[i] - arr2[i];
  }
  
  return result;
}

/**
 * Add corresponding elements of three arrays
 * Extracted from AddRGB function
 */
export function addThreeArrays(
  arr1: ArrayLike<number>,
  arr2: ArrayLike<number>,
  arr3: ArrayLike<number>
): number[] {
  const minLength = Math.min(arr1.length, arr2.length, arr3.length);
  const result: number[] = new Array(minLength);
  
  for (let i = 0; i < minLength; i++) {
    result[i] = arr1[i] + arr2[i] + arr3[i];
  }
  
  return result;
}

/**
 * Create an array with a specific value repeated
 */
export function createFilledArray(length: number, value: number): number[] {
  return new Array(length).fill(value);
}

/**
 * Create a range array from start to end (exclusive)
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

/**
 * Find the index of the maximum value in an array
 */
export function argMax(arr: ArrayLike<number>): number {
  if (arr.length === 0) return -1;
  
  let maxIndex = 0;
  let maxValue = arr[0];
  
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxValue) {
      maxValue = arr[i];
      maxIndex = i;
    }
  }
  
  return maxIndex;
}

/**
 * Find the index of the minimum value in an array
 */
export function argMin(arr: ArrayLike<number>): number {
  if (arr.length === 0) return -1;
  
  let minIndex = 0;
  let minValue = arr[0];
  
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < minValue) {
      minValue = arr[i];
      minIndex = i;
    }
  }
  
  return minIndex;
}