import { CameraType, FlashMode, VideoQuality, BarcodeType } from "../entities/Camera";

export const DEFAULT_CAMERA_TYPE: CameraType = "back";

export const DEFAULT_FLASH_MODE: FlashMode = "off";

export const DEFAULT_PICTURE_QUALITY = 1;

export const DEFAULT_VIDEO_QUALITY: VideoQuality = "1080p";

export const DEFAULT_VIDEO_DURATION = 60;

export const DEFAULT_MAX_FILE_SIZE = 0;

export const ALL_BARCODE_TYPES: BarcodeType[] = [
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
];

export const COMMON_BARCODE_TYPES: BarcodeType[] = [
    "qr",
    "code128",
    "ean13",
    "code39",
];

export const CAMERA_MODES = {
    PICTURE: "picture" as const,
    VIDEO: "video" as const,
} as const;

export type CameraMode = typeof CAMERA_MODES[keyof typeof CAMERA_MODES];
