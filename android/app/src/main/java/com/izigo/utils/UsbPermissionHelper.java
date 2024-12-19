package com.izigo.utils;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;

public class UsbPermissionHelper {
    public static PendingIntent createPendingIntent(Context context, String permission, int requestCode) {
        int flags = PendingIntent.FLAG_MUTABLE | PendingIntent.FLAG_UPDATE_CURRENT;
        return PendingIntent.getBroadcast(context, requestCode, new Intent(permission), flags);
    }

    public static String intentToString(Intent intent) {
        if (intent == null)
            return "null";

        UsbDevice device = intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);

        return String.format("[%s]. Extra permission granted: [%s]. For device -> %s",
                intent,
                intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false),
                device != null ? device.toString() : "null"
        );
    }
}
