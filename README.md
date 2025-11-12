# @umituz/react-native-camera

Advanced camera control for React Native apps - Real-time preview, photo/video capture, QR/barcode scanning, face detection using expo-camera.

## Features

- ✅ **Real-time Camera Preview** - Full camera control with configuration
- ✅ **Photo Capture** - High-quality photo capture with options
- ✅ **Video Recording** - Video recording with duration limits
- ✅ **QR Code / Barcode Scanning** - 12+ barcode types supported
- ✅ **Face Detection** - Face detection with bounds, angles, expressions
- ✅ **Camera Configuration** - Flash, zoom, ratio, torch control
- ✅ **Permission Management** - Built-in camera and microphone permissions
- ✅ **Type-Safe** - Full TypeScript support

## Installation

```bash
npm install @umituz/react-native-camera
```

## Peer Dependencies

```bash
npm install expo-camera
```

## Usage

### Basic Camera Usage

```tsx
import { useCamera } from '@umituz/react-native-camera';
import { CameraView } from 'expo-camera';

function MyScreen() {
  const {
    cameraRef,
    config,
    toggleFacing,
    takePicture,
    requestCameraPermission,
  } = useCamera();

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const handleCapture = async () => {
    const photo = await takePicture({ quality: 0.9 });
    console.log('Photo URI:', photo?.uri);
  };

  return (
    <CameraView
      ref={cameraRef}
      facing={config.facing}
      flash={config.flash}
      zoom={config.zoom}
      mode={config.mode}
    />
  );
}
```

### Barcode Scanning

```tsx
import { useBarcodeScanner } from '@umituz/react-native-camera';
import { CameraView } from 'expo-camera';

function BarcodeScanner() {
  const {
    isScanning,
    handleBarcodeScan,
    barcodeTypes,
    validationResult,
  } = useBarcodeScanner({
    onBarcodeScanned: (result, validation) => {
      if (validation.valid) {
        Alert.alert('Scanned', validation.formatted);
      }
    },
  });

  return (
    <CameraView
      facing="back"
      barcodeScannerSettings={{ barcodeTypes }}
      onBarcodeScanned={isScanning ? handleBarcodeScan : undefined}
    />
  );
}
```

### QR Code Scanner Only

```tsx
import { useQRScanner } from '@umituz/react-native-camera';

const { handleBarcodeScan, barcodeTypes } = useQRScanner({
  onBarcodeScanned: (result, validation) => {
    console.log('QR Code:', validation.data);
  },
});
```

### Product Barcode Scanner

```tsx
import { useProductBarcodeScanner } from '@umituz/react-native-camera';

const { handleBarcodeScan, barcodeTypes } = useProductBarcodeScanner({
  onBarcodeScanned: (result, validation) => {
    console.log('Product Barcode:', validation.data);
  },
});
```

### Camera Configuration

```tsx
const {
  config,
  setFacing,
  setFlash,
  setZoom,
  toggleTorch,
  toggleFacing,
} = useCamera();

// Switch to front camera
setFacing('front');

// Enable flash
setFlash('on');

// Set zoom level (0-1)
setZoom(0.5);

// Toggle torch
toggleTorch();

// Toggle front/back camera
toggleFacing();
```

### Video Recording

```tsx
const {
  startRecording,
  stopRecording,
  isRecording,
  requestMicrophonePermission,
} = useCamera();

const handleRecord = async () => {
  await requestMicrophonePermission();
  await startRecording({ maxDuration: 30, quality: '1080p' });
  // ... wait for user to stop
  const video = await stopRecording();
  console.log('Video URI:', video?.uri);
};
```

## API Reference

### `useCamera(initialConfig?)`

React hook for camera operations.

