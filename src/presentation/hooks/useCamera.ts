import { useState, useCallback, useRef, useEffect } from "react";
import { CameraView } from "expo-camera";
import { cameraService, CameraRef } from "../../infrastructure/services/CameraService";
import {
    CameraType,
    FlashMode,
    CameraPermissions,
    PictureResult,
    PictureOptions,
    VideoResult,
    VideoOptions,
    CameraCapabilities,
} from "../../domain/entities/Camera";

export interface UseCameraResult {
    cameraRef: React.RefObject<CameraRef>;
    cameraType: CameraType;
    flashMode: FlashMode;
    permissions: CameraPermissions;
    isReady: boolean;
    capabilities: CameraCapabilities | null;
    setCameraType: (type: CameraType) => void;
    setFlashMode: (mode: FlashMode) => void;
    requestPermissions: () => Promise<CameraPermissions>;
    takePicture: (options?: PictureOptions) => Promise<PictureResult | null>;
    recordVideo: (options?: VideoOptions) => Promise<VideoResult | null>;
    stopRecording: () => void;
    isRecording: boolean;
}

export function useCamera(): UseCameraResult {
    const cameraRef = useRef<CameraRef>(null);
    const [cameraType, setCameraType] = useState<CameraType>("back");
    const [flashMode, setFlashMode] = useState<FlashMode>("off");
    const [permissions, setPermissions] = useState<CameraPermissions>({
        granted: false,
        canAskAgain: true,
        status: "not-determined",
    });
    const [isReady, setIsReady] = useState(false);
    const [capabilities, setCapabilities] = useState<CameraCapabilities | null>(null);
    const [isRecording, setIsRecording] = useState(false);

    const requestPermissions = useCallback(async (): Promise<CameraPermissions> => {
        const result = await cameraService.requestPermissions();
        setPermissions(result);

        if (result.granted) {
            const caps = await cameraService.getCameraCapabilities();
            setCapabilities(caps);
        }

        return result;
    }, []);

    const takePicture = useCallback(
        async (options?: PictureOptions): Promise<PictureResult | null> => {
            if (!permissions.granted) {
                console.warn("[useCamera] Permission not granted");
                return null;
            }

            try {
                cameraService.setCameraRef(cameraRef.current);
                const result = await cameraService.takePicture(options);
                return result;
            } catch (error) {
                console.error("[useCamera] Error taking picture:", error);
                return null;
            }
        },
        [permissions.granted]
    );

    const recordVideo = useCallback(
        async (options?: VideoOptions): Promise<VideoResult | null> => {
            if (!permissions.granted) {
                console.warn("[useCamera] Permission not granted");
                return null;
            }

            try {
                setIsRecording(true);
                cameraService.setCameraRef(cameraRef.current);
                const result = await cameraService.recordVideo(options);
                setIsRecording(false);
                return result;
            } catch (error) {
                console.error("[useCamera] Error recording video:", error);
                setIsRecording(false);
                return null;
            }
        },
        [permissions.granted]
    );

    const stopRecording = useCallback(() => {
        if (isRecording) {
            cameraService.stopRecording();
            setIsRecording(false);
        }
    }, [isRecording]);

    useEffect(() => {
        cameraService.setCameraRef(cameraRef.current);
    }, [cameraRef, cameraType, flashMode]);

    useEffect(() => {
        cameraService.isAvailable().then((available) => {
            setIsReady(available);

            if (available) {
                cameraService.getCameraCapabilities().then(setCapabilities);
            }
        });
    }, []);

    return {
        cameraRef,
        cameraType,
        flashMode,
        permissions,
        isReady,
        capabilities,
        setCameraType,
        setFlashMode,
        requestPermissions,
        takePicture,
        recordVideo,
        stopRecording,
        isRecording,
    };
}
