package com.izigo.smartsaleterminal.paymentService;

import android.content.Context;

import androidx.annotation.NonNull;

import com.izigo.MainActivity;
import com.izigo.smartsaleterminal.enums.PosTerminalOperationStatus;
import com.izigo.smartsaleterminal.operations.PosActivityProgressEvent;
import com.izigo.smartsaleterminal.operations.PosExchangeSettings;
import com.izigo.smartsaleterminal.operations.cancelPayment.CancelPaymentActivity;
import com.izigo.smartsaleterminal.operations.cancelPayment.CancelPaymentRequest;
import com.izigo.smartsaleterminal.operations.cancelPayment.CancelPaymentResponse;
import com.izigo.smartsaleterminal.operations.cancelPayment.ICancelPaymentAsyncHandler;
import com.izigo.smartsaleterminal.operations.connectionStatus.GetConnectionStatusActivity;
import com.izigo.smartsaleterminal.operations.connectionStatus.GetConnectionStatusRequest;
import com.izigo.smartsaleterminal.operations.connectionStatus.GetConnectionStatusResponse;
import com.izigo.smartsaleterminal.operations.connectionStatus.IGetConnectionStatusAsyncHandler;
import com.izigo.smartsaleterminal.operations.makePayment.IMakePaymentAsyncHandler;
import com.izigo.smartsaleterminal.operations.makePayment.MakePaymentActivity;
import com.izigo.smartsaleterminal.operations.makePayment.MakePaymentRequest;
import com.izigo.smartsaleterminal.operations.makePayment.MakePaymentResponse;
import com.izigo.smartsaleterminal.operations.makeRefund.IMakeRefundAsyncHandler;
import com.izigo.smartsaleterminal.operations.makeRefund.MakeRefundActivity;
import com.izigo.smartsaleterminal.operations.makeRefund.MakeRefundRequest;
import com.izigo.smartsaleterminal.operations.makeRefund.MakeRefundResponse;
import com.izigo.smartsaleterminal.operations.reconciliationOfTotals.IReconciliationOfTotalsAsyncHandler;
import com.izigo.smartsaleterminal.operations.reconciliationOfTotals.ReconciliationOfTotalsActivity;
import com.izigo.smartsaleterminal.operations.reconciliationOfTotals.ReconciliationOfTotalsRequest;
import com.izigo.smartsaleterminal.operations.reconciliationOfTotals.ReconciliationOfTotalsResponse;
import com.izigo.smartsaleterminal.operations.restartDevice.IRestartDeviceAsyncHandler;
import com.izigo.smartsaleterminal.operations.restartDevice.RestartDeviceActivity;
import com.izigo.smartsaleterminal.operations.restartDevice.RestartDeviceRequest;
import com.izigo.smartsaleterminal.operations.restartDevice.RestartDeviceResponse;
import com.izigo.utils.StatusValueResult;
import com.izigo.utils.ValueResult;

import org.javamoney.moneta.Money;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.math.BigDecimal;

import ch.qos.logback.classic.LoggerContext;
import ru.inpas.connector.lib.PosExchange;

