package com.izigo.smartsaleterminal;

import android.app.Activity;
import android.hardware.usb.UsbDevice;

import androidx.annotation.NonNull;

import com.izigo.MainActivity;
import com.izigo.MainActivityComponent;
import com.izigo.smartsaleterminal.usb.IUsbBroadcastReceiverListener;
import com.izigo.smartsaleterminal.usb.UsbBroadcastReceiver;
import com.izigo.smartsaleterminal.usb.UsbHelper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class PosTerminalMonitor
        extends MainActivityComponent
        implements IUsbBroadcastReceiverListener {
    private static final Logger mLogger = LoggerFactory.getLogger(MainActivity.class);

    private final UsbBroadcastReceiver mBroadcastReceiver;
    @NonNull
    private final Activity mActivity;

    public static PosTerminalMonitor create(@NonNull Activity activity, @NonNull Object syncObject) {
        boolean paxDetected = UsbHelper.detectPaxAndRequestUsbPermission(activity) != null;

        return new PosTerminalMonitor(activity, syncObject, paxDetected);
    }

    private PosTerminalMonitor(@NonNull Activity activity, @NonNull Object syncObject, boolean paxDetected) {
        mActivity = activity;
        mLogger.info("PosTerminalMonitor.ctor paxDetected=" + paxDetected);

        changeStatus(paxDetected);

        mBroadcastReceiver = new UsbBroadcastReceiver(activity, syncObject, this);
    }

    @Override
    public void onStart() {
        mLogger.info("PosTerminalMonitor.onStart");
        mLogger.info("PosTerminalMonitor.mActivity.registerReceiver");
        mActivity.registerReceiver(mBroadcastReceiver, UsbBroadcastReceiver.createIntentFilter());
    }

    @Override
    public void onStop() {
        mLogger.info("PosTerminalMonitor.onStop");
        mLogger.info("PosTerminalMonitor.mActivity.unregisterReceiver");
        mBroadcastReceiver.onStop();
        mActivity.unregisterReceiver(mBroadcastReceiver);
    }

    @Override
    public void onResume() {
        mLogger.info("PosTerminalMonitor.onResume");

        if (!Globals.getPosTerminalConnected()) {
            UsbDevice device = UsbHelper.detectPaxAndRequestUsbPermission(mActivity);
            if (device != null)
                mBroadcastReceiver.onResume(device);
        }
    }

    @Override
    public void onPause() {
        mLogger.info("PosTerminalMonitor.onPause");
    }

    @Override
    public void onChanged(Boolean attached, Boolean hasPermission) {
        mLogger.info(String.format("PosTerminalMonitor.onChanged. attached = %s, hasPermission = %s", attached, hasPermission));
        changeStatus((attached != null ? attached : false) && (hasPermission != null ? hasPermission : false));
    }

    private void changeStatus(boolean value) {
        mLogger.info("Globals.setPosTerminalConnected = " + value);
        Globals.setPosTerminalConnected(value);
    }
}
