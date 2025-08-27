/**
 * Default configuration constants for String Art Generation
 * Extracted from the original implementation
 */

export const DEFAULT_CONFIG = {
  // Image processing
  IMG_SIZE: 500,
  SCALE: 20,
  
  // String art parameters
  N_PINS: 288, // 36 * 8
  MAX_LINES: 4000,
  LINE_WEIGHT: 20,
  MIN_DISTANCE: 20,
  MIN_LOOP: 20,
  
  // Physical measurements
  HOOP_DIAMETER: 0.625, // inches
  
  // Algorithm parameters
  OPTIMIZATION_BATCH_SIZE: 10, // How often to redraw during optimization
  CANVAS_SCALE_FACTOR: 2, // Scale factor for output canvas
} as const;

export const GRAYSCALE_WEIGHTS = {
  RED: 0.299,
  GREEN: 0.587,
  BLUE: 0.114,
} as const;

export const CANVAS_CONTEXTS = {
  ORIGINAL: 'canvasOutput',
  PROCESSED: 'canvasOutput2',
  INTERACTIVE: 'canvasOutput3',
} as const;

export type StringArtConfig = typeof DEFAULT_CONFIG;