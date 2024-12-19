package com.izigo.smartsaleterminal.usb;

import static com.izigo.smartsaleterminal.usb.UsbHelper.ACTION_USB_PERMISSION;
import static com.izigo.smartsaleterminal.usb.UsbHelper.POS_TERMINAL_PERMISSION_ID;
import static com.izigo.smartsaleterminal.usb.UsbHelper.isPaxDevice;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;

import androidx.annotation.NonNull;

import com.izigo.MainActivity;
import com.izigo.utils.UsbPermissionHelper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Timer;
import java.util.TimerTask;

public final class UsbBroadcastReceiver extends BroadcastReceiver {
    private static final Logger mLogger = LoggerFactory.getLogger(MainActivity.class);

    @NonNull
    private final Context mContext;
    @NonNull
    private final Object mSyncObject;
    private final IUsbBroadcastReceiverListener mListener;
    private final PendingIntent mPermissionIntent;

    private Timer mControlPermissionTimer;

    public UsbBroadcastReceiver(@NonNull Context context, @NonNull Object syncObject, IUsbBroadcastReceiverListener listener) {
        super();

        mContext = context;
        mSyncObject = syncObject;
        mListener = listener;
        mPermissionIntent = UsbPermissionHelper.createPendingIntent(context, ACTION_USB_PERMISSION, POS_TERMINAL_PERMISSION_ID);
    }

    public static IntentFilter createIntentFilter() {
        IntentFilter filter = new IntentFilter(ACTION_USB_PERMISSION);

        filter.addAction(UsbManager.ACTION_USB_DEVICE_ATTACHED);
        filter.addAction(UsbManager.ACTION_USB_DEVICE_DETACHED);
        filter.addAction(UsbManager.EXTRA_PERMISSION_GRANTED);

        return filter;
    }

    public void onStop() {
        mLogger.info("PosTerminalMonitor.UsbBroadcastReceiver.onStop");
        dropControlPermissionTimer(true);
    }

