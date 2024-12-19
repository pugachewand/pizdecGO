package com.izigo.scanner;

import androidx.annotation.NonNull;

import com.izigo.MainActivity;
import com.izigo.utils.events.EventSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class ScannerDeviceConnectedStateNotifier extends EventSource<IScannerStateChangeEventListener> {
    private static final Logger mLogger = LoggerFactory.getLogger(MainActivity.class);

    public ScannerDeviceConnectedStateNotifier() {
        super();
        mLogger.info("ScannerDeviceConnectedStateNotifier.ctor");
    }

    public boolean addListener(@NonNull IScannerStateChangeEventListener listener) {
        boolean result = super.addListener(listener);
        mLogger.info("ScannerDeviceConnectedStateNotifier.addListener " + listener + " returns " + result);
        return result;
    }

    public boolean removeListener(@NonNull IScannerStateChangeEventListener listener) {
        boolean result = super.removeListener(listener);
        mLogger.info("ScannerDeviceConnectedStateNotifier.removeListener " + listener + " returns " + result);
        return result;
    }

    @Override
    public void cleanListeners() {
        mLogger.info("ScannerDeviceConnectedStateNotifier.cleanListeners count=" + getListenersCount());
        super.cleanListeners();
    }

    public void notifyListeners(boolean value) {
        mLogger.info(String.format("ScannerDeviceConnectedStateNotifier.notifyListeners(%s) count=%s", value, getListenersCount()));
        getListeners().forEach(listener -> listener.changed(value));
    }
}
