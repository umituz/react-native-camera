import { CameraType, FlashMode, BarcodeType } from "../domain/entities/Camera";
import { DEFAULT_CAMERA_TYPE, DEFAULT_FLASH_MODE } from "../domain/constants/CameraConstants";

export function toggleCameraType(currentType: CameraType): CameraType {
    return currentType === "back" ? "front" : "back";
}

export function cycleFlashMode(currentMode: FlashMode): FlashMode {
    const modes: FlashMode[] = ["off", "on", "auto", "torch"];
    const currentIndex = modes.indexOf(currentMode);

    if (currentIndex === -1) {
        return DEFAULT_FLASH_MODE;
    }

    const nextIndex = (currentIndex + 1) % modes.length;
    return modes[nextIndex];
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) {
        return "0 B";
    }

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function getBarcodeTypeName(type: BarcodeType): string {
    const names: Record<BarcodeType, string> = {
        aztec: "Aztec",
        code128: "Code 128",
        code39: "Code 39",
        code93: "Code 93",
        ean13: "EAN-13",
        ean8: "EAN-8",
        pdf417: "PDF417",
        qr: "QR Code",
        upc_a: "UPC-A",
        upc_e: "UPC-E",
        datamatrix: "DataMatrix",
    };

    return names[type] || type;
}

export function isValidBarcodeType(type: string): type is BarcodeType {
    const validTypes: BarcodeType[] = [
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

    return validTypes.includes(type as BarcodeType);
}

export function getCameraTypeDisplayName(type: CameraType): string {
    const names: Record<CameraType, string> = {
        back: "Back Camera",
        front: "Front Camera",
    };

    return names[type] || type;
}

export function getFlashModeDisplayName(mode: FlashMode): string {
    const names: Record<FlashMode, string> = {
        off: "Off",
        on: "On",
        auto: "Auto",
        torch: "Torch",
    };

    return names[mode] || mode;
}
