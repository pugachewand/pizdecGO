package com.izigo.heartbeat;

import androidx.annotation.NonNull;

import com.izigo.MainActivity;
import com.izigo.utils.events.EventSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class HeartbeatNotifier extends EventSource<IHeartbeatEventListener> {
    private static final Logger mLogger = LoggerFactory.getLogger(MainActivity.class);

    public HeartbeatNotifier() {
        super();
        mLogger.info("HeartbeatNotifier.ctor");
    }

    public boolean addListener(@NonNull IHeartbeatEventListener listener) {
        boolean result = super.addListener(listener);
        mLogger.info("HeartbeatNotifier.addListener " + listener + " returns " + result);
        return result;
    }

    public boolean removeListener(@NonNull IHeartbeatEventListener listener) {
        boolean result = super.removeListener(listener);
        mLogger.info("HeartbeatNotifier.removeListener " + listener + " returns " + result);
        return result;
    }

    public void notifyListeners() {
        getListeners().forEach(listener -> listener.tick());
    }

    @Override
    public void cleanListeners() {
        mLogger.info("HeartbeatNotifier.cleanListeners count=" + getListenersCount());
        super.cleanListeners();
    }
}
