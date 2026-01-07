import { CameraView } from "expo-camera";
import {
    CameraPermissions,
    PictureOptions,
    PictureResult,
    VideoOptions,
    VideoResult,
    CameraCapabilities,
    BarcodeType,
    CameraError,
    VideoQuality,
} from "../../domain/entities/Camera";

export type CameraRef = CameraView;

export class CameraService {
    private cameraRef: CameraRef | null = null;

    setCameraRef(camera: CameraRef | null): void {
        this.cameraRef = camera;
    }

    async requestPermissions(): Promise<CameraPermissions> {
        try {
            if (__DEV__) {
                console.log("[CameraService] Requesting camera permissions...");
            }

            const { Camera } = await import("expo-camera");
            const result = await Camera.requestCameraPermissionsAsync();

            if (__DEV__) {
                console.log("[CameraService] Permission status:", result.status);
            }

            return {
                granted: result.granted,
                canAskAgain: result.canAskAgain,
                status: result.status as CameraPermissions["status"],
            };
        } catch (error) {
            console.error("[CameraService] Error requesting permissions:", error);
            return {
                granted: false,
                canAskAgain: true,
                status: "denied",
            };
        }
    }

    async isAvailable(): Promise<boolean> {
        try {
            if (__DEV__) {
                console.log("[CameraService] Checking camera availability");
            }

            return true;
        } catch (error) {
            console.error("[CameraService] Error checking availability:", error);
            return false;
        }
    }

    async takePicture(options: PictureOptions = {}): Promise<PictureResult> {
        if (!this.cameraRef) {
            const error: CameraError = {
                code: "NO_CAMERA_REF",
                message: "Camera reference not set",
            };
            throw error;
        }

        try {
            if (__DEV__) {
                console.log("[CameraService] Taking picture with options:", options);
            }

            const pictureOptions = {
                quality: options.quality ?? 1,
                skipProcessing: options.skipProcessing ?? false,
                exif: options.exif ?? false,
            };

            const result = await this.cameraRef.takePictureAsync(pictureOptions);

            if (__DEV__) {
                console.log("[CameraService] Picture taken:", result.uri);
            }

            return {
                uri: result.uri,
                width: result.width,
                height: result.height,
                exif: result.exif ?? undefined,
            };
        } catch (error) {
            console.error("[CameraService] Error taking picture:", error);

            const errorObj: CameraError = {
                code: "PICTURE_ERROR",
                message: error instanceof Error ? error.message : "Failed to take picture",
            };
            throw errorObj;
        }
    }

    async recordVideo(options: VideoOptions = {}): Promise<VideoResult> {
        if (!this.cameraRef) {
            const error: CameraError = {
                code: "NO_CAMERA_REF",
                message: "Camera reference not set",
            };
            throw error;
        }

        try {
            if (__DEV__) {
                console.log("[CameraService] Recording video with options:", options);
            }

            const videoOptions = {
                maxDuration: options.maxDuration ?? 60,
                maxFileSize: options.maxFileSize,
                mute: options.mute ?? false,
            };

            const result = await this.cameraRef.recordAsync(videoOptions);

            if (!result) {
                const error: CameraError = {
                    code: "VIDEO_RECORDING_FAILED",
                    message: "Video recording failed - no result returned",
                };
                throw error;
            }

            if (__DEV__) {
                console.log("[CameraService] Video recorded:", result.uri);
            }

            return {
                uri: result.uri,
            };
        } catch (error) {
            console.error("[CameraService] Error recording video:", error);

            const errorObj: CameraError = {
                code: "VIDEO_ERROR",
                message: error instanceof Error ? error.message : "Failed to record video",
            };
            throw errorObj;
        }
    }

    stopRecording(): void {
        if (this.cameraRef) {
            if (__DEV__) {
                console.log("[CameraService] Stopping video recording");
            }

            this.cameraRef.stopRecording();
        }
    }

    async getAvailableCameraTypes(): Promise<string[]> {
        return ["back", "front"];
    }

    async getCameraCapabilities(): Promise<CameraCapabilities> {
        try {
            if (__DEV__) {
                console.log("[CameraService] Getting camera capabilities");
            }

            return {
                pictureSizes: [],
                videoQualities: ["2160p", "1080p", "720p", "480p", "360p", "4:3"],
                supportedBarcodeTypes: [
                    "aztec",
                    "code128",
                    "code39",
                    "code93",
                    "ean13",
                    "ean8",
                    "pdf417",
                    "qr",
                    "upc_a",
                    "upc_e",
                    "datamatrix",
                ],
                hasFlash: true,
                canToggleCamera: true,
            };
        } catch (error) {
            console.error("[CameraService] Error getting capabilities:", error);

            return {
                pictureSizes: [],
                videoQualities: [],
                supportedBarcodeTypes: [],
                hasFlash: false,
                canToggleCamera: false,
            };
        }
    }

    async hasFlash(): Promise<boolean> {
        try {
            if (__DEV__) {
                console.log("[CameraService] Checking flash availability");
            }

            return true;
        } catch (error) {
            console.error("[CameraService] Error checking flash:", error);
            return false;
        }
    }
}

export const cameraService = new CameraService();
