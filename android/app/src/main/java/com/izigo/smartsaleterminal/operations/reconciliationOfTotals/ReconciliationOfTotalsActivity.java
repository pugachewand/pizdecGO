package com.izigo.smartsaleterminal.operations.reconciliationOfTotals;

import android.content.Context;

import androidx.annotation.NonNull;

import com.izigo.smartsaleterminal.enums.PosTerminalOperation;
import com.izigo.smartsaleterminal.operations.PosActivityBase;
import com.izigo.smartsaleterminal.operations.PosActivityProgressEvent;
import com.izigo.smartsaleterminal.operations.PosExchangeSettings;
import ru.inpas.connector.lib.PosExchange;
import ru.inpas.connector.lib.SAParam;

public final class ReconciliationOfTotalsActivity extends PosActivityBase<ReconciliationOfTotalsRequest, ReconciliationOfTotalsResponse> {

    @NonNull
    private final IReconciliationOfTotalsAsyncHandler mAsyncHandler;

    public ReconciliationOfTotalsActivity(
            @NonNull IReconciliationOfTotalsAsyncHandler asyncHandler, @NonNull Context context,
            @NonNull PosExchangeSettings posExchangeSettings) {
        super(context, posExchangeSettings);
        mAsyncHandler = asyncHandler;
    }

    @Override
    protected void FillSaRequestParameters(SAParam saRequest, ReconciliationOfTotalsRequest request) {
        saRequest.putString(SAParam.ID.SAF_MODELNO, mPosExchangeSettings.MODEL_NO);
    }

    @Override
    protected ReconciliationOfTotalsResponse ProcessOperationResult(PosExchange.Result result, SAParam response) {
        return ReconciliationOfTotalsResponse.create(
                PosTerminalOperation.RECONCILIATION_OF_TOTALS,
                mPosExchangeSettings.getTerminalId(),
                result,
                response
        );
    }

    @Override
    protected void InternalOnProgress(PosActivityProgressEvent progressEvent) {
        mAsyncHandler.OnProgress(progressEvent);
    }

    @Override
    protected void InternalOnDone(ReconciliationOfTotalsResponse result) {
        mAsyncHandler.OnDone(result);
    }
}