public final class PaymentService implements
        IPaymentService,
        IGetConnectionStatusAsyncHandler,
        IMakePaymentAsyncHandler,
        ICancelPaymentAsyncHandler,
        IMakeRefundAsyncHandler,
        IReconciliationOfTotalsAsyncHandler,
        IRestartDeviceAsyncHandler
    {
    @NonNull
    private final Context mContext;
    @NonNull
    private final IPaymentServiceCallbackHandler mCallbackHandler;
    @NonNull
    private final PosExchangeSettings mPosExchangeSettings;
    private static final Logger mLogger = LoggerFactory.getLogger(MainActivity.class);

    private PaymentService(@NonNull Context context, @NonNull IPaymentServiceCallbackHandler callbackHandler, @NonNull String terminalId) {
        mContext = context;
        mCallbackHandler = callbackHandler;
        mPosExchangeSettings = createPosExchangeSettings(terminalId);
    }

    @NonNull
    public static IPaymentService create(
            @NonNull Context context,
            @NonNull IPaymentServiceCallbackHandler callbackHandler,
            @NonNull String terminalId
    ) {
        return new PaymentService(context, callbackHandler, terminalId);
    }

    private PosExchangeSettings createPosExchangeSettings(String terminalId) {
        LoggerContext lc = (LoggerContext) LoggerFactory.getILoggerFactory();
        String logPath = lc.getProperty("LOG_DIR");

        File dir = new File(logPath);
        return PosExchangeSettings.createDefaultSettings(terminalId, dir);
    }

    @Override
    public StatusValueResult<GetConnectionStatusRequestDto, PaymentServiceErrorCode> getConnectionStatusAsync() {
        try {
            GetConnectionStatusActivity activity = new GetConnectionStatusActivity(
                    this,
                    mContext,
                    mPosExchangeSettings);

            ValueResult<GetConnectionStatusRequest> sendRequestResult = activity.sendRequest(
                    new GetConnectionStatusRequest(mPosExchangeSettings.getTerminalId()));

            if (!sendRequestResult.getSucceeded())
                return StatusValueResult.Failure(PaymentServiceErrorCode.SEND_REQUEST_ERROR, sendRequestResult.getErrorMessage());

            GetConnectionStatusRequest request = sendRequestResult.getValue();
            GetConnectionStatusRequestDto dto = GetConnectionStatusRequestDto.copyFrom(request);

            return StatusValueResult.Success(dto);
        } catch (Exception ex) {
            return StatusValueResult.Failure(PaymentServiceErrorCode.UNEXPECTED, ex.getMessage());
        }
    }

    @Override
    public void OnDone(GetConnectionStatusResponse result) {
        GetConnectionStatusResponseDto dto = GetConnectionStatusResponseDto.copyFrom(result);
        dto.setOnline(result.getPosTerminalOperationStatus() == PosTerminalOperationStatus.APPROVED);
        mLogger.info(String.valueOf(dto));

        mCallbackHandler.OnDone(dto);
    }

    @Override
    public StatusValueResult<MakePaymentRequestDto, PaymentServiceErrorCode> makePaymentAsync(BigDecimal amount, String currencyIso) {
        try {
            MakePaymentActivity activity = new MakePaymentActivity(
                    this,
                    mContext,
                    mPosExchangeSettings);

            ValueResult<MakePaymentRequest> sendRequestResult = activity.sendRequest(
                    new MakePaymentRequest(mPosExchangeSettings.getTerminalId(), Money.of(amount, currencyIso)));

            if (!sendRequestResult.getSucceeded())
                return StatusValueResult.Failure(PaymentServiceErrorCode.SEND_REQUEST_ERROR, sendRequestResult.getErrorMessage());

            MakePaymentRequest request = sendRequestResult.getValue();
            MakePaymentRequestDto dto = MakePaymentRequestDto.copyFrom(request);

            return StatusValueResult.Success(dto);
        } catch (Exception ex) {
            return StatusValueResult.Failure(PaymentServiceErrorCode.UNEXPECTED, ex.getMessage());
        }
    }

    @Override
    public void OnDone(MakePaymentResponse result) {
        MakePaymentResponseDto dto = MakePaymentResponseDto.copyFrom(result);

        PaymentStatus paymentStatus = result.getPosTerminalOperationStatus() == PosTerminalOperationStatus.APPROVED
                ? PaymentStatus.PAID : PaymentStatus.ERROR;

        dto.setPaymentStatus(paymentStatus);

        mCallbackHandler.OnDone(dto);
    }

    @Override
    public StatusValueResult<CancelPaymentRequestDto, PaymentServiceErrorCode> cancelPaymentAsync(BigDecimal amount, String currencyIso, String authorizeCode, String linkNumberRrn) {
        try {
            CancelPaymentActivity activity = new CancelPaymentActivity(
                    this,
                    mContext,
                    mPosExchangeSettings);

            ValueResult<CancelPaymentRequest> sendRequestResult = activity.sendRequest(
                    new CancelPaymentRequest(mPosExchangeSettings.getTerminalId(), Money.of(amount, currencyIso),
                            authorizeCode, linkNumberRrn));

            if (!sendRequestResult.getSucceeded())
                return StatusValueResult.Failure(PaymentServiceErrorCode.SEND_REQUEST_ERROR, sendRequestResult.getErrorMessage());

            CancelPaymentRequest request = sendRequestResult.getValue();
            CancelPaymentRequestDto dto = CancelPaymentRequestDto.copyFrom(request);

            return StatusValueResult.Success(dto);
        } catch (Exception ex) {
            return StatusValueResult.Failure(PaymentServiceErrorCode.UNEXPECTED, ex.getMessage());
        }
    }

    @Override
    public void OnDone(CancelPaymentResponse result) {
        CancelPaymentResponseDto dto = CancelPaymentResponseDto.copyFrom(result);

        PaymentStatus paymentStatus = result.getPosTerminalOperationStatus() == PosTerminalOperationStatus.APPROVED
                ? PaymentStatus.SUCCESS : PaymentStatus.ERROR;

        dto.setPaymentStatus(paymentStatus);

        mCallbackHandler.OnDone(dto);
    }

    @Override
    public StatusValueResult<MakeRefundRequestDto, PaymentServiceErrorCode> makeRefundAsync(BigDecimal amount, String currencyIso, String authorizeCode, String linkNumberRrn) {
        try {
            MakeRefundActivity activity = new MakeRefundActivity(
                    this,
                    mContext,
                    mPosExchangeSettings);

            ValueResult<MakeRefundRequest> sendRequestResult = activity.sendRequest(
                    new MakeRefundRequest(mPosExchangeSettings.getTerminalId(), Money.of(amount, currencyIso),
                            authorizeCode, linkNumberRrn));

            if (!sendRequestResult.getSucceeded())
                return StatusValueResult.Failure(PaymentServiceErrorCode.SEND_REQUEST_ERROR, sendRequestResult.getErrorMessage());

            MakeRefundRequest request = sendRequestResult.getValue();
            MakeRefundRequestDto dto = MakeRefundRequestDto.copyFrom(request);

            return StatusValueResult.Success(dto);
        } catch (Exception ex) {
            return StatusValueResult.Failure(PaymentServiceErrorCode.UNEXPECTED, ex.getMessage());
        }
    }

    @Override
    public void OnDone(MakeRefundResponse result) {
        MakeRefundResponseDto dto = MakeRefundResponseDto.copyFrom(result);

        PaymentStatus paymentStatus = result.getPosTerminalOperationStatus() == PosTerminalOperationStatus.APPROVED
                ? PaymentStatus.SUCCESS : PaymentStatus.ERROR;

        dto.setPaymentStatus(paymentStatus);

        mCallbackHandler.OnDone(dto);
    }

    @Override
    public StatusValueResult<ReconciliationOfTotalsRequestDto, PaymentServiceErrorCode> reconciliationOfTotalsAsync() {
        try {
            ReconciliationOfTotalsActivity activity = new ReconciliationOfTotalsActivity(
                    this,
                    mContext,
                    mPosExchangeSettings);

            ValueResult<ReconciliationOfTotalsRequest> sendRequestResult = activity.sendRequest(
                    new ReconciliationOfTotalsRequest(mPosExchangeSettings.getTerminalId()));

            if (!sendRequestResult.getSucceeded())
                return StatusValueResult.Failure(PaymentServiceErrorCode.SEND_REQUEST_ERROR, sendRequestResult.getErrorMessage());

            ReconciliationOfTotalsRequest request = sendRequestResult.getValue();
            ReconciliationOfTotalsRequestDto dto = ReconciliationOfTotalsRequestDto.copyFrom(request);

            return StatusValueResult.Success(dto);
        } catch (Exception ex) {
            return StatusValueResult.Failure(PaymentServiceErrorCode.UNEXPECTED, ex.getMessage());
        }
    }

    @Override
    public void OnDone(ReconciliationOfTotalsResponse result) {
        ReconciliationOfTotalsResponseDto dto = ReconciliationOfTotalsResponseDto.copyFrom(result);

        mCallbackHandler.OnDone(dto);
    }

    @Override
    public StatusValueResult<RestartDeviceRequestDto, PaymentServiceErrorCode> restartDeviceAsync() {
        try {
            RestartDeviceActivity activity = new RestartDeviceActivity(
                    this,
                    mContext,
                    mPosExchangeSettings);

            ValueResult<RestartDeviceRequest> sendRequestResult = activity.sendRequest(
                    new RestartDeviceRequest(mPosExchangeSettings.getTerminalId()));

            if (!sendRequestResult.getSucceeded())
                return StatusValueResult.Failure(PaymentServiceErrorCode.SEND_REQUEST_ERROR, sendRequestResult.getErrorMessage());

            RestartDeviceRequest request = sendRequestResult.getValue();
            RestartDeviceRequestDto dto = RestartDeviceRequestDto.copyFrom(request);

            return StatusValueResult.Success(dto);
        } catch (Exception ex) {
            return StatusValueResult.Failure(PaymentServiceErrorCode.UNEXPECTED, ex.getMessage());
        }
    }

    @Override
    public void OnDone(RestartDeviceResponse result) {
        RestartDeviceResponseDto dto = RestartDeviceResponseDto.copyFrom(result);

        mCallbackHandler.OnDone(dto);
    }

    @Override
    public void OnProgress(PosActivityProgressEvent progressEvent) {
        mCallbackHandler.OnProgress(convertFrom(progressEvent.getProgressValue()));
    }

    private static PaymentServiceProgress convertFrom(@NonNull PosExchange.Progress value) {
        switch (value) {
            case CONNECTING: return PaymentServiceProgress.CONNECTING;
            case CONNECTED: return PaymentServiceProgress.CONNECTED;
            case DISCONNECTING: return PaymentServiceProgress.DISCONNECTING;
            case DISCONNECTED:  return PaymentServiceProgress.DISCONNECTED;
            case SENDING: return PaymentServiceProgress.SENDING;
            case RECEIVING: return PaymentServiceProgress.RECEIVING;
            default: return PaymentServiceProgress.UNDEFINED;
        }
    }
}
