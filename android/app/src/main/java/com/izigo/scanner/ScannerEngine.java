package com.izigo.scanner;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.hardware.usb.UsbManager;
import android.os.IBinder;
import android.text.SpannableStringBuilder;

import androidx.annotation.NonNull;

import com.hoho.android.usbserial.driver.UsbSerialDriver;
import com.hoho.android.usbserial.driver.UsbSerialPort;
import com.hoho.android.usbserial.driver.UsbSerialProber;
import com.izigo.MainActivity;
import com.izigo.logger.LoggerEnums;
import com.izigo.utils.ValueResult;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayDeque;

public class ScannerEngine implements ServiceConnection, SerialListener {
    private enum Connected { False, Pending, True }

    @NonNull
    private final Context mAppContext;
    @NonNull
    private final Activity activity;
    @NonNull
    private final IScannerEngineListener listener;
    private UsbSerialPort usbSerialPort;
    private SerialService service;

    private Connected connected;
    private boolean initialStart = true;

    private static final Logger mLogger = LoggerFactory.getLogger(MainActivity.class);

    public static ScannerEngine create(@NonNull Context appContext, @NonNull Activity activity,
                                       @NonNull IScannerEngineListener listener) {
        return new ScannerEngine(appContext, activity, listener);
    }

    private ScannerEngine(@NonNull Context appContext, @NonNull Activity activity,
                          @NonNull IScannerEngineListener listener) {
        mAppContext = appContext;
        this.activity = activity;
        this.listener = listener;

        changeStatus(Connected.False);
    }

    public void onDestroy() {
        mLogger.info("ScannerEngine.onDestroy");
        if (this.connected != Connected.False)
            disconnect(false);
        mLogger.info("ScannerEngine.activity.stopService");
        this.activity.stopService(new Intent(this.activity, SerialService.class));
    }

    public void onStart() {
        mLogger.info("ScannerEngine.onStart");

        if (this.service != null) {
            mLogger.info("ScannerEngine.service.attach");
            this.service.attach(this);
        } else {
            mLogger.info("ScannerEngine.activity.startService");
            this.activity.startService(new Intent(this.activity, SerialService.class));
        }
    }

    public void onStop() {
        mLogger.info("ScannerEngine.onStop");

        if (this.service != null && !this.activity.isChangingConfigurations()) {
            mLogger.info("ScannerEngine.service.detach");
            this.service.detach();
        }
    }

    public void onAttach() {
        mLogger.info("ScannerEngine.onAttach");
        mLogger.info("ScannerEngine.activity.bindService");
        this.activity.bindService(new Intent(this.activity, SerialService.class), this, Context.BIND_AUTO_CREATE);
    }

    public void onDetach() {
        mLogger.info("ScannerEngine.onDetach");
        try {
            mLogger.info("ScannerEngine.activity.unbindService");
            this.activity.unbindService(this);
        } catch(Exception ignored) {
            mLogger.info("ScannerEngine.activity.unbindService exception: ", ignored.toString());
        }
    }

    public void onResume() {
        mLogger.info("ScannerEngine.onResume");

        if(this.service != null) {
            mLogger.info("ScannerEngine.activity.runOnUiThread(this::connect)");
            this.initialStart = false;
            this.activity.runOnUiThread(this::connect);
        }
    }

    public void onPause() {
        mLogger.info("ScannerEngine.onPause");
    }

    @Override
    public void onServiceConnected(ComponentName name, IBinder binder) {
        mLogger.info("ScannerEngine.onServiceConnected");
        this.service = ((SerialService.SerialBinder) binder).getService();
        this.service.attach(this);
        if(this.initialStart /*&& this.activity.isResumed()*/) {
            this.initialStart = false;
            mLogger.info("ScannerEngine.activity.runOnUiThread(this::connect)");
            this.activity.runOnUiThread(this::connect);
        }
    }

    @Override
    public void onServiceDisconnected(ComponentName name) {
        mLogger.info("ScannerEngine.onServiceDisconnected");
        this.service = null;
    }

    @Override
    public void onSerialConnect() {
        mLogger.info("ScannerEngine.onSerialConnect");
        changeStatus(Connected.True);
    }

    @Override
    public void onSerialConnectError(Exception e) {
        mLogger.info("ScannerEngine.onSerialConnectError " + e.toString());
        disconnect(this.connected == Connected.True);
    }

    @Override
    public void onSerialRead(byte[] data) {
        ArrayDeque<byte[]> datas = new ArrayDeque<>();
        datas.add(data);
        receive(datas);
    }

    @Override
    public void onSerialRead(ArrayDeque<byte[]> datas) {
        receive(datas);
    }

