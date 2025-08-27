/**
 * Types for canvas operations and rendering
 */

export type CanvasContext = CanvasRenderingContext2D | null;

export type CanvasDrawingStyle = {
  strokeStyle: string;
  lineWidth: number;
  lineCap: CanvasLineCap;
  lineJoin: CanvasLineJoin;
  globalCompositeOperation: GlobalCompositeOperation;
};

export type DrawingState = {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  scale: number;
};

export type LineDrawingOptions = {
  color: string;
  width: number;
  opacity?: number;
  antiAlias?: boolean;
};

export type CircleDrawingOptions = {
  centerX: number;
  centerY: number;
  radius: number;
  fill?: boolean;
  stroke?: boolean;
  fillColor?: string;
  strokeColor?: string;
  lineWidth?: number;
};

export type PinVisualization = {
  position: [number, number];
  index: number;
  isActive: boolean;
  isNext: boolean;
};

export type CanvasSize = {
  width: number;
  height: number;
  scaleFactor: number;
};