import { useState, useCallback } from "react";
import { BarcodeType } from "../../domain/entities/Camera";

export interface BarcodeResult {
    type: BarcodeType;
    data: string;
    timestamp: number;
}

export interface UseBarcodeScannerResult {
    lastBarcode: BarcodeResult | null;
    isScanning: boolean;
    startScanning: () => void;
    stopScanning: () => void;
    resetBarcode: () => void;
    handleBarcodeScanned: (result: { type: BarcodeType; data: string }) => void;
}

export function useBarcodeScanner(): UseBarcodeScannerResult {
    const [lastBarcode, setLastBarcode] = useState<BarcodeResult | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const startScanning = useCallback(() => {
        setIsScanning(true);
        setLastBarcode(null);
    }, []);

    const stopScanning = useCallback(() => {
        setIsScanning(false);
    }, []);

    const resetBarcode = useCallback(() => {
        setLastBarcode(null);
    }, []);

    const handleBarcodeScanned = useCallback(
        (result: { type: BarcodeType; data: string }) => {
            if (isScanning) {
                setLastBarcode({
                    ...result,
                    timestamp: Date.now(),
                });

                if (__DEV__) {
                    console.log("[useBarcodeScanner] Barcode scanned:", result);
                }
            }
        },
        [isScanning]
    );

    return {
        lastBarcode,
        isScanning,
        startScanning,
        stopScanning,
        resetBarcode,
        handleBarcodeScanned,
    };
}
