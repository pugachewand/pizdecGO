package com.izigo.smartsaleterminal.enums;

import ru.inpas.connector.lib.SAOperation;

/**
 * Our wrapper over SAOperation. Field SAParam.ID.SAF_OPER_ID (25)
 */
public enum PosTerminalOperation {
    Unknown(0, "UNKNOWN"),
    GET_CONNECT_STATUS(SAOperation.SAO_TEST_CONNECTION.getValue(), "GET_CONNECT_STATUS"),
    MAKE_PAYMENT(SAOperation.SAO_SALE.getValue(), "MAKE_PAYMENT"),
    CANCEL_PAYMENT(SAOperation.SAO_VOID.getValue(), "CANCEL_PAYMENT"),
    MAKE_REFUND(SAOperation.SAO_RETURN.getValue(), "MAKE_REFUND"),
    RECONCILIATION_OF_TOTALS(SAOperation.SAO_SETTLEMENT.getValue(), "RECONCILIATION_OF_TOTALS"),
    CUSTOM_COMMAND(SAOperation.SAO_CUSTOMIZED.getValue(), "CUSTOM_COMMAND");

    private final int mValue;
    private final String mName;

    private PosTerminalOperation(int value, String name)
    {
        mValue = value;
        mName = name;
    }

    public int getValue() {
        return mValue;
    }
    public String getName() { return mName; }
}
