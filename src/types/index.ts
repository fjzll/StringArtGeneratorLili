/**
 * Central exports for all TypeScript types used in the String Art Generator
 */

// Canvas types
export type {
  CanvasContext,
  CanvasDrawingStyle,
  DrawingState,
  LineDrawingOptions,
  CircleDrawingOptions,
  PinVisualization,
  CanvasSize,
} from './canvas';

// Image types
export type {
  ImageData2D,
  GrayscaleWeights,
  CropRegion,
  ProcessedImageData,
  ImageProcessingProgress,
  ImageUploadResult,
} from './image';

// String art types
export type {
  Point,
  PinCoordinate,
  StringArtParameters,
  LineCache,
  OptimizationState,
  OptimizationProgress,
  StringArtResult,
} from './stringArt';



// Content types
export type {
  TutorialStep,
  TutorialSection,
  GalleryExample,
  GallerySection,
  FAQItem,
  FAQSection,
  AppContent,
  ContentLoadState,
  AssetInfo,
} from './content';