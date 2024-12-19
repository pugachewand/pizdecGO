package com.izigo.smartsaleterminal.usb;

import android.content.Context;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;

import com.izigo.MainActivity;
import com.izigo.utils.UsbPermissionHelper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UsbHelper {
    public static final String ACTION_USB_PERMISSION = "com.android.example.USB_PERMISSION"; // inpas permission name
    public static final int POS_TERMINAL_PERMISSION_ID = 1;
    public static final int PAX_200_VENDOR_ID = 4660;
    private static final Logger logger = LoggerFactory.getLogger(MainActivity.class);

    public static UsbDevice detectPaxAndRequestUsbPermission(Context context) {
        logger.info("UsbHelper.detectPaxAndRequestUsbPermission");

        UsbManager usbManager = (UsbManager) context.getSystemService(Context.USB_SERVICE);
        for (UsbDevice device : usbManager.getDeviceList().values()) {
            logger.info(" found device::: " + device +
                    "\ngetDeviceId::: " + device.getDeviceId() +
                    "\ngetVendorId::: " + device.getVendorId() +
                    "\ngetDeviceClass::: " + device.getDeviceClass() +
                    "\ngetDeviceSubclass::: " + device.getDeviceSubclass());
            if (!isPaxDevice(device)) {
                logger.info(" - !isPaxDevice()");
                continue;
            } else
                logger.info(" - isPaxDevice()");

            if (!usbManager.hasPermission(device)) {
                logger.info(" lets request permission for device");
                usbManager.requestPermission(device, UsbPermissionHelper.createPendingIntent(context, ACTION_USB_PERMISSION, POS_TERMINAL_PERMISSION_ID));
            } else
                logger.info(" has permission for device");

            return device;
        }

        return null;
    }

    public static boolean isPaxDevice(UsbDevice device) {
        if (device == null)
            return false;

        return device.getVendorId() == PAX_200_VENDOR_ID;
    }
}
