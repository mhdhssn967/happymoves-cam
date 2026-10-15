import type { ErrorGuidance } from '@/services/camera/errorMessages';
import type { TrackerError } from './types';

export function describeTrackerError(error: TrackerError): ErrorGuidance {
  switch (error.code) {
    case 'wasm-load-failed':
      return {
        title: 'Tracking engine could not load',
        message: 'The MediaPipe runtime files could not be loaded.',
        hints: [
          'Check your network connection and press “Try again”.',
          'Make sure the files in public/mediapipe/wasm are being served.',
        ],
      };
    case 'model-load-failed':
      return {
        title: 'Tracking model could not load',
        message: 'The pose / hand model file could not be downloaded or started.',
        hints: [
          'Check your internet connection and press “Try again”.',
          'For offline clinics, place the .task model files in public/models (see public/models/README.md).',
          'If it keeps failing, try a different browser; some devices do not support GPU acceleration.',
        ],
      };
    default:
      return {
        title: 'Tracking stopped unexpectedly',
        message: error.message,
        hints: ['Press “Try again”. If it keeps happening, reload the page.'],
      };
  }
}
