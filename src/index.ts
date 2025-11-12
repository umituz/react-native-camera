/**
 * @umituz/react-native-camera - Public API
 *
 * Advanced camera control for React Native apps
 * Real-time preview, photo/video capture, QR/barcode scanning, face detection
 *
 * Usage:
 *   import { useCamera, useBarcodeScanner, CameraService, BarcodeScannerService } from '@umituz/react-native-camera';
 *   import { CameraView } from 'expo-camera';
 */

// =============================================================================
// DOMAIN LAYER - Entities
// =============================================================================

export type {
  CameraType,
  FlashMode,
  AutoFocus,
  CameraMode,
  VideoQuality,
  CameraRatio,
  PictureTakeOptions,
  VideoRecordOptions,
  CameraPicture,
  CameraVideo,
  BarcodeScannedResult,
  FaceDetectionResult,
  DetectedFace,
  CameraPermissionResult,
  CameraConfig,
} from './domain/entities/Camera';

export {
  BarcodeType,
  CAMERA_CONSTANTS,
  CameraUtils,
} from './domain/entities/Camera';

// =============================================================================
// INFRASTRUCTURE LAYER - Services
// =============================================================================

export { CameraService } from './infrastructure/services/CameraService';
export {
  BarcodeScannerService,
  type BarcodeScannerConfig,
  type BarcodeValidationResult,
} from './infrastructure/services/BarcodeScannerService';

// =============================================================================
// PRESENTATION LAYER - Hooks
// =============================================================================

export {
  useCamera,
  type UseCameraReturn,
} from './presentation/hooks/useCamera';

export {
  useBarcodeScanner,
  useQRScanner,
  useProductBarcodeScanner,
  type UseBarcodeScannerReturn,
  type BarcodeScannerOptions,
} from './presentation/hooks/useBarcodeScanner';

