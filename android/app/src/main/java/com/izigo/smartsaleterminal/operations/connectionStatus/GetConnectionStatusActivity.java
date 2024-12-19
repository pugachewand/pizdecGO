package com.izigo.smartsaleterminal.operations.connectionStatus;

import android.content.Context;

import androidx.annotation.NonNull;

import com.izigo.smartsaleterminal.enums.PosTerminalOperation;
import com.izigo.smartsaleterminal.operations.PosActivityBase;
import com.izigo.smartsaleterminal.operations.PosActivityProgressEvent;
import com.izigo.smartsaleterminal.operations.PosExchangeSettings;
import ru.inpas.connector.lib.PosExchange;
import ru.inpas.connector.lib.SAParam;

public final class GetConnectionStatusActivity extends PosActivityBase<GetConnectionStatusRequest, GetConnectionStatusResponse> {

    @NonNull
    private final IGetConnectionStatusAsyncHandler mAsyncHandler;

    public GetConnectionStatusActivity(
            @NonNull IGetConnectionStatusAsyncHandler asyncHandler, @NonNull Context context,
            @NonNull PosExchangeSettings posExchangeSettings) {
        super(context, posExchangeSettings);
        mAsyncHandler = asyncHandler;
    }

    @Override
    protected void FillSaRequestParameters(SAParam saRequest, GetConnectionStatusRequest request) {
        // no other parameters
    }

    @Override
    protected GetConnectionStatusResponse ProcessOperationResult(PosExchange.Result result, SAParam response) {
        return GetConnectionStatusResponse.create(
                PosTerminalOperation.GET_CONNECT_STATUS,
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
    protected void InternalOnDone(GetConnectionStatusResponse result) {
        mAsyncHandler.OnDone(result);
    }
}