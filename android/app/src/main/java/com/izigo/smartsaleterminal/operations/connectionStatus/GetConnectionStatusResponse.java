package com.izigo.smartsaleterminal.operations.connectionStatus;

import androidx.annotation.NonNull;

import com.izigo.smartsaleterminal.enums.PosTerminalOperationStatus;
import com.izigo.smartsaleterminal.enums.PosActivityResultCode;
import com.izigo.smartsaleterminal.enums.PosTerminalOperation;
import com.izigo.smartsaleterminal.operations.PosActivityResponseBase;
import com.izigo.smartsaleterminal.operations.PosActivityResponseHelper;
import com.izigo.utils.ValueResult;
import ru.inpas.connector.lib.PosExchange;
import ru.inpas.connector.lib.SAParam;

public final class GetConnectionStatusResponse extends PosActivityResponseBase {
    private PosTerminalOperationStatus mPosTerminalOperationStatus = PosTerminalOperationStatus.UNDEFINED;
    private String mAdditionalResponseData;

    private GetConnectionStatusResponse(PosTerminalOperation operation, String terminalId,
                                          PosActivityResultCode resultCode, String errorMessage) {
        super(operation, terminalId, resultCode, errorMessage);
    }

    /**
     * APPROVED: возвращается при успешной проверке соединения.
     * DENIED: возвращается при ошибке соединения с банком (нет sim, к примеру).
     */
    public PosTerminalOperationStatus getPosTerminalOperationStatus() { return mPosTerminalOperationStatus; }
    private void setPosTerminalOperationStatus(PosTerminalOperationStatus value) { mPosTerminalOperationStatus = value; }

    public String getAdditionalResponseData() { return mAdditionalResponseData; }
    public void setAdditionalResponseData(String value) { mAdditionalResponseData = value; }

    private static GetConnectionStatusResponse createFailed(
            PosTerminalOperation operation, String terminalId,
            PosTerminalOperationStatus status, PosActivityResultCode resultCode, String errorMessage) {

        GetConnectionStatusResponse response = new GetConnectionStatusResponse(operation, terminalId, resultCode, errorMessage);

        response.setPosTerminalOperationStatus(status);

        return response;
    }

    /**
     * Создает и возвращает ответ выполнения операции.
     * 1. Если результат обмена через PosExchange не равен DONE, то вернуть ошибку (общая ошибка, н-р, не достучались до терминала).
     * 2. Если полученный ответ не соответствует нашей операции на нашем терминале, то это ошибка (защита от дурака).
     */
    @NonNull
    public static GetConnectionStatusResponse create(
            @NonNull PosTerminalOperation operation, @NonNull String terminalId,
            @NonNull PosExchange.Result result, SAParam responseResult
    ) {
        if (result != PosExchange.Result.DONE) // пункт 1
            return createFailed(operation, terminalId, PosTerminalOperationStatus.ERROR,
                    PosActivityResultCode.convertFrom(result), "Some error occurred during request executing.");

        ValueResult<Object> validationResult = validateResponseAttributes(operation, terminalId, responseResult);
        if (!validationResult.getSucceeded()) // пункт 2
            return createFailed(operation, terminalId, PosTerminalOperationStatus.INVALID_TERMINAL_ID,
                    PosActivityResultCode.UNKNOWN, validationResult.getErrorMessage());

        GetConnectionStatusResponse response = new GetConnectionStatusResponse(operation, terminalId,
                PosActivityResultCode.convertFrom(result), null);

        response.setPosTerminalOperationStatus(PosActivityResponseHelper.ExtractPosTerminalOperationStatus(responseResult)); //SAF_TRX_STATUS
        response.setAdditionalResponseData(responseResult.getString(SAParam.ID.SAF_ADD_RESPONSE_DATA));

        return response;
    }
}
