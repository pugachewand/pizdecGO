package com.izigo.smartsaleterminal;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import androidx.annotation.NonNull;


public class SmartSaleTerminalPackage implements ReactPackage {
    private SmartSaleTerminalModule module = null;

    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        if (this.module == null || !this.module.isMainContext(reactContext))
            this.module = new SmartSaleTerminalModule(reactContext);

        return Arrays.asList(this.module);
    }

    public void customInitialize() {
        if (this.module != null)
            this.module.customInitialize();
    }

    public void customUninitialize() {
        this.module.customUninitialize();
    }
}
