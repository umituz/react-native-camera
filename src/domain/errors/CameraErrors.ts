export class CameraError extends Error {
    constructor(
        public code: string,
        message: string,
        public details?: Record<string, any>
    ) {
        super(message);
        this.name = "CameraError";
    }
}

export class PermissionDeniedError extends CameraError {
    constructor(details?: Record<string, any>) {
        super("PERMISSION_DENIED", "Camera permission denied", details);
        this.name = "PermissionDeniedError";
    }
}

export class CameraNotAvailableError extends CameraError {
    constructor(details?: Record<string, any>) {
        super("CAMERA_NOT_AVAILABLE", "Camera is not available on this device", details);
        this.name = "CameraNotAvailableError";
    }
}

export class CameraNotReadyError extends CameraError {
    constructor(details?: Record<string, any>) {
        super("CAMERA_NOT_READY", "Camera is not ready", details);
        this.name = "CameraNotReadyError";
    }
}

export class PictureCaptureError extends CameraError {
    constructor(details?: Record<string, any>) {
        super("PICTURE_CAPTURE_FAILED", "Failed to capture picture", details);
        this.name = "PictureCaptureError";
    }
}

export class VideoRecordingError extends CameraError {
    constructor(details?: Record<string, any>) {
        super("VIDEO_RECORDING_FAILED", "Failed to record video", details);
        this.name = "VideoRecordingError";
    }
}

export class BarcodeScanError extends CameraError {
    constructor(details?: Record<string, any>) {
        super("BARCODE_SCAN_FAILED", "Failed to scan barcode", details);
        this.name = "BarcodeScanError";
    }
}

export const isCameraError = (error: unknown): error is CameraError => {
    return error instanceof CameraError;
};
