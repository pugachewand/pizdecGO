package com.izigo.scanner;

import android.content.Context;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;

import androidx.annotation.NonNull;

import com.hoho.android.usbserial.driver.UsbSerialDriver;
import com.hoho.android.usbserial.driver.UsbSerialProber;

import java.util.ArrayList;

import com.izigo.MainActivity;
import com.izigo.utils.UsbPermissionHelper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class Detector {
    public static final int SUPERLEAD_VENDOR_ID = 11734;

    public static class ScannerInfo {
        @NonNull
        private final UsbDevice device;
        private final int port;
        @NonNull
        private final UsbSerialDriver driver;

        public ScannerInfo(@NonNull UsbDevice device, int port, @NonNull UsbSerialDriver driver) {
            this.device = device;
            this.port = port;
            this.driver = driver;
        }

        @NonNull
        public UsbDevice getDevice() { return device; }

        public int getPort() { return port; }

        @NonNull
        public UsbSerialDriver getDriver() { return driver; }
    }

    public static ScannerInfo[] detectScanners(Context context) {
        ArrayList<ScannerInfo> scanners = new ArrayList<>();

        UsbManager usbManager = (UsbManager) context.getSystemService(Context.USB_SERVICE);
        UsbSerialProber usbDefaultProber = UsbSerialProber.getDefaultProber();

        for(UsbDevice device : usbManager.getDeviceList().values()) {
            UsbSerialDriver driver = usbDefaultProber.probeDevice(device);
            if (driver != null) {
                for(int port = 0; port < driver.getPorts().size(); port++) {
                    scanners.add(new ScannerInfo(device, port, driver));
                }
            }
        }

        ScannerInfo[] array = new ScannerInfo[scanners.size()];
        return scanners.toArray(array);
    }

    public static boolean isScanner(UsbDevice device) {
        if (device == null)
            return false;

        return device.getVendorId() == SUPERLEAD_VENDOR_ID;
    }

    public static void checkAndRequestUsbPermission(Context context, UsbDevice device) {
        Logger logger = LoggerFactory.getLogger(MainActivity.class);
        UsbManager usbManager = (UsbManager) context.getSystemService(Context.USB_SERVICE);

        logger.info("Detector.checkAndRequestUsbPermission scanner device::: " + device +
                "\ngetDeviceId::: " + device.getDeviceId() +
                "\ngetVendorId::: " + device.getVendorId() +
                "\ngetDeviceClass::: " + device.getDeviceClass() +
                "\ngetDeviceSubclass::: " + device.getDeviceSubclass());

        if (!usbManager.hasPermission(device)) {
            logger.info(" lets request permission for device");
            usbManager.requestPermission(device, IntentHelper.createGrantUsbPermissionPendingIntent(context));
        } else
            logger.info(" has permission for device");
    }
}
