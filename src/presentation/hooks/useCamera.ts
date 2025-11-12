/**
 * Camera Domain - useCamera Hook
 *
 * React hook for advanced camera operations.
 * Provides camera configuration, permissions, and photo/video capture.
 */

import { useState, useCallback, useRef } from 'react';
import { CameraService } from '../../infrastructure/services/CameraService';
import type {
  CameraType,
  FlashMode,
  AutoFocus,
  CameraMode,
  CameraRatio,
  CameraConfig,
  CameraPermissionResult,
  PictureTakeOptions,
  VideoRecordOptions,
  CameraPicture,
  CameraVideo,
} from '../../domain/entities/Camera';
import { CameraUtils } from '../../domain/entities/Camera';

/**
 * useCamera hook return type
 */
export interface UseCameraReturn {
  // Configuration
  config: CameraConfig;
  setFacing: (facing: CameraType) => void;
  setFlash: (flash: FlashMode) => void;
  setZoom: (zoom: number) => void;
  setAutofocus: (autofocus: AutoFocus) => void;
  setMode: (mode: CameraMode) => void;
  setRatio: (ratio: CameraRatio) => void;
  toggleTorch: () => void;
  toggleFacing: () => void;

  // Permissions
  cameraPermission: CameraPermissionResult | null;
  microphonePermission: CameraPermissionResult | null;
  requestCameraPermission: () => Promise<boolean>;
  requestMicrophonePermission: () => Promise<boolean>;

  // Capture
  takePicture: (options?: PictureTakeOptions) => Promise<CameraPicture | null>;
  startRecording: (options?: VideoRecordOptions) => Promise<void>;
  stopRecording: () => Promise<CameraVideo | null>;
  isRecording: boolean;

  // State
  isReady: boolean;
  error: string | null;

  // Camera ref (for CameraView component)
  cameraRef: React.RefObject<any>;
}

/**
 * useCamera hook for camera operations
 *
 * USAGE:
 * ```typescript
 * const {
 *   config,
 *   cameraRef,
 *   toggleFacing,
 *   setFlash,
 *   takePicture,
 *   requestCameraPermission,
 * } = useCamera();
 *
 * // Request permission
 * useEffect(() => {
 *   requestCameraPermission();
 * }, []);
 *
 * // Take picture
 * const handleCapture = async () => {
 *   const photo = await takePicture({ quality: 0.9 });
 *   console.log('Photo URI:', photo?.uri);
 * };
 *
 * // Render camera
 * <CameraView
 *   ref={cameraRef}
 *   facing={config.facing}
 *   flash={config.flash}
 *   zoom={config.zoom}
 * />
 * ```
 */
export const useCamera = (initialConfig?: Partial<CameraConfig>): UseCameraReturn => {
  const cameraRef = useRef<any>(null);

  const [config, setConfig] = useState<CameraConfig>(() =>
    CameraService.validateConfig(initialConfig || {})
  );

  const [cameraPermission, setCameraPermission] = useState<CameraPermissionResult | null>(null);
  const [microphonePermission, setMicrophonePermission] = useState<CameraPermissionResult | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Set camera facing (front/back)
   */
  const setFacing = useCallback((facing: CameraType) => {
    setConfig(prev => ({ ...prev, facing }));
  }, []);

  /**
   * Set flash mode
   */
  const setFlash = useCallback((flash: FlashMode) => {
    setConfig(prev => ({ ...prev, flash }));
  }, []);

  /**
   * Set zoom level (0-1)
   */
  const setZoom = useCallback((zoom: number) => {
    const validatedZoom = CameraUtils.validateZoom(zoom);
    setConfig(prev => ({ ...prev, zoom: validatedZoom }));
  }, []);

  /**
   * Set autofocus mode
   */
  const setAutofocus = useCallback((autofocus: AutoFocus) => {
    setConfig(prev => ({ ...prev, autofocus }));
  }, []);

  /**
   * Set camera mode (picture/video)
   */
  const setMode = useCallback((mode: CameraMode) => {
    setConfig(prev => ({ ...prev, mode }));
  }, []);

  /**
   * Set camera ratio
   */
  const setRatio = useCallback((ratio: CameraRatio) => {
    setConfig(prev => ({ ...prev, ratio }));
  }, []);

  /**
   * Toggle torch (flashlight)
   */
  const toggleTorch = useCallback(() => {
    setConfig(prev => ({ ...prev, enableTorch: !prev.enableTorch }));
  }, []);

  /**
   * Toggle camera facing (front/back)
   */
  const toggleFacing = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      facing: CameraUtils.getOppositeFacing(prev.facing),
    }));
  }, []);

  /**
   * Request camera permission
   */
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      const result = await CameraService.requestCameraPermission();
      setCameraPermission(result);
      setIsReady(result.granted);
      return result.granted;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request camera permission';
      setError(errorMessage);
      return false;
    }
  }, []);

  /**
   * Request microphone permission (for video recording)
   */
  const requestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    try {
      const result = await CameraService.requestMicrophonePermission();
      setMicrophonePermission(result);
      return result.granted;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request microphone permission';
      setError(errorMessage);
      return false;
    }
  }, []);

  /**
   * Take picture
   */
  const takePicture = useCallback(
    async (options?: PictureTakeOptions): Promise<CameraPicture | null> => {
      setError(null);

      if (!cameraRef.current) {
        setError('Camera not ready');
        return null;
      }

      try {
        const validatedOptions = CameraService.validatePictureOptions(options);
        const photo = await cameraRef.current.takePictureAsync(validatedOptions);
        return photo;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to take picture';
        setError(errorMessage);
        return null;
      }
    },
    []
  );

  /**
   * Start video recording
   */
  const startRecording = useCallback(
    async (options?: VideoRecordOptions): Promise<void> => {
      setError(null);

      if (!cameraRef.current) {
        setError('Camera not ready');
        return;
      }

      if (isRecording) {
        setError('Already recording');
        return;
      }

      try {
        const validatedOptions = CameraService.validateVideoOptions(options);
        setIsRecording(true);
        await cameraRef.current.recordAsync(validatedOptions);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
        setError(errorMessage);
        setIsRecording(false);
      }
    },
    [isRecording]
  );

  /**
   * Stop video recording
   */
  const stopRecording = useCallback(async (): Promise<CameraVideo | null> => {
    setError(null);

    if (!cameraRef.current) {
      setError('Camera not ready');
      return null;
    }

    if (!isRecording) {
      setError('Not recording');
      return null;
    }

    try {
      cameraRef.current.stopRecording();
      setIsRecording(false);
      return null; // Video result is returned from recordAsync promise
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop recording';
      setError(errorMessage);
      setIsRecording(false);
      return null;
    }
  }, [isRecording]);

  return {
    // Configuration
    config,
    setFacing,
    setFlash,
    setZoom,
    setAutofocus,
    setMode,
    setRatio,
    toggleTorch,
    toggleFacing,

    // Permissions
    cameraPermission,
    microphonePermission,
    requestCameraPermission,
    requestMicrophonePermission,

    // Capture
    takePicture,
    startRecording,
    stopRecording,
    isRecording,

    // State
    isReady,
    error,

    // Camera ref
    cameraRef,
  };
};

