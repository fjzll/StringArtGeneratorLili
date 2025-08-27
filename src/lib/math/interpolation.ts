/**
 * Interpolation utility functions
 * Extracted from the original implementation
 */

/**
 * Generate linearly spaced numbers between two values
 * Extracted from the original linspace function
 */
export function linspace(start: number, stop: number, num?: number): number[] {
  const n = typeof num === 'undefined' ? Math.max(Math.round(stop - start) + 1, 1) : num;
  
  if (n < 2) {
    return n === 1 ? [start] : [];
  }
  
  const result: number[] = new Array(n);
  const step = (stop - start) / (n - 1);
  
  for (let i = 0; i < n; i++) {
    result[i] = Math.floor(start + step * i);
  }
  
  return result;
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Inverse linear interpolation - find t value for a given interpolated value
 */
export function inverseLerp(start: number, end: number, value: number): number {
  if (start === end) return 0;
  return (value - start) / (end - start);
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Smooth step interpolation (cubic hermite interpolation)
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Bi-linear interpolation for 2D values
 */
export function bilinearInterpolation(
  x: number,
  y: number,
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  q11: number,
  q12: number,
  q21: number,
  q22: number
): number {
  const r1 = lerp(q11, q21, (x - x1) / (x2 - x1));
  const r2 = lerp(q12, q22, (x - x1) / (x2 - x1));
  return lerp(r1, r2, (y - y1) / (y2 - y1));
}