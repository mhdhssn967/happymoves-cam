import { useRef, useState } from 'react';
import { Camera, VideoOff, Hand, PersonStanding, CheckCircle2, Info } from 'lucide-react';
import { CameraPill, CameraView } from '@/components/camera/CameraView';
import { CameraBusy, CameraErrorOverlay, CameraPermissionPrompt } from '@/components/camera/CameraOverlays';
import { useCamera } from '@/hooks/useCamera';
import { useTracker } from '@/hooks/useTracker';
import { describeCameraError } from '@/services/camera/errorMessages';
import { describeTrackerError } from '@/services/tracking/errorMessages';
import type { TrackerKind } from '@/services/tracking/types';
import { MetricsPanel } from './components/MetricsPanel';
import './tracking-demo.css';

export default function CameraTrackingModule() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [kind, setKind] = useState<TrackerKind>('hands');

  const camera = useCamera(videoRef);
  const cameraActive = camera.status === 'active';
  const tracker = useTracker({ kind, videoRef, canvasRef, enabled: cameraActive });

  const tracking = cameraActive && tracker.status === 'running';
  const nothingDetected = tracking && (kind === 'hands' ? !tracker.frame?.hands?.length : !tracker.frame?.pose);

  let overlay: React.ReactNode = null;
  if (camera.status === 'idle') {
    overlay = <CameraPermissionPrompt onEnable={() => void camera.start(camera.deviceId)} />;
  } else if (camera.status === 'starting') {
    overlay = <CameraBusy label="Waiting for camera… choose “Allow” in the browser prompt." />;
  } else if (camera.status === 'error' && camera.error) {
    overlay = (
      <CameraErrorOverlay guidance={describeCameraError(camera.error)} onRetry={() => void camera.start(camera.deviceId)} />
    );
  } else if (tracker.status === 'loading') {
    overlay = <CameraBusy label="Loading tracking model…" />;
  } else if (tracker.status === 'error' && tracker.error) {
    overlay = <CameraErrorOverlay guidance={describeTrackerError(tracker.error)} onRetry={tracker.retry} />;
  }

  return (
    <div className="module-view-flow camera-demo-flow">
      {/* Title & Instructions Header (Screen 5) */}
      <div className="module-intro">
        <h1 className="module-intro__title">Hand Opening and Closing</h1>
        <p className="module-intro__desc">
          Use your webcam to track your hands and complete the exercise.
        </p>
      </div>

      {/* Segmented Mode Switcher (Screen 5: [ Hand Mode ] [ Pose Mode ]) */}
      <div className="mode-segmented-control" role="tablist" aria-label="Tracking Mode">
        <button
          type="button"
          role="tab"
          aria-selected={kind === 'hands'}
          className={`mode-segmented-btn ${kind === 'hands' ? 'mode-segmented-btn--active' : ''}`}
          onClick={() => setKind('hands')}
        >
          <Hand size={17} />
          <span>Hand Mode</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={kind === 'pose'}
          className={`mode-segmented-btn ${kind === 'pose' ? 'mode-segmented-btn--active' : ''}`}
          onClick={() => setKind('pose')}
        >
          <PersonStanding size={18} />
          <span>Pose Mode</span>
        </button>
      </div>

      {/* Webcam Viewport Container (Screen 5) */}
      <div className="camera-viewport-card">
        <CameraView
          videoRef={videoRef}
          canvasRef={canvasRef}
          live={cameraActive}
          overlay={overlay}
          badges={
            tracking ? (
              <>
                <CameraPill>Tracking · {tracker.fps} FPS</CameraPill>
                <CameraPill warn={nothingDetected}>{kind === 'hands' ? 'Hands' : 'Pose'}</CameraPill>
              </>
            ) : undefined
          }
          hint={
            nothingDetected ? (
              <CameraPill warn>{kind === 'hands' ? 'No hand detected' : 'No person detected'}</CameraPill>
            ) : undefined
          }
        />
      </div>

      {/* Camera Access Info Hint (Screen 5) */}
      {!cameraActive && (
        <div className="camera-info-hint">
          <Info size={18} className="camera-info-hint__icon" />
          <span>Camera access will be requested when you click start.</span>
        </div>
      )}

      {/* Large Primary Action Button (Screen 5: "Start" / "Stop Camera") */}
      <div className="camera-action-container">
        {cameraActive ? (
          <button
            type="button"
            className="btn btn--danger btn--full btn--lg"
            onClick={camera.stop}
          >
            <VideoOff size={18} />
            <span>Stop Camera</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--primary btn--full btn--lg"
            onClick={() => void camera.start(camera.deviceId)}
            disabled={camera.status === 'starting'}
          >
            <Camera size={18} />
            <span>Start</span>
          </button>
        )}
      </div>

      {/* Patient Tips Checklist Card (Screen 5) */}
      <div className="patient-tips-card">
        <ul className="patient-tips-list">
          <li className="patient-tips-item">
            <CheckCircle2 size={18} className="patient-tips-icon" />
            <span>Keep your whole hand in frame</span>
          </li>
          <li className="patient-tips-item">
            <CheckCircle2 size={18} className="patient-tips-icon" />
            <span>Good lighting helps tracking</span>
          </li>
          <li className="patient-tips-item">
            <CheckCircle2 size={18} className="patient-tips-icon" />
            <span>Make sure your face is visible</span>
          </li>
        </ul>
      </div>

      {/* Real-time Telemetry / Measurements Strip */}
      {tracking && (
        <section className="live-metrics-section">
          <div className="live-metrics-header">
            <span style={{ fontWeight: 600 }}>
              {kind === 'hands' ? 'Live Hand Openness' : 'Live Joint Angles'}
            </span>
            <span className="badge badge--available">Tracking Active</span>
          </div>
          <MetricsPanel kind={kind} frame={tracker.frame} tracking={tracking} />
        </section>
      )}
    </div>
  );
}
