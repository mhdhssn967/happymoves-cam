import type { ReactNode } from 'react';
import { Camera, CameraOff, LoaderCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui';
import type { ErrorGuidance } from '@/services/camera/errorMessages';
import './camera.css';

/** Shown before the camera starts: explains why access is needed, then asks. */
export function CameraPermissionPrompt({ onEnable }: { onEnable: () => void }) {
  return (
    <div className="camera-view__overlay">
      <div className="camera-view__overlay-inner">
        <span className="camera-view__glyph"><Camera size={30} aria-hidden="true" /></span>
        <h3>Enable the camera to begin</h3>
        <p>
          Your browser will ask for permission. Video is analysed on this device only and is never recorded or
          uploaded.
        </p>
        <Button variant="success" size="lg" glow onClick={onEnable} icon={<Camera size={18} aria-hidden="true" />}>
          Enable Camera & Begin
        </Button>
        <p className="camera-view__hints" style={{ listStyle: 'none', padding: 0 }}>
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <ShieldCheck size={16} aria-hidden="true" /> Stand about 1.5–2 m away with your upper body in view.
          </span>
        </p>
      </div>
    </div>
  );
}

/** Translucent busy state shown while the camera or model is starting. */
export function CameraBusy({ label }: { label: string }) {
  return (
    <div className="camera-view__overlay camera-view__overlay--translucent" role="status" aria-live="polite">
      <div className="camera-view__overlay-inner">
        <LoaderCircle size={34} className="spinner-icon" aria-hidden="true" style={{ animation: 'spin 1s linear infinite' }} />
        <p>{label}</p>
      </div>
    </div>
  );
}

/** Error state with guidance and a retry button. */
export function CameraErrorOverlay({ guidance, onRetry, extra }: { guidance: ErrorGuidance; onRetry: () => void; extra?: ReactNode }) {
  return (
    <div className="camera-view__overlay" role="alert">
      <div className="camera-view__overlay-inner">
        <span className="camera-view__glyph" style={{ background: 'rgba(248,113,113,0.16)', color: '#fca5a5' }}>
          <CameraOff size={30} aria-hidden="true" />
        </span>
        <h3>{guidance.title}</h3>
        <p>{guidance.message}</p>
        <ul className="camera-view__hints">
          {guidance.hints.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <Button variant="amber" onClick={onRetry} icon={<RefreshCw size={18} aria-hidden="true" />}>
          Try again
        </Button>
        {extra}
      </div>
    </div>
  );
}
