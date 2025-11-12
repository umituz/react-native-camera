/**
 * Camera Domain - Camera Service
 *
 * Service for advanced camera operations using expo-camera.
 * Provides real-time camera preview, photo/video capture, and camera control.
 *
 * NOTE: This service provides camera configuration and utilities.
 * The actual CameraView component is used in the presentation layer.
 */

import { Camera } from 'expo-camera';
import type {
  CameraType,
  FlashMode,
  AutoFocus,
  CameraMode,
  VideoQuality,
  CameraRatio,
  CameraConfig,
  CameraPermissionResult,
  PictureTakeOptions,
  VideoRecordOptions,
} from '../../domain/entities/Camera';
import { CAMERA_CONSTANTS, CameraUtils } from '../../domain/entities/Camera';

/**
 * Camera service for expo-camera operations
 */
export class CameraService {
  /**
   * Request camera permission
   */
  static async requestCameraPermission(): Promise<CameraPermissionResult> {
    try {
      const { status, canAskAgain, granted } = await Camera.requestCameraPermissionsAsync();

      return {
        granted,
        canAskAgain,
        status: status as 'granted' | 'denied' | 'undetermined',
      };
    } catch (error) {
      return {
        granted: false,
        canAskAgain: false,
        status: 'denied',
      };
    }
  }

  /**
   * Request microphone permission (for video recording)
   */
  static async requestMicrophonePermission(): Promise<CameraPermissionResult> {
    try {
      const { status, canAskAgain, granted } = await Camera.requestMicrophonePermissionsAsync();

      return {
        granted,
        canAskAgain,
        status: status as 'granted' | 'denied' | 'undetermined',
      };
    } catch (error) {
      return {
        granted: false,
        canAskAgain: false,
        status: 'denied',
      };
    }
  }

  /**
   * Get camera permission status
   */
  static async getCameraPermissionStatus(): Promise<CameraPermissionResult> {
    try {
      const { status, canAskAgain, granted } = await Camera.getCameraPermissionsAsync();

      return {
        granted,
        canAskAgain,
        status: status as 'granted' | 'denied' | 'undetermined',
      };
    } catch (error) {
      return {
        granted: false,
        canAskAgain: false,
        status: 'denied',
      };
    }
  }

  /**
   * Get microphone permission status
   */
  static async getMicrophonePermissionStatus(): Promise<CameraPermissionResult> {
    try {
      const { status, canAskAgain, granted } = await Camera.getMicrophonePermissionsAsync();

      return {
        granted,
        canAskAgain,
        status: status as 'granted' | 'denied' | 'undetermined',
      };
    } catch (error) {
      return {
        granted: false,
        canAskAgain: false,
        status: 'denied',
      };
    }
  }

  /**
   * Check if device has camera
   */
  static async isAvailable(): Promise<boolean> {
    try {
      const available = await Camera.isAvailableAsync();
      return available;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get available camera types
   */
  static async getAvailableCameraTypes(): Promise<CameraType[]> {
    try {
      const types = await Camera.getAvailableCameraTypesAsync();
      return types as CameraType[];
    } catch (error) {
      return [];
    }
  }

  /**
   * Create default camera configuration
   */
  static getDefaultConfig(): CameraConfig {
    return {
      facing: CAMERA_CONSTANTS.DEFAULT_FACING,
      flash: CAMERA_CONSTANTS.DEFAULT_FLASH,
      zoom: CAMERA_CONSTANTS.DEFAULT_ZOOM,
      autofocus: CAMERA_CONSTANTS.DEFAULT_AUTOFOCUS,
      mode: CAMERA_CONSTANTS.DEFAULT_MODE,
      ratio: CAMERA_CONSTANTS.DEFAULT_RATIO,
      enableTorch: false,
      videoQuality: CAMERA_CONSTANTS.VIDEO_QUALITY.HIGH,
    };
  }

  /**
   * Get default picture options
   */
  static getDefaultPictureOptions(): PictureTakeOptions {
    return {
      quality: CAMERA_CONSTANTS.DEFAULT_QUALITY,
      base64: false,
      exif: true,
      skipProcessing: false,
      imageType: 'jpg',
    };
  }

  /**
   * Get default video options
   */
  static getDefaultVideoOptions(): VideoRecordOptions {
    return {
      maxDuration: 30,
      quality: CAMERA_CONSTANTS.VIDEO_QUALITY.HIGH,
      mirror: false,
      mute: false,
    };
  }

  /**
   * Validate and adjust camera configuration
   */
  static validateConfig(config: Partial<CameraConfig>): CameraConfig {
    const defaults = CameraService.getDefaultConfig();

    return {
      facing: config.facing || defaults.facing,
      flash: config.flash || defaults.flash,
      zoom: config.zoom !== undefined ? CameraUtils.validateZoom(config.zoom) : defaults.zoom,
      autofocus: config.autofocus || defaults.autofocus,
      mode: config.mode || defaults.mode,
      ratio: config.ratio || defaults.ratio,
      enableTorch: config.enableTorch ?? defaults.enableTorch,
      videoQuality: config.videoQuality || defaults.videoQuality,
    };
  }

  /**
   * Validate picture options
   */
  static validatePictureOptions(options?: Partial<PictureTakeOptions>): PictureTakeOptions {
    const defaults = CameraService.getDefaultPictureOptions();

    if (!options) return defaults;

    return {
      quality: options.quality !== undefined ? CameraUtils.validateQuality(options.quality) : defaults.quality,
      base64: options.base64 ?? defaults.base64,
      exif: options.exif ?? defaults.exif,
      skipProcessing: options.skipProcessing ?? defaults.skipProcessing,
      imageType: options.imageType || defaults.imageType,
    };
  }

  /**
   * Validate video options
   */
  static validateVideoOptions(options?: Partial<VideoRecordOptions>): VideoRecordOptions {
    const defaults = CameraService.getDefaultVideoOptions();

    if (!options) return defaults;

    return {
      maxDuration: options.maxDuration || defaults.maxDuration,
      quality: options.quality || defaults.quality,
      mirror: options.mirror ?? defaults.mirror,
      mute: options.mute ?? defaults.mute,
    };
  }
}

