import type { CameraError } from './CameraService';

export interface ErrorGuidance {
  title: string;
  message: string;
  hints: string[];
}

/** Clinician-friendly wording for each camera failure. Kept out of the UI components. */
export function describeCameraError(error: CameraError): ErrorGuidance {
  switch (error.code) {
    case 'permission-denied':
      return {
        title: 'Camera access is blocked',
        message: 'The browser was not allowed to use the camera.',
        hints: [
          'Click the camera or lock icon in the address bar and set Camera to “Allow”.',
          'Then press “Try again”. Reloading the page may be needed in some browsers.',
          'On managed clinic devices, ask your administrator whether camera access is restricted.',
        ],
      };
    case 'no-device':
      return {
        title: 'No camera found',
        message: 'No video input device is connected to this computer.',
        hints: ['Connect a webcam, or check that it is enabled in system settings.', 'Then press “Try again”.'],
      };
    case 'in-use':
      return {
        title: 'Camera is busy',
        message: 'Another application or browser tab is using the camera.',
        hints: ['Close other apps or tabs that use the camera (video calls, other browsers).', 'Then press “Try again”.'],
      };
    case 'overconstrained':
      return {
        title: 'Camera not compatible',
        message: 'The selected camera cannot provide the requested video settings.',
        hints: ['Choose a different camera from the list, then try again.'],
      };
    case 'insecure-context':
      return {
        title: 'Secure connection required',
        message: 'Browsers only allow camera access on HTTPS pages or on localhost.',
        hints: ['Open this application over HTTPS, or use http://localhost during development.'],
      };
    case 'unsupported':
      return {
        title: 'Browser not supported',
        message: 'This browser cannot access the camera.',
        hints: ['Use a current version of Chrome, Edge, Firefox or Safari.'],
      };
    default:
      return {
        title: 'Camera could not be started',
        message: error.message,
        hints: ['Press “Try again”. If the problem continues, reload the page.'],
      };
  }
}
