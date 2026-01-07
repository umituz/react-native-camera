export type CameraType = "back" | "front";

export type FlashMode = "off" | "on" | "torch" | "auto";

export type VideoQuality =
    | "2160p"
    | "1080p"
    | "720p"
    | "480p"
    | "360p"
    | "4:3";

export type BarcodeType =
    | "aztec"
    | "code128"
    | "code39"
    | "code93"
    | "ean13"
    | "ean8"
    | "pdf417"
    | "qr"
    | "upc_a"
    | "upc_e"
    | "datamatrix";

export type CameraPermissionStatus = "granted" | "denied" | "not-determined";

export interface CameraPermissions {
    granted: boolean;
    canAskAgain: boolean;
    status: CameraPermissionStatus;
}

export interface PictureOptions {
    quality?: number;
    skipProcessing?: boolean;
    exif?: boolean;
}

export interface PictureResult {
    uri: string;
    width: number;
    height: number;
    exif?: Record<string, any> | null;
}

export interface VideoOptions {
    maxDuration?: number;
    maxFileSize?: number;
    mute?: boolean;
}

export interface VideoResult {
    uri: string;
}

export interface BarcodeData {
    type: BarcodeType;
    data: string;
    bounds?: {
        origin: { x: number; y: number };
        size: { width: number; height: number };
    };
}

export interface CameraError {
    code: string;
    message: string;
}

export interface CameraCapabilities {
    pictureSizes: string[];
    videoQualities: VideoQuality[];
    supportedBarcodeTypes: BarcodeType[];
    hasFlash: boolean;
    canToggleCamera: boolean;
}
