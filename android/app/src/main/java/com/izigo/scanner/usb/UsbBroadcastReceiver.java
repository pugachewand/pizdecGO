package com.izigo.scanner.usb;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;

import androidx.annotation.NonNull;

import com.izigo.MainActivity;
import com.izigo.scanner.Constants;
import com.izigo.scanner.Detector;
import com.izigo.scanner.IntentHelper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class UsbBroadcastReceiver extends BroadcastReceiver {
    private static final Logger mLogger = LoggerFactory.getLogger(MainActivity.class);
    @NonNull
    private final Object mSyncObject;
    private final IUsbBroadcastReceiverListener mListener;
    private final PendingIntent mPermissionIntent;
    private boolean mConnectedToScanner;

    public UsbBroadcastReceiver(@NonNull Context context, @NonNull Object syncObject, IUsbBroadcastReceiverListener listener) {
        super();

        mSyncObject = syncObject;
        mListener = listener;
        mPermissionIntent = IntentHelper.createGrantUsbPermissionPendingIntent(context);
        mConnectedToScanner = false;
    }

    public static IntentFilter createIntentFilter() {
        IntentFilter filter = new IntentFilter(Constants.INTENT_ACTION_GRANT_USB);

        filter.addAction(UsbManager.ACTION_USB_DEVICE_ATTACHED);
        filter.addAction(UsbManager.ACTION_USB_DEVICE_DETACHED);
        filter.addAction(UsbManager.EXTRA_PERMISSION_GRANTED);

        return filter;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        mLogger.info("ScannerDeviceMonitor.UsbBroadcastReceiver.onReceive some action = " + action);

        if (UsbManager.ACTION_USB_DEVICE_ATTACHED.equals(action)) {
            synchronized (mSyncObject) {
                mLogger.info("ScannerDeviceMonitor.UsbBroadcastReceiver.onReceive my action = " + action);
                UsbDevice device = (UsbDevice) intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);

                if (Detector.isScanner(device)) {
                    mLogger.info("our scanner attached");
                    UsbManager usbManager = (UsbManager) context.getSystemService(Context.USB_SERVICE);
                    if (!usbManager.hasPermission(device)) {
                        mLogger.info("request permission for device");
                        usbManager.requestPermission(device, mPermissionIntent);
                        return;
                    }

                    mConnectedToScanner = true;
                    raiseOnChanged(true);
                } else
                    mLogger.info("not our scanner. ignoring.");
            }
        } else if (UsbManager.ACTION_USB_DEVICE_DETACHED.equals(action)) {
            synchronized (mSyncObject) {
                mLogger.info("ScannerDeviceMonitor.UsbBroadcastReceiver.onReceive my action = " + action);
                UsbDevice device = (UsbDevice) intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);

                if (Detector.isScanner(device)) {
                    mLogger.info("our scanner detached");
                    mConnectedToScanner = false;
                    raiseOnChanged(false);
                } else
                    mLogger.info("not our scanner. ignoring.");
            }
        } else if (Constants.INTENT_ACTION_GRANT_USB.equals(action)) {
            synchronized (mSyncObject) {
                mLogger.info("ScannerDeviceMonitor.UsbBroadcastReceiver.onReceive my action = " + action);
                UsbDevice device = (UsbDevice) intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);

                if (Detector.isScanner(device)) {
                    mLogger.info("our scanner permission granted");
                    mConnectedToScanner = true;
                    Boolean granted = intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false);
                    raiseOnChanged(granted);
                } else
                    mLogger.info("not our scanner. ignoring.");
            }
        }
    }

    private void raiseOnChanged(boolean granted) {
        if (mListener != null)
            mListener.onChanged(mConnectedToScanner, granted);
    }
}
