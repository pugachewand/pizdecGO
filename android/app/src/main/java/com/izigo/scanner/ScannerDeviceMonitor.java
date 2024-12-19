package com.izigo.scanner;

import android.app.Activity;
import android.content.Context;

import androidx.annotation.NonNull;

import com.izigo.MainActivity;
import com.izigo.MainActivityComponent;
import com.izigo.logger.LoggerEnums;
import com.izigo.scanner.usb.IUsbBroadcastReceiverListener;
import com.izigo.scanner.usb.UsbBroadcastReceiver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ScannerDeviceMonitor
        extends MainActivityComponent
        implements IUsbBroadcastReceiverListener {
    private static final Logger mLogger = LoggerFactory.getLogger(MainActivity.class);

    private final UsbBroadcastReceiver mBroadcastReceiver;
    @NonNull
    private final Activity mActivity;

    private final ScannerEngine mScannerEngine;

    public static ScannerDeviceMonitor create(@NonNull Context appContext, @NonNull Activity activity,
                                              @NonNull Object syncObject, @NonNull IScannerEngineListener scannerEngineListener) {
        Detector.ScannerInfo[] scanners = Detector.detectScanners(activity);
        boolean scannerDetected = scanners.length > 0 && Detector.isScanner(scanners[0].getDevice());
        for (Detector.ScannerInfo scanner : scanners) {
            mLogger.info("Found scanner device: " + scanner.getDevice() +
                    "\nPort: " + scanner.getPort() +
                    "\nDriver: " + scanner.getDriver());
        }

        if (scannerDetected)
            Detector.checkAndRequestUsbPermission(activity, scanners[0].getDevice());

        return new ScannerDeviceMonitor(appContext, activity, syncObject, scannerEngineListener, scannerDetected);
    }

    private ScannerDeviceMonitor(@NonNull Context appContext, @NonNull Activity activity, @NonNull Object syncObject,
                                 @NonNull IScannerEngineListener scannerEngineListener, boolean scannerDetected) {
        mLogger.info("ScannerDeviceMonitor.ctor scannerDetected=" + scannerDetected);

        mActivity = activity;

        mScannerEngine = ScannerEngine.create(appContext, mActivity, scannerEngineListener);

        mBroadcastReceiver = new UsbBroadcastReceiver(mActivity, syncObject, this);

        mLogger.info(LoggerEnums.ScannerInitialization + " " + mScannerEngine);
        mScannerEngine.onAttach();
    }

    @Override
    public void onStart() {
        mLogger.info("ScannerDeviceMonitor.onStart");
        mScannerEngine.onStart();

        mLogger.info("ScannerDeviceMonitor.mActivity.registerReceiver");
        mActivity.registerReceiver(mBroadcastReceiver, UsbBroadcastReceiver.createIntentFilter());
    }

    @Override
    public void onStop() {
        mLogger.info("ScannerDeviceMonitor.onStop");

        mLogger.info("ScannerDeviceMonitor.mActivity.unregisterReceiver");
        mActivity.unregisterReceiver(mBroadcastReceiver);

        mScannerEngine.onStop();
    }

    @Override
    public void onDestroy() {
        mLogger.info("ScannerDeviceMonitor.onDestroy");

        mScannerEngine.onDetach();
        mScannerEngine.onDestroy();
    }

    @Override
    public void onResume() {
        mLogger.info("ScannerDeviceMonitor.onResume");
        mScannerEngine.onResume();
    }

    @Override
    public void onPause() {
        mLogger.info("ScannerDeviceMonitor.onPause");
        mScannerEngine.onPause();
    }

    @Override
    public void onChanged(boolean attached, boolean granted) {
        mLogger.info(String.format("ScannerDeviceMonitor.onChanged. attached = %s, granted = %s", attached, granted));

        if (attached) {
            mScannerEngine.publicConnect(granted);
        } else {
            mScannerEngine.publicDisconnect();
        }
    }
}
