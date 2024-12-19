package com.izigo.smartsaleterminal.enums;

import ru.inpas.connector.lib.PosExchange;

/**
 * Our wrapper over PosExchange.Result
 */
public enum PosActivityResultCode {
    UNKNOWN(-1),
    DONE(0),
    PROCESSING(1),
    ERROR(2),
    BT_ADAPTER_NOT_FOUND(3),
    BT_ADAPTER_DISABLED(4),
    BT_NOT_PAIRED_DEVICES(5),
    BT_DEVICE_NOT_FOUND(6),
    DEVICE_CONNECT_ERROR(7),
    SEND_ERROR(8),
    READ_ERROR(9),
    NAK_ERROR(10),
    CRC_ERROR(11),
    PACKET_ERROR(12),
    USB_DEVICE_NOT_FOUND(13),
    USB_DEVICE_ERROR(14);

    private final int mValue;

    PosActivityResultCode(final int value) {
        mValue = value;
    }

    public int getValue() { return mValue;}

    public static PosActivityResultCode convertFrom(PosExchange.Result result) {
        switch (result) {
            case DONE: return PosActivityResultCode.DONE;
            case PROCESSING: return PosActivityResultCode.PROCESSING;
            case ERROR: return PosActivityResultCode.ERROR;
            case BT_ADAPTER_NOT_FOUND: return PosActivityResultCode.BT_ADAPTER_NOT_FOUND;
            case BT_ADAPTER_DISABLED: return PosActivityResultCode.BT_ADAPTER_DISABLED;
            case BT_NOT_PAIRED_DEVICES: return PosActivityResultCode.BT_NOT_PAIRED_DEVICES;
            case BT_DEVICE_NOT_FOUND: return PosActivityResultCode.BT_DEVICE_NOT_FOUND;
            case DEVICE_CONNECT_ERROR: return PosActivityResultCode.DEVICE_CONNECT_ERROR;
            case SEND_ERROR: return PosActivityResultCode.SEND_ERROR;
            case READ_ERROR: return PosActivityResultCode.READ_ERROR;
            case NAK_ERROR: return PosActivityResultCode.NAK_ERROR;
            case CRC_ERROR: return PosActivityResultCode.CRC_ERROR;
            case PACKET_ERROR: return PosActivityResultCode.PACKET_ERROR;
            case USB_DEVICE_NOT_FOUND: return PosActivityResultCode.USB_DEVICE_NOT_FOUND;
            case USB_DEVICE_ERROR: return PosActivityResultCode.USB_DEVICE_ERROR;
            default: return PosActivityResultCode.UNKNOWN;
        }
    }
}
