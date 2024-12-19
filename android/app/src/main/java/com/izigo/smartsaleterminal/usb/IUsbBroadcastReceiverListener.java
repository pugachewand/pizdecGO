package com.izigo.smartsaleterminal.usb;

public interface IUsbBroadcastReceiverListener {
    void onChanged(Boolean attached, Boolean hasPermission);
}
