package com.izigo.scanner;

import androidx.annotation.NonNull;

public class Globals {
    private static Boolean gScannerConnected = false;
    private static final ScannerDeviceConnectedStateNotifier gScannerConnectedStateNotifier = new ScannerDeviceConnectedStateNotifier();

    public static boolean getScannerConnected() {
        return gScannerConnected;
    }

    public static void setScannerConnected(boolean value) {
        boolean changed = gScannerConnected != value;

        gScannerConnected = value;

        if (changed)
            gScannerConnectedStateNotifier.notifyListeners(gScannerConnected);
    }

    public static void subscribeForScannerConnectedStateNotification(@NonNull IScannerStateChangeEventListener listener) {
        gScannerConnectedStateNotifier.addListener(listener);
    }

    public static void UnsubscribeForScannerConnectedStateNotification(@NonNull IScannerStateChangeEventListener listener) {
        gScannerConnectedStateNotifier.removeListener(listener);
    }
}
