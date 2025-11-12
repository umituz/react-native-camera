/**
 * Camera Domain - useBarcodeScanner Hook
 *
 * React hook for barcode/QR code scanning.
 * Provides barcode detection with throttling and validation.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { BarcodeScannerService } from '../../infrastructure/services/BarcodeScannerService';
import type {
  BarcodeScannedResult,
  BarcodeType,
} from '../../domain/entities/Camera';
import type { BarcodeValidationResult } from '../../infrastructure/services/BarcodeScannerService';

/**
 * useBarcodeScanner hook return type
 */
export interface UseBarcodeScannerReturn {
  // Scanning state
  isScanning: boolean;
  lastScannedCode: BarcodeScannedResult | null;
  validationResult: BarcodeValidationResult | null;

  // Actions
  startScanning: () => void;
  stopScanning: () => void;
  handleBarcodeScan: (result: BarcodeScannedResult) => void;

  // Configuration
  barcodeTypes: string[];
  setBarcodeTypes: (types: string[]) => void;
  scanInterval: number;
  setScanInterval: (interval: number) => void;

  // Utilities
  isURL: (data: string) => boolean;
  isProductBarcode: (type: string) => boolean;
}

/**
 * Barcode scanner hook options
 */
export interface BarcodeScannerOptions {
  scanInterval?: number; // milliseconds between scans
  barcodeTypes?: string[];
  onBarcodeScanned?: (result: BarcodeScannedResult, validation: BarcodeValidationResult) => void;
  autoStart?: boolean;
}

/**
 * useBarcodeScanner hook for QR/barcode scanning
 *
 * USAGE:
 * ```typescript
 * const {
 *   isScanning,
 *   lastScannedCode,
 *   validationResult,
 *   startScanning,
 *   stopScanning,
 *   handleBarcodeScan,
 *   barcodeTypes,
 * } = useBarcodeScanner({
 *   scanInterval: 2000,
 *   barcodeTypes: ['qr', 'ean13'],
 *   onBarcodeScanned: (result, validation) => {
 *     if (validation.valid) {
 *       console.log('Scanned:', validation.formatted);
 *     }
 *   },
 * });
 *
 * // Render camera with barcode scanning
 * <CameraView
 *   facing="back"
 *   barcodeScannerSettings={{
 *     barcodeTypes,
 *   }}
 *   onBarcodeScanned={isScanning ? handleBarcodeScan : undefined}
 * />
 * ```
 */
export const useBarcodeScanner = (
  options?: BarcodeScannerOptions
): UseBarcodeScannerReturn => {
  const [isScanning, setIsScanning] = useState(options?.autoStart ?? false);
  const [lastScannedCode, setLastScannedCode] = useState<BarcodeScannedResult | null>(null);
  const [validationResult, setValidationResult] = useState<BarcodeValidationResult | null>(null);
  const [barcodeTypes, setBarcodeTypes] = useState<string[]>(
    options?.barcodeTypes || BarcodeScannerService.getAllBarcodeTypes()
  );
  const [scanInterval, setScanInterval] = useState(options?.scanInterval || 2000);

  const throttlerRef = useRef(BarcodeScannerService.createScanThrottler(scanInterval));
  const onBarcodeScannesRef = useRef(options?.onBarcodeScanned);

  // Update throttler when scan interval changes
  useEffect(() => {
    throttlerRef.current = BarcodeScannerService.createScanThrottler(scanInterval);
  }, [scanInterval]);

  // Update callback ref
  useEffect(() => {
    onBarcodeScannesRef.current = options?.onBarcodeScanned;
  }, [options?.onBarcodeScanned]);

  /**
   * Start scanning
   */
  const startScanning = useCallback(() => {
    setIsScanning(true);
  }, []);

  /**
   * Stop scanning
   */
  const stopScanning = useCallback(() => {
    setIsScanning(false);
  }, []);

  /**
   * Handle barcode scan event
   */
  const handleBarcodeScan = useCallback((result: BarcodeScannedResult) => {
    // Throttle scanning (prevent duplicate scans)
    if (!throttlerRef.current.canScan()) {
      return;
    }

    throttlerRef.current.recordScan();

    // Validate barcode
    const validation = BarcodeScannerService.validateBarcode(result);

    // Update state
    setLastScannedCode(result);
    setValidationResult(validation);

    // Call callback if provided
    if (onBarcodeScannesRef.current) {
      onBarcodeScannesRef.current(result, validation);
    }
  }, []);

  /**
   * Check if data is URL
   */
  const isURL = useCallback((data: string): boolean => {
    return BarcodeScannerService.isURL(data);
  }, []);

  /**
   * Check if type is product barcode
   */
  const isProductBarcode = useCallback((type: string): boolean => {
    return BarcodeScannerService.isProductBarcode(type);
  }, []);

  return {
    // Scanning state
    isScanning,
    lastScannedCode,
    validationResult,

    // Actions
    startScanning,
    stopScanning,
    handleBarcodeScan,

    // Configuration
    barcodeTypes,
    setBarcodeTypes,
    scanInterval,
    setScanInterval,

    // Utilities
    isURL,
    isProductBarcode,
  };
};

/**
 * Convenience hook for QR code scanning only
 */
export const useQRScanner = (
  options?: Omit<BarcodeScannerOptions, 'barcodeTypes'>
): UseBarcodeScannerReturn => {
  return useBarcodeScanner({
    ...options,
    barcodeTypes: BarcodeScannerService.getQRCodeOnlyConfig(),
  });
};

/**
 * Convenience hook for product barcode scanning
 */
export const useProductBarcodeScanner = (
  options?: Omit<BarcodeScannerOptions, 'barcodeTypes'>
): UseBarcodeScannerReturn => {
  return useBarcodeScanner({
    ...options,
    barcodeTypes: BarcodeScannerService.getProductBarcodeTypes(),
  });
};

