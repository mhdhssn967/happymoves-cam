import { lazy } from 'react';
import { defineModule } from '@/core/types/module';

export default defineModule({
  id: 'camera-tracking-demo',
  title: 'Camera Tracking Demo',
  summary: 'Live MediaPipe hand tracking with open/close detection, plus a full-body pose mode.',
  categoryId: 'hand-gross-motor',
  activityId: 'hand-opening-and-closing',
  status: 'demo',
  requiresCamera: true,
  tracking: ['hands', 'pose'],
  component: lazy(() => import('./CameraTrackingModule')),
});
