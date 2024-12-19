package com.izigo.scanner;

import android.app.PendingIntent;
import android.content.Context;

import androidx.annotation.NonNull;

import com.izigo.utils.UsbPermissionHelper;

public class IntentHelper {
    public static PendingIntent createGrantUsbPermissionPendingIntent(@NonNull Context context) {
        return UsbPermissionHelper.createPendingIntent(context, Constants.INTENT_ACTION_GRANT_USB, Constants.INTENT_ACTION_GRANT_USB_REQUEST_CODE);
    }
}