**Returns:**
- `config` - Camera configuration
- `setFacing(facing)` - Set camera facing (front/back)
- `setFlash(flash)` - Set flash mode (on/off/auto)
- `setZoom(zoom)` - Set zoom level (0-1)
- `setAutofocus(autofocus)` - Set autofocus (on/off)
- `setMode(mode)` - Set camera mode (picture/video)
- `setRatio(ratio)` - Set camera ratio (4:3/16:9/1:1)
- `toggleTorch()` - Toggle torch/flashlight
- `toggleFacing()` - Toggle front/back camera
- `requestCameraPermission()` - Request camera permission
- `requestMicrophonePermission()` - Request microphone permission
- `takePicture(options?)` - Take picture
- `startRecording(options?)` - Start video recording
- `stopRecording()` - Stop video recording
- `isRecording` - Recording state
- `isReady` - Camera ready state
- `error` - Error message
- `cameraRef` - Camera ref for CameraView component

### `useBarcodeScanner(options?)`

React hook for barcode/QR code scanning.

**Options:**
- `scanInterval` - Milliseconds between scans (default: 2000)
- `barcodeTypes` - Array of barcode types to scan
- `onBarcodeScanned` - Callback when barcode is scanned
- `autoStart` - Auto-start scanning (default: false)

**Returns:**
- `isScanning` - Scanning state
- `lastScannedCode` - Last scanned barcode result
- `validationResult` - Validation result
- `startScanning()` - Start scanning
- `stopScanning()` - Stop scanning
- `handleBarcodeScan(result)` - Handle barcode scan event
- `barcodeTypes` - Current barcode types
- `setBarcodeTypes(types)` - Set barcode types
- `scanInterval` - Current scan interval
- `setScanInterval(interval)` - Set scan interval
- `isURL(data)` - Check if data is URL
- `isProductBarcode(type)` - Check if type is product barcode

### `useQRScanner(options?)`

Convenience hook for QR code scanning only.

### `useProductBarcodeScanner(options?)`

Convenience hook for product barcode scanning (EAN, UPC, etc.).

### `CameraService`

Static service class for camera operations.

**Methods:**
- `requestCameraPermission()` - Request camera permission
- `requestMicrophonePermission()` - Request microphone permission
- `getCameraPermissionStatus()` - Get camera permission status
- `getMicrophonePermissionStatus()` - Get microphone permission status
- `isAvailable()` - Check if device has camera
- `getAvailableCameraTypes()` - Get available camera types
- `getDefaultConfig()` - Get default camera configuration
- `validateConfig(config)` - Validate camera configuration

### `BarcodeScannerService`

Static service class for barcode scanning.

**Methods:**
- `getAllBarcodeTypes()` - Get all supported barcode types
- `getQRCodeOnlyConfig()` - Get QR code only configuration
- `getProductBarcodeTypes()` - Get product barcode types
- `getDocumentBarcodeTypes()` - Get document barcode types
- `validateBarcode(result)` - Validate barcode result
- `isURL(data)` - Check if data is URL
- `isProductBarcode(type)` - Check if type is product barcode
- `parseQRCodeData(data)` - Parse QR code data
- `createScanThrottler(intervalMs)` - Create scan throttler

## Types

- `CameraType` - 'front' | 'back'
- `FlashMode` - 'on' | 'off' | 'auto'
- `AutoFocus` - 'on' | 'off'
- `CameraMode` - 'picture' | 'video'
- `VideoQuality` - '2160p' | '1080p' | '720p' | '480p'
- `CameraRatio` - '4:3' | '16:9' | '1:1'
- `BarcodeType` - Enum of supported barcode types
- `CameraConfig` - Camera configuration
- `CameraPicture` - Captured picture result
- `CameraVideo` - Recorded video result
- `BarcodeScannedResult` - Barcode scanning result
- `BarcodeValidationResult` - Barcode validation result

## Supported Barcode Types

- QR Code
- PDF417
- Aztec
- Code 39
- Code 93
- Code 128
- Data Matrix
- EAN-8
- EAN-13
- ITF-14
- UPC-E
- UPC-A

## License

MIT

## Author

Ümit UZ <umit@umituz.com>

