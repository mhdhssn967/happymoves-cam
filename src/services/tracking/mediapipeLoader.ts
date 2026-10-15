import { MEDIAPIPE_CONFIG } from './config';
import { TrackerError } from './types';

type VisionModule = typeof import('@mediapipe/tasks-vision');
/** The library does not export this type, so derive it from the resolver. */
type WasmFileset = Awaited<ReturnType<VisionModule['FilesetResolver']['forVisionTasks']>>;

interface VisionRuntime {
  vision: VisionModule;
  fileset: WasmFileset;
}

let runtimePromise: Promise<VisionRuntime> | null = null;

/**
 * Loads the MediaPipe library and WASM runtime once and shares it between
 * trackers. The library is imported dynamically so it is only downloaded when
 * a camera module actually starts tracking.
 */
export function loadVisionRuntime(): Promise<VisionRuntime> {
  if (!runtimePromise) {
    runtimePromise = (async () => {
      try {
        const vision = await import('@mediapipe/tasks-vision');
        const fileset = await vision.FilesetResolver.forVisionTasks(MEDIAPIPE_CONFIG.wasmBaseUrl);
        return { vision, fileset };
      } catch (err) {
        runtimePromise = null; // allow a retry
        throw new TrackerError(
          'wasm-load-failed',
          err instanceof Error ? err.message : 'The tracking runtime could not be loaded.',
        );
      }
    })();
  }
  return runtimePromise;
}

/**
 * Prefers a locally hosted model file and falls back to the remote URL.
 * The dev server answers unknown paths with index.html (HTTP 200), so the
 * content type is checked as well as the status.
 */
export async function resolveModelUrl(local: string, remote: string): Promise<string> {
  try {
    const res = await fetch(local, { method: 'HEAD' });
    const type = res.headers.get('content-type') ?? '';
    if (res.ok && !type.includes('text/html')) return local;
  } catch {
    /* fall through to remote */
  }
  return remote;
}

/** Tries the GPU delegate first and silently falls back to CPU. */
export async function createWithDelegateFallback<T>(
  create: (delegate: 'GPU' | 'CPU') => Promise<T>,
): Promise<T> {
  try {
    return await create('GPU');
  } catch (gpuError) {
    console.warn('[tracking] GPU delegate unavailable, falling back to CPU.', gpuError);
    try {
      return await create('CPU');
    } catch (err) {
      throw new TrackerError(
        'model-load-failed',
        err instanceof Error ? err.message : 'The tracking model could not be loaded.',
      );
    }
  }
}
