package com.izigo.scanner;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbDeviceConnection;
import android.util.Log;

import com.hoho.android.usbserial.driver.UsbSerialPort;
import com.hoho.android.usbserial.util.SerialInputOutputManager;

import java.io.IOException;
import java.security.InvalidParameterException;

public class SerialSocket implements SerialInputOutputManager.Listener {
    private final static String TAG = SerialSocket.class.getSimpleName();

    private final BroadcastReceiver disconnectBroadcastReceiver;

    private final Context context;
    private UsbDeviceConnection connection;
    private UsbSerialPort serialPort;
    private SerialListener listener;
    private SerialInputOutputManager ioManager;

    SerialSocket(Context context, UsbDeviceConnection connection, UsbSerialPort serialPort) {
        if(context instanceof Activity)
            throw new InvalidParameterException("expected non UI context");
        this.context = context;
        this.connection = connection;
        this.serialPort = serialPort;
        this.disconnectBroadcastReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (listener != null)
                    listener.onSerialIoError(new IOException("background disconnect"));
                disconnect(); // disconnect now, else would be queued until UI re-attached
            }
        };
    }

    String getName() { return this.serialPort.getDriver().getClass().getSimpleName().replace("SerialDriver",""); }

    void connect(SerialListener listener) throws IOException {
        this.listener = listener;
        this.context.registerReceiver(this.disconnectBroadcastReceiver, new IntentFilter(Constants.INTENT_ACTION_DISCONNECT));
        try {
            this.serialPort.setDTR(true); // for arduino, ...
            this.serialPort.setRTS(true);
        } catch (UnsupportedOperationException e) {
            Log.d(TAG, "Failed to set initial DTR/RTS", e);
        }
        this.ioManager = new SerialInputOutputManager(this.serialPort, this);
        this.ioManager.start();
    }

    void disconnect() {
        this.listener = null; // ignore remaining data and errors
        if (this.ioManager != null) {
            this.ioManager.setListener(null);
            this.ioManager.stop();
            this.ioManager = null;
        }
        if (this.serialPort != null) {
            try {
                this.serialPort.setDTR(false);
                this.serialPort.setRTS(false);
            } catch (Exception ignored) {
            }
            try {
                this.serialPort.close();
            } catch (Exception ignored) {
            }
            this.serialPort = null;
        }
        if(this.connection != null) {
            this.connection.close();
            this.connection = null;
        }
        try {
            this.context.unregisterReceiver(this.disconnectBroadcastReceiver);
        } catch (Exception ignored) {
        }
    }

    @Override
    public void onNewData(byte[] data) {
        if (this.listener != null)
            this.listener.onSerialRead(data);
    }

    @Override
    public void onRunError(Exception e) {
        if (this.listener != null)
            this.listener.onSerialIoError(e);
    }
}
