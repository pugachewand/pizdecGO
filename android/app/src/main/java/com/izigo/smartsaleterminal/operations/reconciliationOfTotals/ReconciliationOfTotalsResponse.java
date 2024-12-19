package com.izigo.smartsaleterminal.operations.reconciliationOfTotals;

import androidx.annotation.NonNull;

import com.izigo.smartsaleterminal.enums.PosActivityResultCode;
import com.izigo.smartsaleterminal.enums.PosTerminalOperation;
import com.izigo.smartsaleterminal.enums.PosTerminalOperationStatus;
import com.izigo.smartsaleterminal.operations.PosActivityResponseBase;
import com.izigo.smartsaleterminal.operations.PosActivityResponseHelper;
import com.izigo.utils.ValueResult;
import ru.inpas.connector.lib.PosExchange;
import ru.inpas.connector.lib.SAParam;

public class ReconciliationOfTotalsResponse extends PosActivityResponseBase {
    private PosTerminalOperationStatus mPosTerminalOperationStatus = PosTerminalOperationStatus.UNDEFINED;
    private Integer mTransactionIdInExternalDevice;
    private String mAdditionalResponseData;

    private ReconciliationOfTotalsResponse(PosTerminalOperation operation, String terminalId,
                                           PosActivityResultCode resultCode, String errorMessage) {
        super(operation, terminalId, resultCode, errorMessage);
    }

    public PosTerminalOperationStatus getPosTerminalOperationStatus() { return mPosTerminalOperationStatus; }
    private void setPosTerminalOperationStatus(PosTerminalOperationStatus value) { mPosTerminalOperationStatus = value; }

    public Integer getTransactionIdInExternalDevice() { return mTransactionIdInExternalDevice; }
    public void setTransactionIdInExternalDevice(Integer value) { mTransactionIdInExternalDevice = value; }

    public String getAdditionalResponseData() { return mAdditionalResponseData; }
    public void setAdditionalResponseData(String value) { mAdditionalResponseData = value; }

    private static ReconciliationOfTotalsResponse createFailed(
            PosTerminalOperation operation, String terminalId, PosActivityResultCode resultCode, String errorMessage) {

        ReconciliationOfTotalsResponse response = new ReconciliationOfTotalsResponse(operation, terminalId, resultCode, errorMessage);

        response.setPosTerminalOperationStatus(PosTerminalOperationStatus.ERROR);

        return response;
    }

    @NonNull
    public static ReconciliationOfTotalsResponse create(
            @NonNull PosTerminalOperation operation, @NonNull String terminalId,
            @NonNull PosExchange.Result result, SAParam responseResult
    ) {
        if (result != PosExchange.Result.DONE)
            return createFailed(operation, terminalId, PosActivityResultCode.convertFrom(result), "Some error occurred during request executing.");

        ReconciliationOfTotalsResponse response = new ReconciliationOfTotalsResponse(operation, terminalId,
                PosActivityResultCode.convertFrom(result), null);

        response.setPosTerminalOperationStatus(PosActivityResponseHelper.ExtractPosTerminalOperationStatus(responseResult));
        response.setTransactionIdInExternalDevice(responseResult.getInteger(SAParam.ID.SAF_STAN));
        response.setAdditionalResponseData(responseResult.getString(SAParam.ID.SAF_ADD_RESPONSE_DATA));

        return response;
    }
}
