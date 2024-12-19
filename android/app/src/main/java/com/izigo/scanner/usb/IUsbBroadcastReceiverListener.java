package com.izigo.scanner.usb;

public interface IUsbBroadcastReceiverListener {
    void onChanged(boolean attached, boolean granted);
}
