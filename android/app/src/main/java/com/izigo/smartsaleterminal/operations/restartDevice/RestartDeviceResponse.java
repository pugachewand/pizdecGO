package com.izigo.smartsaleterminal.operations.restartDevice;

import androidx.annotation.NonNull;

import com.izigo.smartsaleterminal.enums.PosActivityResultCode;
import com.izigo.smartsaleterminal.enums.PosTerminalOperation;
import com.izigo.smartsaleterminal.enums.PosTerminalOperationStatus;
import com.izigo.smartsaleterminal.operations.PosActivityResponseBase;

import ru.inpas.connector.lib.PosExchange;
import ru.inpas.connector.lib.SAParam;

public class RestartDeviceResponse extends PosActivityResponseBase {
    private PosTerminalOperationStatus  mPosTerminalOperationStatus = PosTerminalOperationStatus.UNDEFINED;
    private Integer mNativeResult;

    private RestartDeviceResponse(PosTerminalOperation operation, String terminalId,
                                PosActivityResultCode resultCode, String errorMessage) {
        super(operation, terminalId, resultCode, errorMessage);
    }

    public PosTerminalOperationStatus getPosTerminalOperationStatus() { return mPosTerminalOperationStatus; }
    private void setPosTerminalOperationStatus(PosTerminalOperationStatus value) { mPosTerminalOperationStatus = value; }

    public Integer getNativeResult() { return mNativeResult; }
    private void setNativeResult(Integer value) { mNativeResult = value; }

    private static RestartDeviceResponse createFailed(
            PosTerminalOperation operation, String terminalId, PosActivityResultCode resultCode, String errorMessage) {

        RestartDeviceResponse response = new RestartDeviceResponse(operation, terminalId, resultCode, errorMessage);

        response.setPosTerminalOperationStatus(PosTerminalOperationStatus.ERROR);

        return response;
    }

    /**
     * Создает и возвращает ответ выполнения операции.
     * 1. Если результат обмена через PosExchange не равен DONE, то вернуть ошибку (общая ошибка, н-р, не достучались до терминала).
     * 2. Если полученный ответ не соответствует нашей операции на нашем терминале, то это ошибка (защита от дурака).
     */
    @NonNull
    public static RestartDeviceResponse create(
            @NonNull PosTerminalOperation operation, @NonNull String terminalId,
            @NonNull PosExchange.Result result, @NonNull SAParam responseResult
    ) {
        if (result != PosExchange.Result.DONE) // 1
            return createFailed(operation, terminalId, PosActivityResultCode.convertFrom(result), "Some error occurred during request executing.");

        RestartDeviceResponse response = new RestartDeviceResponse(operation, terminalId,
                PosActivityResultCode.convertFrom(result), null);

        final Integer nativeCommandResult = responseResult.getInteger(SAParam.ID.SAF_RESULT);
        response.setNativeResult(nativeCommandResult);

        final PosTerminalOperationStatus status = (nativeCommandResult == 0)
                ? PosTerminalOperationStatus.APPROVED
                : PosTerminalOperationStatus.ERROR;
        response.setPosTerminalOperationStatus(status);

        return response;
    }
}
