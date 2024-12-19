package com.izigo.smartsaleterminal.operations.restartDevice;

import android.content.Context;

import androidx.annotation.NonNull;

import com.izigo.smartsaleterminal.enums.PosTerminalOperation;
import com.izigo.smartsaleterminal.operations.PosActivityBase;
import com.izigo.smartsaleterminal.operations.PosActivityProgressEvent;
import com.izigo.smartsaleterminal.operations.PosExchangeSettings;

import ru.inpas.connector.lib.PosExchange;
import ru.inpas.connector.lib.SAParam;

public final class RestartDeviceActivity extends PosActivityBase<RestartDeviceRequest, RestartDeviceResponse> {

    @NonNull
    private final IRestartDeviceAsyncHandler mAsyncHandler;

    public RestartDeviceActivity(
        @NonNull IRestartDeviceAsyncHandler asyncHandler, @NonNull Context context,
        @NonNull PosExchangeSettings posExchangeSettings) {
        super(context, posExchangeSettings);
        mAsyncHandler = asyncHandler;
    }

    @Override
    protected void FillSaRequestParameters(SAParam saRequest, RestartDeviceRequest request) {
        saRequest.putString(SAParam.ID.SAF_CMD_MODE2, request.getUserCommandId());
    }

    @Override
    protected RestartDeviceResponse ProcessOperationResult(PosExchange.Result result, SAParam response) {
        return RestartDeviceResponse.create(
                PosTerminalOperation.CUSTOM_COMMAND,
                mPosExchangeSettings.getTerminalId(),
                result,
                response
        );
    }

    @Override
    protected void InternalOnDone(RestartDeviceResponse result) {
        mAsyncHandler.OnDone(result);
    }

    @Override
    protected void InternalOnProgress(PosActivityProgressEvent progressEvent) {
        mAsyncHandler.OnProgress(progressEvent);
    }
}
