package com.izigo.smartsaleterminal.operations;

import androidx.annotation.NonNull;

import com.izigo.smartsaleterminal.enums.PosActivityResultCode;
import com.izigo.smartsaleterminal.enums.PosTerminalOperation;
import com.izigo.utils.ValueResult;
import ru.inpas.connector.lib.SAParam;

public abstract class PosActivityResponseBase {
    protected final PosTerminalOperation mOperationId;
    protected final String mTerminalId;
    private final PosActivityResultCode mResultCode;
    private final String mErrorMessage;
    private String mRawData;

    protected PosActivityResponseBase(PosTerminalOperation operation, String terminalId,
                                      PosActivityResultCode resultCode, String errorMessage) {
        mOperationId = operation;
        mTerminalId = terminalId;
        mResultCode = resultCode;
        mErrorMessage = errorMessage;
    }

    public static ValueResult<Object> validateResponseAttributes(PosTerminalOperation operation, String terminalId, @NonNull SAParam responseResult) {
        final int responseOperationId = responseResult.getInteger(SAParam.ID.SAF_OPER_ID);
        final String responseTerminalId = responseResult.getString(SAParam.ID.SAF_TERMINAL_ID);

        if (operation.getValue() != responseOperationId)
            return ValueResult.Failure(
                    String.format("OperationId (%d) is not equals to %d",
                            responseOperationId,
                            operation.getValue())
            );

        if (!terminalId.equalsIgnoreCase(responseTerminalId))
            return ValueResult.Failure(
                    String.format("TerminalId (%s) is not equals to %s",
                            responseTerminalId,
                            terminalId)
            );

        return ValueResult.Success(null);
    }

    public String getTerminalId() {
        return mTerminalId;
    }

    public int getOperationId() {
        return mOperationId.getValue();
    }

    public String getOperationName() {
        return mOperationId.getName();
    }

    public PosActivityResultCode getResponseCode() { return mResultCode;}

    public String getErrorMessage() { return mErrorMessage;}

    public String getRawData() { return mRawData; }

    public void setRawData(String value) { mRawData = value; }
}
