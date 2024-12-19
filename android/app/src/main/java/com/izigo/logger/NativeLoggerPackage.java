package com.izigo.logger;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.izigo.smartsaleterminal.SmartSaleTerminalModule;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class NativeLoggerPackage implements ReactPackage {
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        return Arrays.asList(new NativeLoggerModule(reactContext));
    }
}
