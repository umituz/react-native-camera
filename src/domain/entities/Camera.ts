/**
 * Camera Domain - Core Entities
 *
 * This file defines core types and interfaces for advanced camera operations.
 * Handles camera control using expo-camera with real-time preview, barcode scanning,
 * and face detection capabilities.
 */

/**
 * Camera type (front/back)
 */
export type CameraType = 'front' | 'back';

/**
 * Camera flash mode
 */
export type FlashMode = 'on' | 'off' | 'auto';

/**
 * Camera focus mode
 */
export type AutoFocus = 'on' | 'off';

/**
 * Camera mode (picture/video)
 */
export type CameraMode = 'picture' | 'video';

/**
 * Video quality options
 */
export type VideoQuality = '2160p' | '1080p' | '720p' | '480p';

/**
 * Camera ratio options
 */
export type CameraRatio = '4:3' | '16:9' | '1:1';

/**
 * Picture capture options
 */
export interface PictureTakeOptions {
  quality?: number; // 0-1
  base64?: boolean;
  exif?: boolean;
  skipProcessing?: boolean;
  imageType?: 'jpg' | 'png';
}

/**
 * Video recording options
 */
export interface VideoRecordOptions {
  maxDuration?: number; // seconds
  quality?: VideoQuality;
  mirror?: boolean;
  mute?: boolean;
}

/**
 * Captured picture result
 */
export interface CameraPicture {
  uri: string;
  width: number;
  height: number;
  base64?: string;
  exif?: Record<string, any>;
}

/**
 * Recorded video result
 */
export interface CameraVideo {
  uri: string;
  duration?: number;
}

/**
 * Barcode type
 */
export enum BarcodeType {
  QR = 'qr',
  PDF417 = 'pdf417',
  AZTEC = 'aztec',
  CODE_39 = 'code39',
  CODE_93 = 'code93',
  CODE_128 = 'code128',
  DATA_MATRIX = 'datamatrix',
  EAN_8 = 'ean8',
  EAN_13 = 'ean13',
  ITF = 'itf14',
  UPC_E = 'upc_e',
  UPC_A = 'upc_a',
}

/**
 * Barcode scanning result
 */
export interface BarcodeScannedResult {
  type: string;
  data: string;
  bounds?: {
    origin: { x: number; y: number };
    size: { width: number; height: number };
  };
  cornerPoints?: Array<{ x: number; y: number }>;
}

/**
 * Face detection result
 */
export interface FaceDetectionResult {
  faces: DetectedFace[];
}

/**
 * Detected face data
 */
export interface DetectedFace {
  bounds: {
    origin: { x: number; y: number };
    size: { width: number; height: number };
  };
  rollAngle?: number;
  yawAngle?: number;
  faceID?: number;
  leftEyeOpenProbability?: number;
  rightEyeOpenProbability?: number;
  smilingProbability?: number;
}

/**
 * Camera permission result
 */
export interface CameraPermissionResult {
  granted: boolean;
  canAskAgain: boolean;
  status: 'granted' | 'denied' | 'undetermined';
}

/**
 * Camera configuration
 */
export interface CameraConfig {
  facing: CameraType;
  flash: FlashMode;
  zoom: number; // 0-1
  autofocus: AutoFocus;
  mode: CameraMode;
  ratio?: CameraRatio;
  enableTorch: boolean;
  videoQuality?: VideoQuality;
}

/**
 * Camera constants
 */
export const CAMERA_CONSTANTS = {
  DEFAULT_QUALITY: 0.8,
  DEFAULT_ZOOM: 0,
  DEFAULT_FACING: 'back' as CameraType,
  DEFAULT_FLASH: 'off' as FlashMode,
  DEFAULT_AUTOFOCUS: 'on' as AutoFocus,
  DEFAULT_MODE: 'picture' as CameraMode,
  DEFAULT_RATIO: '4:3' as CameraRatio,
  VIDEO_QUALITY: {
    LOW: '480p' as VideoQuality,
    MEDIUM: '720p' as VideoQuality,
    HIGH: '1080p' as VideoQuality,
    ULTRA: '2160p' as VideoQuality,
  },
} as const;

/**
 * Camera utilities
 */
export class CameraUtils {
  /**
   * Validate zoom level (0-1)
   */
  static validateZoom(zoom: number): number {
    return Math.max(0, Math.min(1, zoom));
  }

  /**
   * Validate quality (0-1)
   */
  static validateQuality(quality: number): number {
    return Math.max(0, Math.min(1, quality));
  }

  /**
   * Get opposite camera type
   */
  static getOppositeFacing(facing: CameraType): CameraType {
    return facing === 'back' ? 'front' : 'back';
  }

  /**
   * Parse barcode type to enum
   */
  static parseBarcodeType(type: string): BarcodeType | null {
    const upperType = type.toUpperCase();
    const enumValues = Object.values(BarcodeType);
    const match = enumValues.find(v => v.toUpperCase() === upperType);
    return match || null;
  }

  /**
   * Check if barcode type is QR code
   */
  static isQRCode(type: string): boolean {
    return type.toLowerCase() === 'qr';
  }

  /**
   * Format barcode data based on type
   */
  static formatBarcodeData(type: string, data: string): string {
    if (CameraUtils.isQRCode(type)) {
      // QR code might be URL, plain text, etc.
      try {
        new URL(data);
        return `URL: ${data}`;
      } catch {
        return data;
      }
    }
    // For product barcodes (EAN, UPC, etc.)
    return `Barcode: ${data}`;
  }

  /**
   * Calculate aspect ratio from ratio string
   */
  static getAspectRatio(ratio: CameraRatio): number {
    const parts = ratio.split(':').map(Number);
    return parts[0] / parts[1];
  }
}

