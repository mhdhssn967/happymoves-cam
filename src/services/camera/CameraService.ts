export type CameraErrorCode =
  | 'unsupported'
  | 'insecure-context'
  | 'permission-denied'
  | 'no-device'
  | 'in-use'
  | 'overconstrained'
  | 'unknown';

export class CameraError extends Error {
  readonly code: CameraErrorCode;

  constructor(code: CameraErrorCode, message: string) {
    super(message);
    this.name = 'CameraError';
    this.code = code;
  }
}

export interface CameraStartOptions {
  deviceId?: string;
  width?: number;
  height?: number;
}

/** True when the browser exposes the camera API at all. */
export function isCameraSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
}

/** Maps the browser's DOMException names to a small, UI-friendly set of codes. */
export function classifyCameraError(err: unknown): CameraError {
  if (err instanceof CameraError) return err;

  if (!isCameraSupported()) {
    return typeof window !== 'undefined' && !window.isSecureContext
      ? new CameraError('insecure-context', 'Camera access requires a secure (HTTPS or localhost) page.')
      : new CameraError('unsupported', 'This browser does not support camera access.');
  }

  const name = err instanceof DOMException || err instanceof Error ? err.name : '';
  switch (name) {
    case 'NotAllowedError':
    case 'SecurityError':
    case 'PermissionDeniedError':
      return new CameraError('permission-denied', 'Camera permission was denied.');
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return new CameraError('no-device', 'No camera was found on this device.');
    case 'NotReadableError':
    case 'TrackStartError':
      return new CameraError('in-use', 'The camera is already in use by another application.');
    case 'OverconstrainedError':
    case 'ConstraintNotSatisfiedError':
      return new CameraError('overconstrained', 'The selected camera cannot provide the requested video.');
    default:
      return new CameraError('unknown', err instanceof Error ? err.message : 'The camera could not be started.');
  }
}

export async function listVideoDevices(): Promise<MediaDeviceInfo[]> {
  if (!navigator.mediaDevices?.enumerateDevices) return [];
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((d) => d.kind === 'videoinput');
}

/**
 * Owns one MediaStream and attaches it to a <video> element.
 * Framework-agnostic: React code uses it through the `useCamera` hook.
 */
export class CameraService {
  private stream: MediaStream | null = null;
  private video: HTMLVideoElement | null = null;

  get isActive(): boolean {
    return this.stream !== null;
  }

  async start(video: HTMLVideoElement, options: CameraStartOptions = {}): Promise<MediaStream> {
    this.stop();

    if (!isCameraSupported()) throw classifyCameraError(null);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          deviceId: options.deviceId ? { exact: options.deviceId } : undefined,
          facingMode: options.deviceId ? undefined : 'user',
          width: { ideal: options.width ?? 1280 },
          height: { ideal: options.height ?? 720 },
        },
      });
    } catch (err) {
      throw classifyCameraError(err);
    }

    this.stream = stream;
    this.video = video;
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;

    try {
      await video.play();
    } catch (err) {
      this.stop();
      throw classifyCameraError(err);
    }
    return stream;
  }

  /** Subscribe to the camera being unplugged or revoked while running. */
  onEnded(callback: () => void): () => void {
    const tracks = this.stream?.getVideoTracks() ?? [];
    tracks.forEach((t) => t.addEventListener('ended', callback));
    return () => tracks.forEach((t) => t.removeEventListener('ended', callback));
  }

  stop(): void {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    if (this.video) {
      this.video.pause();
      this.video.srcObject = null;
      this.video = null;
    }
  }
}
