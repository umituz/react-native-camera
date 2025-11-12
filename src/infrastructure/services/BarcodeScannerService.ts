/**
 * Camera Domain - Barcode Scanner Service
 *
 * Service for barcode/QR code scanning using expo-camera.
 * Provides configuration and utilities for barcode detection.
 *
 * NOTE: This service provides barcode scanning configuration.
 * The actual scanning is handled by CameraView's onBarcodeScanned prop.
 */

import type {
  BarcodeScannedResult,
  BarcodeType,
} from '../../domain/entities/Camera';
import { CameraUtils } from '../../domain/entities/Camera';

/**
 * Barcode scanner configuration
 */
export interface BarcodeScannerConfig {
  barcodeTypes?: string[];
  onBarcodeScanned?: (result: BarcodeScannedResult) => void;
  scanInterval?: number; // milliseconds between scans
}

/**
 * Barcode validation result
 */
export interface BarcodeValidationResult {
  valid: boolean;
  type: BarcodeType | null;
  data: string;
  formatted: string;
  error?: string;
}

/**
 * Barcode scanner service
 */
export class BarcodeScannerService {
  /**
   * Get all supported barcode types
   */
  static getAllBarcodeTypes(): string[] {
    return [
      'qr',
      'pdf417',
      'aztec',
      'code39',
      'code93',
      'code128',
      'datamatrix',
      'ean8',
      'ean13',
      'itf14',
      'upc_e',
      'upc_a',
    ];
  }

  /**
   * Get QR code only configuration
   */
  static getQRCodeOnlyConfig(): string[] {
    return ['qr'];
  }

  /**
   * Get product barcode types (retail/e-commerce)
   */
  static getProductBarcodeTypes(): string[] {
    return [
      'ean8',
      'ean13',
      'upc_a',
      'upc_e',
      'code128',
    ];
  }

  /**
   * Get document barcode types (PDF417, DataMatrix)
   */
  static getDocumentBarcodeTypes(): string[] {
    return [
      'pdf417',
      'datamatrix',
      'aztec',
    ];
  }

  /**
   * Create default scanner configuration
   */
  static getDefaultConfig(): BarcodeScannerConfig {
    return {
      barcodeTypes: BarcodeScannerService.getAllBarcodeTypes(),
      scanInterval: 2000, // 2 seconds between scans
    };
  }

  /**
   * Create QR code scanner configuration
   */
  static createQRScannerConfig(
    onBarcodeScanned?: (result: BarcodeScannedResult) => void,
    scanInterval?: number
  ): BarcodeScannerConfig {
    return {
      barcodeTypes: BarcodeScannerService.getQRCodeOnlyConfig(),
      onBarcodeScanned,
      scanInterval: scanInterval || 2000,
    };
  }

  /**
   * Create product barcode scanner configuration
   */
  static createProductScannerConfig(
    onBarcodeScanned?: (result: BarcodeScannedResult) => void,
    scanInterval?: number
  ): BarcodeScannerConfig {
    return {
      barcodeTypes: BarcodeScannerService.getProductBarcodeTypes(),
      onBarcodeScanned,
      scanInterval: scanInterval || 2000,
    };
  }

  /**
   * Validate barcode result
   */
  static validateBarcode(result: BarcodeScannedResult): BarcodeValidationResult {
    if (!result.data || result.data.trim() === '') {
      return {
        valid: false,
        type: null,
        data: result.data,
        formatted: '',
        error: 'Empty barcode data',
      };
    }

    const parsedType = CameraUtils.parseBarcodeType(result.type);
    const formatted = CameraUtils.formatBarcodeData(result.type, result.data);

    return {
      valid: true,
      type: parsedType,
      data: result.data,
      formatted,
    };
  }

  /**
   * Check if scanned code is a URL
   */
  static isURL(data: string): boolean {
    try {
      new URL(data);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if scanned code is a product barcode (EAN, UPC)
   */
  static isProductBarcode(type: string): boolean {
    const productTypes = ['ean8', 'ean13', 'upc_a', 'upc_e', 'code128'];
    return productTypes.includes(type.toLowerCase());
  }

  /**
   * Extract data from QR code (supports vCard, URL, plain text)
   */
  static parseQRCodeData(data: string): {
    type: 'url' | 'vcard' | 'text';
    content: any;
  } {
    // Check if URL
    if (BarcodeScannerService.isURL(data)) {
      return {
        type: 'url',
        content: data,
      };
    }

    // Check if vCard
    if (data.startsWith('BEGIN:VCARD')) {
      return {
        type: 'vcard',
        content: data,
      };
    }

    // Plain text
    return {
      type: 'text',
      content: data,
    };
  }

  /**
   * Throttle barcode scanning (prevent duplicate scans)
   */
  static createScanThrottler(intervalMs: number = 2000): {
    canScan: () => boolean;
    recordScan: () => void;
  } {
    let lastScanTime = 0;

    return {
      canScan: () => {
        const now = Date.now();
        return now - lastScanTime >= intervalMs;
      },
      recordScan: () => {
        lastScanTime = Date.now();
      },
    };
  }
}

