package com.izigo.smartsaleterminal.operations;

import com.izigo.smartsaleterminal.enums.PosTerminalOperation;

public abstract class PosActivityRequestBase {
    protected final PosTerminalOperation mOperationId;
    protected final String mTerminalId;
    private String mRawData;

    protected PosActivityRequestBase(PosTerminalOperation operation, String terminalId) {
        mOperationId = operation;
        mTerminalId = terminalId;
    }

    public String getTerminalId() {
        return mTerminalId;
    }

    public int getOperationId() {
        return mOperationId.getValue();
    }
    public String getOperationName() { return mOperationId.getName(); }

    public String getRawData() { return mRawData; }

    public void setRawData(String value) { mRawData = value; }
}
