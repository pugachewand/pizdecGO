package com.izigo.smartsaleterminal.enums;

import ru.inpas.connector.lib.SAParam;

/**
 * Our wrapper over SAParam.STATUS. Field SAParam.ID.SAF_TRX_STATUS (39)
 */
public enum PosTerminalOperationStatus {
    INVALID_TERMINAL_ID(-3),
    ERROR(-2),
    UNKNOWN(-1),
    UNDEFINED(0),
    APPROVED(1),
    EMERGENCY_CANCEL(13),
    DENIED(16),
    APPROVED_OFFLINE(17),
    NO_CONNECTION(34),
    OPERATION_ABORTED(53);

    private final int mValue;

    private PosTerminalOperationStatus(int value) {
        this.mValue = value;
    }

    public int getValue() {
        return this.mValue;
    }

    public static PosTerminalOperationStatus convertFromEnum(SAParam.STATUS status) {
        switch (status) {
            case UNDEFINED: return PosTerminalOperationStatus.UNDEFINED;
            case APPROVED: return PosTerminalOperationStatus.APPROVED;
            case EMERGENCY_CANCEL: return PosTerminalOperationStatus.EMERGENCY_CANCEL;
            case DENIED: return PosTerminalOperationStatus.DENIED;
            case APPROVED_OFFLINE: return PosTerminalOperationStatus.APPROVED_OFFLINE;
            case NO_CONNECTION: return PosTerminalOperationStatus.NO_CONNECTION;
            case OPERATION_ABORTED: return PosTerminalOperationStatus.OPERATION_ABORTED;
            default: return PosTerminalOperationStatus.UNKNOWN;
        }
    }

    public static SAParam.STATUS convertFromInt(int value) {
        for (SAParam.STATUS status : SAParam.STATUS.values()) {
            if (status.getValue() == value)
                return status;
        }
        throw new IllegalArgumentException(
                String.format("Can't case integer to SAParam.STATUS. Invalid value (%d).", value));
    }
}