    @Override
    public void onSerialIoError(Exception e) {
        mLogger.info("ScannerEngine.onSerialIoError " + e.toString());
        disconnect(this.connected == Connected.True);
    }

    private void connect() {
        connect(null);
    }

    public void publicConnect(Boolean permissionGranted) {
        connect(permissionGranted);
    }

    private ValueResult connect(Boolean permissionGranted) {
        mLogger.info("ScannerEngine.connect with permissionGranted=" + permissionGranted);
        UsbManager usbManager = (UsbManager) this.activity.getSystemService(Context.USB_SERVICE);

        if (this.connected == Connected.True) {
            mLogger.info("scanner engine already connected.");
            return ValueResult.Success(null);
        }

        Detector.ScannerInfo[] scanners = Detector.detectScanners(activity);
        if (scanners.length== 0) {
            mLogger.error("scanner device is not found. returns");
            return ValueResult.Failure("connection failed: device not found");
        }

        UsbDevice device = scanners[0].getDevice();
        final int deviceId = device.getDeviceId();
        final int port = scanners[0].getPort();
        final int baudRate = 19200;

        mLogger.info(String.format("device found. deviceId = %s, port = %s", deviceId, port));

        UsbSerialDriver driver = UsbSerialProber.getDefaultProber().probeDevice(device);
        if(driver == null) {
            mLogger.error(LoggerEnums.driverNotFound.toString());
            return ValueResult.Failure("connection failed: no driver for device");
        }

        if(driver.getPorts().size() < port) {
            mLogger.error(LoggerEnums.notEnoughPorts.toString());
            return ValueResult.Failure("connection failed: not enough ports at device");
        }

        this.usbSerialPort = driver.getPorts().get(port);
        UsbDeviceConnection usbConnection = usbManager.openDevice(driver.getDevice());
        if(usbConnection == null && permissionGranted == null && !usbManager.hasPermission(driver.getDevice())) {
            usbManager.requestPermission(device, IntentHelper.createGrantUsbPermissionPendingIntent(this.activity));
            mLogger.error(LoggerEnums.permissionRequested.toString());
            return ValueResult.Failure("connection failed: permission requested");
        }

        if(usbConnection == null) {
            if (!usbManager.hasPermission(driver.getDevice())) {
                mLogger.error(LoggerEnums.permissionDenied.toString());
                return ValueResult.Failure("connection failed: permission denied");
            }
            else {
                mLogger.error(LoggerEnums.openFailed.toString());
                return ValueResult.Failure("connection failed: open failed");
            }
        }

       changeStatus(Connected.Pending);
        try {
            this.usbSerialPort.open(usbConnection);
            try {
                this.usbSerialPort.setParameters(baudRate, UsbSerialPort.DATABITS_8, UsbSerialPort.STOPBITS_1, UsbSerialPort.PARITY_NONE);
            } catch (UnsupportedOperationException e) {
                mLogger.error(LoggerEnums.setSettingParams.toString() + e.getMessage());
                return ValueResult.Failure("Setting serial parameters failed: " + e.getMessage());
            }
            SerialSocket socket = new SerialSocket(mAppContext, usbConnection, this.usbSerialPort);
            this.service.connect(socket);
            // usb connect is not asynchronous. connect-success and connect-error are returned immediately from socket.connect
            // for consistency to bluetooth/bluetooth-LE app use same SerialListener and SerialService classes
            onSerialConnect();
        } catch (Exception e) {
            onSerialConnectError(e);
        }

        return ValueResult.Success(null);
    }

    private void changeStatus(Connected status) {
        mLogger.info("ScannerEngine.changeStatus to " + status.toString());

        this.connected = status;

        boolean value = status == Connected.True;
        mLogger.info("Globals.setScannerConnected = " + value);
        Globals.setScannerConnected(value);
    }

    public void publicDisconnect() {
        disconnect(false);
    }

    private void disconnect(boolean needReconnect) {
        mLogger.info("ScannerEngine.disconnect. needReconnect = " + needReconnect);
        changeStatus(Connected.False);
        mLogger.info("ScannerEngine.service.disconnect");
        this.service.disconnect();
        this.usbSerialPort = null;

        if (needReconnect)
            connect();
    }

    private void receive(ArrayDeque<byte[]> datas) {
        SpannableStringBuilder spn = new SpannableStringBuilder();
        for (byte[] data : datas) {
            String msg = new String(data);
            spn.append(msg);
        }

        String value = spn.toString();
        mLogger.info("ScannerEngine.receive " + value);
        if (this.listener != null)
            this.listener.onRead(value);
    }
}