    public void onResume(@NonNull UsbDevice device) {
        mLogger.info("PosTerminalMonitor.UsbBroadcastReceiver.onResume");
        UsbManager usbManager = (UsbManager) mContext.getSystemService(Context.USB_SERVICE);
        createControlPermissionTimer(usbManager, device);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        mLogger.info("PosTerminalMonitor.UsbBroadcastReceiver.onReceive some action = " + action);

        if (UsbManager.ACTION_USB_DEVICE_ATTACHED.equals(action)) {
            synchronized (mSyncObject) {
                try {
                    mLogger.info("PosTerminalMonitor.UsbBroadcastReceiver.onReceive my action = " + action);
                    UsbDevice device = (UsbDevice) intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);

                    if (isPaxDevice(device)) {
                        mLogger.info("our terminal attached");
                        UsbManager usbManager = (UsbManager) context.getSystemService(Context.USB_SERVICE);
                        boolean granted = intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false);
                        boolean hasPermission = usbManager.hasPermission(device);
                        mLogger.info("getExtraPermissionGranted returns " + granted);
                        mLogger.info("usbManager.hasPermission returns " + hasPermission);
                        if (!hasPermission) {
                            mLogger.info("request permission for device");
                            usbManager.requestPermission(device, mPermissionIntent);
                            createControlPermissionTimer(usbManager, device);
                            return;
                        }

                        raiseOnChanged(true, true);
                    } else
                        mLogger.info("not our terminal. ignoring.");
                } catch (Exception ex) {
                    mLogger.error("PosTerminalMonitor.UsbBroadcastReceiver.onReceive error occurred: " + ex);
                }
            }
        } else if (UsbManager.ACTION_USB_DEVICE_DETACHED.equals(action)) {
            synchronized (mSyncObject) {
                try {
                    mLogger.info("PosTerminalMonitor.UsbBroadcastReceiver.onReceive my action = " + action);
                    UsbDevice device = (UsbDevice) intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);

                    if (isPaxDevice(device)) {
                        mLogger.info("our terminal detached");
                        dropControlPermissionTimer(true);
                        raiseOnChanged(false, null);
                    } else
                        mLogger.info("not our terminal. ignoring.");
                } catch (Exception ex) {
                    mLogger.error("PosTerminalMonitor.UsbBroadcastReceiver.onReceive error occurred: " + ex);
                }
            }
        }/* else if (ACTION_USB_PERMISSION.equals(action)) {
            synchronized (mSyncObject) {
                mLogger.info("PosTerminalMonitor.UsbBroadcastReceiver.onReceive my action = " + action);

                UsbDevice device = (UsbDevice) intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);

                if (isPaxDevice(device)) {
                    mLogger.info("our terminal permission granted");
                    boolean granted = intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false);
                    mLogger.info("getExtraPermissionGranted returns " + granted);
                    raiseOnChanged(null, granted);
                } else
                    mLogger.info("not our terminal. ignoring.");
            }
        }*/
    }

    public void reCheckPermissionFromControlTimer(@NonNull UsbManager usbManager, @NonNull UsbDevice device) {
        mLogger.info("PosTerminalMonitor.UsbBroadcastReceiver.reCheckPermissionFromControlTimer fired");
        synchronized (mSyncObject) {
            dropControlPermissionTimer(false);

            try {
                boolean hasPermission = usbManager.hasPermission(device);
                mLogger.info("usbManager.hasPermission returns " + hasPermission);

                if (!hasPermission) {
                    mLogger.info("request again permission for device");
                    usbManager.requestPermission(device, mPermissionIntent);
                    createControlPermissionTimer(usbManager, device);
                    return;
                }

                raiseOnChanged(true, true);
            } catch (Exception ex) {
                mLogger.error("PosTerminalMonitor.UsbBroadcastReceiver.reCheckPermissionFromControlTimer error occurred: " + ex);
            }
        }
    }

    private void createControlPermissionTimer(@NonNull UsbManager usbManager, @NonNull UsbDevice usbDevice) {
        mLogger.info("PosTerminalMonitor.UsbBroadcastReceiver.createControlPermissionTimer");
        if (mControlPermissionTimer == null) {
            mLogger.info("timer creating...");
            mControlPermissionTimer = new Timer("SmartTerminal control permission requesting timer");
            mControlPermissionTimer.schedule(
                    new ControlPermissionRequestingTimerTask(this, usbManager, usbDevice),
                    ControlPermissionRequestingTimerTask.DELAY_FOR_START_SECONDS * 1000
            );
        } else
            mLogger.info("timer already exists.");
    }

    private void dropControlPermissionTimer(boolean cancelTask) {
        mLogger.info("PosTerminalMonitor.UsbBroadcastReceiver.dropControlPermissionTimer cancelTask = " + cancelTask);
        if (mControlPermissionTimer != null) {
            if (cancelTask) {
                mControlPermissionTimer.cancel();
                mControlPermissionTimer.purge();
            }
            mControlPermissionTimer = null;
        }
    }

    private void raiseOnChanged(Boolean attached, Boolean hasPermission) {
        if (mListener != null)
            mListener.onChanged(attached, hasPermission);
    }

    private class ControlPermissionRequestingTimerTask extends TimerTask {
        public static final long DELAY_FOR_START_SECONDS = 2;
        @NonNull
        private final UsbBroadcastReceiver mBroadcastReceiver;
        @NonNull
        private final UsbManager mUsbManager;
        @NonNull
        private final UsbDevice mUsbDevice;

        public ControlPermissionRequestingTimerTask(@NonNull UsbBroadcastReceiver broadcastReceiver,
                                                    @NonNull UsbManager manager,
                                                    @NonNull UsbDevice device) {
            mBroadcastReceiver = broadcastReceiver;
            mUsbManager = manager;
            mUsbDevice = device;
        }

        @Override
        public void run() {
            mBroadcastReceiver.reCheckPermissionFromControlTimer(mUsbManager, mUsbDevice);
        }
    }
}
