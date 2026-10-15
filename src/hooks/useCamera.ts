import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { CameraError, CameraService, classifyCameraError, listVideoDevices } from '@/services/camera/CameraService';

export type CameraStatus = 'idle' | 'starting' | 'active' | 'error';

export interface UseCamera {
  status: CameraStatus;
  error: CameraError | null;
  devices: MediaDeviceInfo[];
  deviceId: string | undefined;
  /** Must be called from a user gesture so the permission prompt is allowed. */
  start: (deviceId?: string) => Promise<void>;
  stop: () => void;
  selectDevice: (deviceId: string) => Promise<void>;
}

/** React wrapper around CameraService. Releases the camera on unmount. */
export function useCamera(videoRef: RefObject<HTMLVideoElement | null>): UseCamera {
  const serviceRef = useRef<CameraService | null>(null);
  if (!serviceRef.current) serviceRef.current = new CameraService();

  const requestRef = useRef(0);
  const unsubscribeEndedRef = useRef<(() => void) | null>(null);

  const [status, setStatus] = useState<CameraStatus>('idle');
  const [error, setError] = useState<CameraError | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string | undefined>();

  const stop = useCallback(() => {
    requestRef.current += 1;
    unsubscribeEndedRef.current?.();
    unsubscribeEndedRef.current = null;
    serviceRef.current?.stop();
    setStatus('idle');
    setError(null);
  }, []);

  const start = useCallback(
    async (requestedDeviceId?: string) => {
      const video = videoRef.current;
      const service = serviceRef.current;
      if (!video || !service) return;

      const requestId = ++requestRef.current;
      unsubscribeEndedRef.current?.();
      setStatus('starting');
      setError(null);

      try {
        await service.start(video, { deviceId: requestedDeviceId });
        if (requestId !== requestRef.current) return; // superseded or stopped

        unsubscribeEndedRef.current = service.onEnded(() => {
          service.stop();
          setError(new CameraError('in-use', 'The camera was disconnected.'));
          setStatus('error');
        });

        setDeviceId(requestedDeviceId);
        setStatus('active');
        // Device labels are only available after permission has been granted.
        setDevices(await listVideoDevices());
      } catch (err) {
        if (requestId !== requestRef.current) return;
        setError(classifyCameraError(err));
        setStatus('error');
      }
    },
    [videoRef],
  );

  const selectDevice = useCallback((id: string) => start(id), [start]);

  useEffect(() => {
    const service = serviceRef.current;
    return () => {
      requestRef.current += 1;
      unsubscribeEndedRef.current?.();
      service?.stop();
    };
  }, []);

  return { status, error, devices, deviceId, start, stop, selectDevice };
}
