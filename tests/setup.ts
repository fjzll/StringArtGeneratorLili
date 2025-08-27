/**
 * Test setup configuration
 */

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock HTMLCanvasElement and CanvasRenderingContext2D for tests
class MockCanvasRenderingContext2D {
  canvas = { width: 500, height: 500 };
  fillStyle = '';
  strokeStyle = '';
  lineWidth = 1;
  globalCompositeOperation = 'source-over';

  // Mock canvas methods
  getImageData = vi.fn(() => ({
    data: new Uint8ClampedArray(500 * 500 * 4).fill(128),
    width: 500,
    height: 500,
  }));
  
  putImageData = vi.fn();
  createImageData = vi.fn((width: number, height: number) => ({
    data: new Uint8ClampedArray(width * height * 4),
    width,
    height,
  }));
  
  drawImage = vi.fn();
  beginPath = vi.fn();
  arc = vi.fn();
  closePath = vi.fn();
  fill = vi.fn();
  stroke = vi.fn();
  moveTo = vi.fn();
  lineTo = vi.fn();
  clearRect = vi.fn();
}

// Mock HTMLCanvasElement
class MockHTMLCanvasElement {
  width = 500;
  height = 500;
  
  getContext = vi.fn(() => new MockCanvasRenderingContext2D());
}

// Mock document.createElement for canvas
const originalCreateElement = document.createElement;
document.createElement = vi.fn((tagName: string) => {
  if (tagName === 'canvas') {
    return new MockHTMLCanvasElement() as any;
  }
  return originalCreateElement.call(document, tagName);
});

// Mock HTMLImageElement
class MockHTMLImageElement {
  width = 500;
  height = 500;
  src = '';
  onload: (() => void) | null = null;
  
  constructor() {
    // Simulate image loading
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 0);
  }
}

// Make MockHTMLImageElement available globally for tests
(globalThis as any).MockHTMLImageElement = MockHTMLImageElement;