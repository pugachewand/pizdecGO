package com.izigo.smartsaleterminal;

import androidx.annotation.NonNull;

import com.izigo.MainActivity;
import com.izigo.utils.events.EventSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class PosTerminalConnectedStateNotifier extends EventSource<IPosTerminalStateChangeEventListener> {
    private static final Logger mLogger = LoggerFactory.getLogger(MainActivity.class);

    public PosTerminalConnectedStateNotifier() {
        super();
        mLogger.info("PosTerminalConnectedStateNotifier.ctor");
    }

    public boolean addListener(@NonNull IPosTerminalStateChangeEventListener listener) {
        boolean result = super.addListener(listener);
        mLogger.info("PosTerminalConnectedStateNotifier.addListener " + listener + " returns " + result);
        return result;
    }

    public boolean removeListener(@NonNull IPosTerminalStateChangeEventListener listener) {
        boolean result = super.removeListener(listener);
        mLogger.info("PosTerminalConnectedStateNotifier.removeListener " + listener + " returns " + result);
        return result;
    }

    @Override
    public void cleanListeners() {
        mLogger.info("PosTerminalConnectedStateNotifier.cleanListeners count=" + getListenersCount());
        super.cleanListeners();
    }

    public void notifyListeners(boolean value) {
        mLogger.info(String.format("PosTerminalConnectedStateNotifier.notifyListeners(%s) count=%s", value, getListenersCount()));
        getListeners().forEach(listener -> listener.changed(value));
    }
}
