/**
 * Types for Web Worker communication
 */

import type { StringArtParameters, OptimizationProgress, StringArtResult } from './stringArt';
import type { ImageData2D } from './image';

export type WorkerMessageType = 
  | 'INIT'
  | 'START_PROCESSING'
  | 'PROGRESS_UPDATE'
  | 'PROCESSING_COMPLETE'
  | 'ERROR'
  | 'CANCEL';

export type BaseWorkerMessage = {
  id: string;
  type: WorkerMessageType;
  timestamp: number;
};

export type InitWorkerMessage = BaseWorkerMessage & {
  type: 'INIT';
  payload: {
    parameters: StringArtParameters;
    imageData: ImageData2D;
  };
};

export type StartProcessingMessage = BaseWorkerMessage & {
  type: 'START_PROCESSING';
};

export type ProgressUpdateMessage = BaseWorkerMessage & {
  type: 'PROGRESS_UPDATE';
  payload: OptimizationProgress;
};

export type ProcessingCompleteMessage = BaseWorkerMessage & {
  type: 'PROCESSING_COMPLETE';
  payload: StringArtResult;
};

export type ErrorMessage = BaseWorkerMessage & {
  type: 'ERROR';
  payload: {
    message: string;
    stack?: string;
    code?: string;
  };
};

export type CancelMessage = BaseWorkerMessage & {
  type: 'CANCEL';
};

export type WorkerMessage = 
  | InitWorkerMessage
  | StartProcessingMessage
  | ProgressUpdateMessage
  | ProcessingCompleteMessage
  | ErrorMessage
  | CancelMessage;

export type WorkerStatus = 'idle' | 'initializing' | 'processing' | 'completed' | 'error' | 'cancelled';

export type WorkerState = {
  status: WorkerStatus;
  progress?: OptimizationProgress;
  result?: StringArtResult;
  error?: string;
};