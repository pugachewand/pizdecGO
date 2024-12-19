package com.izigo.heartbeat;

import androidx.annotation.NonNull;

import java.time.LocalDateTime;

public class Globals {
    private static int gHeartbeatDelayInSeconds = 30;
    private static LocalDateTime gLastTickDateTime = null;

    private static final HeartbeatNotifier gHeartbeatNotifier = new HeartbeatNotifier();

    public static void setHeartbeatDelayInSeconds(int value) {
        if (value <= 0)
            return;
        gHeartbeatDelayInSeconds = value;
        // todo(0) als: apply setting
    }

    public static int getHeartbeatDelayInSeconds() {
        return gHeartbeatDelayInSeconds;
    }

    public static LocalDateTime getLastTickDateTime() { return gLastTickDateTime; }

    public static void subscribeForHeartbeatNotification(@NonNull IHeartbeatEventListener listener) {
        gHeartbeatNotifier.addListener(listener);
    }

    public static void unsubscribeFromHeartbeatNotification(@NonNull IHeartbeatEventListener listener) {
        gHeartbeatNotifier.removeListener(listener);
    }

    public static void notifyForTick() {
        gLastTickDateTime = LocalDateTime.now();
        gHeartbeatNotifier.notifyListeners();
    }
}
