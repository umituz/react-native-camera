import { PictureResult, VideoResult, BarcodeData } from "../../domain/entities/Camera";

export interface CameraStorage {
    savePicture: (picture: PictureResult) => Promise<void>;
    saveVideo: (video: VideoResult) => Promise<void>;
    getPictures: () => Promise<PictureResult[]>;
    getVideos: () => Promise<VideoResult[]>;
    saveScannedBarcode: (barcode: BarcodeData) => Promise<void>;
    getScannedBarcodes: () => Promise<BarcodeData[]>;
}

export class CameraRepository implements CameraStorage {
    private pictures: PictureResult[] = [];
    private videos: VideoResult[] = [];
    private barcodes: BarcodeData[] = [];

    async savePicture(picture: PictureResult): Promise<void> {
        if (__DEV__) {
            console.log("[CameraRepository] Saving picture:", picture.uri);
        }

        this.pictures.push({
            ...picture,
        });
    }

    async saveVideo(video: VideoResult): Promise<void> {
        if (__DEV__) {
            console.log("[CameraRepository] Saving video:", video.uri);
        }

        this.videos.push({
            ...video,
        });
    }

    async getPictures(): Promise<PictureResult[]> {
        return [...this.pictures];
    }

    async getVideos(): Promise<VideoResult[]> {
        return [...this.videos];
    }

    async saveScannedBarcode(barcode: BarcodeData): Promise<void> {
        if (__DEV__) {
            console.log("[CameraRepository] Saving barcode:", barcode.data);
        }

        this.barcodes.push({
            ...barcode,
        });
    }

    async getScannedBarcodes(): Promise<BarcodeData[]> {
        return [...this.barcodes];
    }

    clearPictures(): void {
        this.pictures = [];
    }

    clearVideos(): void {
        this.videos = [];
    }

    clearBarcodes(): void {
        this.barcodes = [];
    }

    clearAll(): void {
        this.clearPictures();
        this.clearVideos();
        this.clearBarcodes();
    }
}

export const cameraRepository = new CameraRepository();
