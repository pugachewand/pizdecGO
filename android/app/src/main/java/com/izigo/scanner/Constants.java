package com.izigo.scanner;

import com.izigo.BuildConfig;

public class Constants {
    public static final String INTENT_ACTION_GRANT_USB = "com.izigo.scanner.GRANT_USB";
    public static final int INTENT_ACTION_GRANT_USB_REQUEST_CODE = 2;
    public static final String INTENT_ACTION_DISCONNECT = BuildConfig.APPLICATION_ID + ".Disconnect";
    public static final String NOTIFICATION_CHANNEL = BuildConfig.APPLICATION_ID + ".Channel";
    public static final String INTENT_CLASS_MAIN_ACTIVITY = BuildConfig.APPLICATION_ID + ".MainActivity";

    // values have to be unique within each app
    public static final int NOTIFY_MANAGER_START_FOREGROUND_SERVICE = 1978;

    private Constants() {}
}
