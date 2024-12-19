package com.izigo.scanner;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.izigo.MainActivity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ScannerModule extends ReactContextBaseJavaModule implements IScannerStateChangeEventListener {
    private static final Logger mLogger = LoggerFactory.getLogger(MainActivity.class);

    ScannerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    public boolean isMainContext(ReactApplicationContext reactContext) {
        return getReactApplicationContext() == reactContext;
    }

    @Override
    public void initialize() {
        super.initialize();
        mLogger.info("ScannerModule.initialize");
        customInitialize();
    }

    public void customInitialize() {
        mLogger.info("ScannerModule.customInitialize");
        Globals.subscribeForScannerConnectedStateNotification(this);
    }

    public void customUninitialize() {
        mLogger.info("ScannerModule.customUninitialize");
        Globals.UnsubscribeForScannerConnectedStateNotification(this);
    }

    @NonNull
    @Override
    public String getName() {
        return "ScannerModule";
    }

    @ReactMethod
    public void getScannerStatus(Promise promise) {
        boolean scannerConnected = Globals.getScannerConnected();
        mLogger.info("getScannerStatus returns " + scannerConnected);
        promise.resolve(scannerConnected);
    }

    @Override
    public void changed(boolean value) {
        mLogger.info("ScannerModule.changed Scanner connect state to " + value);
        sendEvent(this.getReactApplicationContext(), "ScannerState", String.valueOf(value));
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           String params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
