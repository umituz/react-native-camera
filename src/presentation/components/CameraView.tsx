import React, { forwardRef } from "react";
import { CameraView as ExpoCameraView, CameraType, FlashMode } from "expo-camera";
import { StyleSheet, ViewStyle } from "react-native";
import { BarcodeType } from "../../domain/entities/Camera";

export interface CameraViewProps {
    style?: ViewStyle;
    cameraType?: CameraType;
    flashMode?: FlashMode;
    barcodeScannerEnabled?: boolean;
    barcodeTypes?: BarcodeType[];
    onBarcodeScanned?: (result: { type: BarcodeType; data: string }) => void;
    children?: React.ReactNode;
}

export const CameraView = forwardRef<ExpoCameraView, CameraViewProps>(
    (
        {
            style,
            cameraType = "back",
            flashMode = "off",
            barcodeScannerEnabled = false,
            barcodeTypes = [],
            onBarcodeScanned,
            children,
        },
        ref
    ) => {
        return (
            <ExpoCameraView
                ref={ref}
                style={[styles.camera, style]}
                facing={cameraType}
                flash={flashMode}
                barcodeScannerSettings={
                    barcodeScannerEnabled
                        ? {
                              barcodeTypes,
                          }
                        : undefined
                }
                onBarcodeScanned={
                    barcodeScannerEnabled && onBarcodeScanned
                        ? (event) => {
                              onBarcodeScanned({
                                  type: event.type as BarcodeType,
                                  data: event.data,
                              });
                          }
                        : undefined
                }
            >
                {children}
            </ExpoCameraView>
        );
    }
);

CameraView.displayName = "CameraView";

const styles = StyleSheet.create({
    camera: {
        flex: 1,
    },
});
