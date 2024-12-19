package com.izigo.heartbeat;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.izigo.MainActivity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HeartbeatModule
        extends ReactContextBaseJavaModule
        implements IHeartbeatEventListener {
    private static final Logger mLogger = LoggerFactory.getLogger(MainActivity.class);

    HeartbeatModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    public boolean isMainContext(ReactApplicationContext reactContext) {
        return getReactApplicationContext() == reactContext;
    }

    @Override
    public void initialize() {
        super.initialize();
        mLogger.info("HeartbeatModule.initialize");
        customInitialize();
    }

    public void customInitialize() {
        mLogger.info("HeartbeatModule.customInitialize");
        Globals.subscribeForHeartbeatNotification(this);
    }

    public void customUninitialize() {
        mLogger.info("HeartbeatModule.customUninitialize");
        Globals.unsubscribeFromHeartbeatNotification(this);
    }

    @NonNull
    @Override
    public String getName() {
        return "HeartbeatModule";
    }

    @ReactMethod
    public void initializeHeartbeat(ReadableMap requestData, Promise promise) {
        Integer periodInSeconds = requestData.getInt("periodInSeconds");

        if (periodInSeconds <= 0) {
            promise.reject("Heartbeat initialization", "Period in seconds must be greater than zero.");
            return;
        }

        Globals.setHeartbeatDelayInSeconds(periodInSeconds);

        promise.resolve("Heartbeat period set to " + periodInSeconds + " seconds.");
    }

    @Override
    public void tick() {
        try {
            mLogger.info("HeartbeatModule.tick");
            sendEvent(this.getReactApplicationContext(), "onHeartbeatTick", null);
        } catch (Exception ex) {
            // do nothing
        }
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           String params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
