package com.izigo.smartsaleterminal;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.izigo.MainActivity;
import com.izigo.smartsaleterminal.paymentService.CancelPaymentRequestDto;
import com.izigo.smartsaleterminal.paymentService.CancelPaymentResponseDto;
import com.izigo.smartsaleterminal.paymentService.GetConnectionStatusRequestDto;
import com.izigo.smartsaleterminal.paymentService.GetConnectionStatusResponseDto;
import com.izigo.smartsaleterminal.paymentService.IPaymentService;
import com.izigo.smartsaleterminal.paymentService.IPaymentServiceCallbackHandler;
import com.izigo.smartsaleterminal.paymentService.MakePaymentRequestDto;
import com.izigo.smartsaleterminal.paymentService.MakePaymentResponseDto;
import com.izigo.smartsaleterminal.paymentService.MakeRefundRequestDto;
import com.izigo.smartsaleterminal.paymentService.MakeRefundResponseDto;
import com.izigo.smartsaleterminal.paymentService.PaymentService;
import com.izigo.smartsaleterminal.paymentService.PaymentServiceErrorCode;
import com.izigo.smartsaleterminal.paymentService.PaymentServiceProgress;
import com.izigo.smartsaleterminal.paymentService.ReconciliationOfTotalsRequestDto;
import com.izigo.smartsaleterminal.paymentService.ReconciliationOfTotalsResponseDto;
import com.izigo.smartsaleterminal.paymentService.RestartDeviceRequestDto;
import com.izigo.smartsaleterminal.paymentService.RestartDeviceResponseDto;
import com.izigo.utils.JsonHelper;
import com.izigo.utils.StatusValueResult;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Map;

public class SmartSaleTerminalCommandExecutor implements IPaymentServiceCallbackHandler {
    private final String POS_TERMINAL_NOT_FOUND = "POS terminal is not detected.";
    private final String POS_TERMINAL_ID_EMPTY = "POS terminal ID id empty.";

    private final OffsetDateTime mCreatedDate;
    private OffsetDateTime mRequestDate;
    private OffsetDateTime mResponseDate;

    private final Context mContext;
    private final String mTerminalId;
    private static final Map<SmartSaleTerminalCommandExecutor, Promise> mCommandMap = new HashMap<>();

    private GetConnectionStatusRequestDto mGetConnectRequest;
    private MakePaymentRequestDto mMakePaymentRequest;
    private ReconciliationOfTotalsRequestDto mReconciliateTotalsRequest;
    private MakeRefundRequestDto mMakeRefundRequest;
    private CancelPaymentRequestDto mCancelPaymentRequest;
    private RestartDeviceRequestDto mRestartDeviceRequest;

    private static final Logger logger = LoggerFactory.getLogger(MainActivity.class);


    @Override
    public int hashCode() {
        return mCreatedDate.hashCode();
    }

    @Override
    public boolean equals(@Nullable Object obj) {
        return super.equals(obj);
    }

    @NonNull
    @Override
    public String toString() {
        return mCreatedDate.toString();
    }

    public SmartSaleTerminalCommandExecutor(@NonNull Context context, @NonNull String terminalId) {
        mCreatedDate = OffsetDateTime.now(ZoneOffset.UTC);
        mContext = context;
        mTerminalId = terminalId;
    }

    private void registerRequestDate() {
        mRequestDate = OffsetDateTime.now(ZoneOffset.UTC);
    }

    private void registerResponseDate() {
        mResponseDate = OffsetDateTime.now(ZoneOffset.UTC);
    }

    private boolean isInvalidTerminalId() {
        return mTerminalId == null || mTerminalId.length() == 0;
    }

// Началось выполнение команды с параметрами
    public void runGetConnectionStatus(@NonNull Promise promise) {
        logger.info("Начало runGetConnectionStatus");
        try {
            registerRequestDate();
            if (!Globals.getPosTerminalConnected()) {
                promise.resolve(ToJson(
                        SmartSaleTerminalGetConnectStatusCommand.createFailed(
                                mCreatedDate.toString(), mRequestDate.toString(), null,
                                PaymentServiceErrorCode.SEND_REQUEST_ERROR, POS_TERMINAL_NOT_FOUND
                        )));
                return;
            }

            if (isInvalidTerminalId()) {
                promise.resolve(ToJson(
                        SmartSaleTerminalGetConnectStatusCommand.createFailed(
                                mCreatedDate.toString(), mRequestDate.toString(), null,
                                PaymentServiceErrorCode.SEND_REQUEST_ERROR, POS_TERMINAL_ID_EMPTY
                        )
                ));
                return;
            }

            IPaymentService paymentService = PaymentService.create(mContext, this, mTerminalId);

            StatusValueResult<GetConnectionStatusRequestDto, PaymentServiceErrorCode> getConnectionStatusResult = paymentService.getConnectionStatusAsync();

            if (!getConnectionStatusResult.getSucceeded())
                promise.resolve(ToJson(
                        SmartSaleTerminalGetConnectStatusCommand.createFailed(
                            mCreatedDate.toString(), mRequestDate.toString(), null,
                            getConnectionStatusResult.getStatus(), getConnectionStatusResult.getErrorMessage()
                )));

            mGetConnectRequest = getConnectionStatusResult.getValue();
            mCommandMap.put(this, promise);
        } catch (Exception exception) {
            logger.info("Exception: " + exception.toString());
            promise.resolve(ToJson(
                    SmartSaleTerminalGetConnectStatusCommand.createFailed(
                        mCreatedDate.toString(), mRequestDate.toString(), null,
                        PaymentServiceErrorCode.UNEXPECTED, exception.getMessage()
            )));
        }
    }

    public void runMakePayment(ReadableMap requestData, @NonNull Promise promise) {

        BigDecimal amount = new BigDecimal(requestData.getString("amount"));

        String currency = requestData.getString("currencyCode");
        logger.info("Начало runMakePayment: " + "amount: " + amount + " " + "currency: " + currency);
        try {
            registerRequestDate();
            if (!Globals.getPosTerminalConnected()) {
                promise.resolve(ToJson(
                        SmartSaleTerminalMakePaymentCommand.createFailed(
                                mCreatedDate.toString(), mRequestDate.toString(), null,
                                PaymentServiceErrorCode.SEND_REQUEST_ERROR, POS_TERMINAL_NOT_FOUND
                        )));
                return;
            }

            if (isInvalidTerminalId()) {
                promise.resolve(ToJson(
                        SmartSaleTerminalMakePaymentCommand.createFailed(
                                mCreatedDate.toString(), mRequestDate.toString(), null,
                                PaymentServiceErrorCode.SEND_REQUEST_ERROR, POS_TERMINAL_ID_EMPTY
                        )
                ));
                return;
            }

            IPaymentService paymentService = PaymentService.create(mContext, this, mTerminalId);

            StatusValueResult<MakePaymentRequestDto, PaymentServiceErrorCode> makePaymentResult = paymentService.makePaymentAsync(amount, currency);

            if (!makePaymentResult.getSucceeded())
                promise.resolve(ToJson(
                        SmartSaleTerminalMakePaymentCommand.createFailed(
                            mCreatedDate.toString(), mRequestDate.toString(), null,
                                makePaymentResult.getStatus(), makePaymentResult.getErrorMessage()
                )));

            mMakePaymentRequest = makePaymentResult.getValue();
            mCommandMap.put(this, promise);
        } catch (Exception exception) {
            logger.info("Exception: " + exception.toString());
            promise.resolve(ToJson(
                    SmartSaleTerminalMakePaymentCommand.createFailed(
                        mCreatedDate.toString(), mRequestDate.toString(), null,
                        PaymentServiceErrorCode.UNEXPECTED, exception.getMessage()
            )));
        }
    }
    public void runReconciliationOfTotals(@NonNull Promise promise) {
        logger.info("Начало runReconciliationOfTotals");
        try {
            registerRequestDate();
            if (!Globals.getPosTerminalConnected()) {
                promise.resolve(ToJson(
                        SmartSaleTerminalReconciliationOfTotalsCommand.createFailed(
                                mCreatedDate.toString(), mRequestDate.toString(), null,
                                PaymentServiceErrorCode.SEND_REQUEST_ERROR, POS_TERMINAL_NOT_FOUND
                        )));
                return;
            }

            if (isInvalidTerminalId()) {
                promise.resolve(ToJson(
                        SmartSaleTerminalReconciliationOfTotalsCommand.createFailed(
                                mCreatedDate.toString(), mRequestDate.toString(), null,
                                PaymentServiceErrorCode.SEND_REQUEST_ERROR, POS_TERMINAL_ID_EMPTY
                        )
                ));
                return;
            }

            IPaymentService paymentService = PaymentService.create(mContext, this, mTerminalId);

            StatusValueResult<ReconciliationOfTotalsRequestDto, PaymentServiceErrorCode> reconciliationOfTotalsResult = paymentService.reconciliationOfTotalsAsync();

            if (!reconciliationOfTotalsResult.getSucceeded())
                promise.resolve(ToJson(
                        SmartSaleTerminalReconciliationOfTotalsCommand.createFailed(
                                mCreatedDate.toString(), mRequestDate.toString(), null,
                                reconciliationOfTotalsResult.getStatus(), reconciliationOfTotalsResult.getErrorMessage()
                        )));

            mReconciliateTotalsRequest = reconciliationOfTotalsResult.getValue();
            mCommandMap.put(this, promise);
        } catch (Exception exception) {
            logger.info("Exception: " + exception.toString());
            promise.resolve(ToJson(
                    SmartSaleTerminalReconciliationOfTotalsCommand.createFailed(
                            mCreatedDate.toString(), mRequestDate.toString(), null,
                            PaymentServiceErrorCode.UNEXPECTED, exception.getMessage()
                    )));
        }
    }

    public void runMakeRefund(ReadableMap requestData, @NonNull Promise promise) {

        BigDecimal amount = new BigDecimal(requestData.getString("amount"));
        String currency = requestData.getString("currencyCode");
        String authorizeCode = requestData.getString("authorizeCode");        
        String linkNumberRrn = requestData.getString("linkNumberRrn");

        logger.info("Начало runMakeRefund: props:::" + "\namount " + amount +  "\ncurrency: " + currency + "\nauthorizeCode"+ authorizeCode + "\nlinkNumberRrn"+ linkNumberRrn);

        try {
            registerRequestDate();
            if (!Globals.getPosTerminalConnected()) {
                promise.resolve(ToJson(
                        SmartSaleTerminalMakeRefundCommand.createFailed(
                                mCreatedDate.toString(), mRequestDate.toString(), null,
                                PaymentServiceErrorCode.SEND_REQUEST_ERROR, POS_TERMINAL_NOT_FOUND
                        )));
                return;
            }

            if (isInvalidTerminalId()) {
                promise.resolve(ToJson(
                        SmartSaleTerminalMakeRefundCommand.createFailed(
                                mCreatedDate.toString(), mRequestDate.toString(), null,
                                PaymentServiceErrorCode.SEND_REQUEST_ERROR, POS_TERMINAL_ID_EMPTY
                        )
                ));
                return;
            }

            IPaymentService paymentService = PaymentService.create(mContext, this, mTerminalId);

            StatusValueResult<MakeRefundRequestDto, PaymentServiceErrorCode> makeRefundResult = paymentService.makeRefundAsync(amount, currency, authorizeCode, linkNumberRrn);

            if (!makeRefundResult.getSucceeded())
                promise.resolve(ToJson(
                        SmartSaleTerminalMakeRefundCommand.createFailed(
                            mCreatedDate.toString(), mRequestDate.toString(), null,
                                makeRefundResult.getStatus(), makeRefundResult.getErrorMessage()
                )));

            mMakeRefundRequest = makeRefundResult.getValue();
            mCommandMap.put(this, promise);
        } catch (Exception exception) {
            logger.info("Exception: " + exception.toString());
            promise.resolve(ToJson(
                    SmartSaleTerminalMakeRefundCommand.createFailed(
                        mCreatedDate.toString(), mRequestDate.toString(), null,
                        PaymentServiceErrorCode.UNEXPECTED, exception.getMessage()
            )));
        }
    }

    public void runCancelPayment(ReadableMap requestData, @NonNull Promise promise) {
        BigDecimal amount = new BigDecimal(requestData.getString("amount"));
        String currency = requestData.getString("currencyCode");
        String authorizeCode = requestData.getString("authorizeCode");        
        String linkNumberRrn = requestData.getString("linkNumberRrn");

         logger.info("Начало runCancelPayment: props:::" + "\namount " + amount +  "\ncurrency: " + currency + "\nauthorizeCode"+ authorizeCode + "\nlinkNumberRrn"+ linkNumberRrn);

        try {
            registerRequestDate();
            if (!Globals.getPosTerminalConnected()) {
                promise.resolve(ToJson(
                        SmartSaleTerminalCancelPaymentCommand.createFailed(
                                mCreatedDate.toString(), mRequestDate.toString(), null,
                                PaymentServiceErrorCode.SEND_REQUEST_ERROR, POS_TERMINAL_NOT_FOUND
                        )));
                return;
            }

            if (isInvalidTerminalId()) {
                promise.resolve(ToJson(
                        SmartSaleTerminalCancelPaymentCommand.createFailed(
                                mCreatedDate.toString(), mRequestDate.toString(), null,
                                PaymentServiceErrorCode.SEND_REQUEST_ERROR, POS_TERMINAL_ID_EMPTY
                        )
                ));
                return;
            }

            IPaymentService paymentService = PaymentService.create(mContext, this, mTerminalId);

            StatusValueResult<CancelPaymentRequestDto, PaymentServiceErrorCode> cancelPaymentResult = paymentService.cancelPaymentAsync(amount, currency, authorizeCode, linkNumberRrn);

            if (!cancelPaymentResult.getSucceeded())
                promise.resolve(ToJson(
                        SmartSaleTerminalCancelPaymentCommand.createFailed(
                            mCreatedDate.toString(), mRequestDate.toString(), null,
                                cancelPaymentResult.getStatus(), cancelPaymentResult.getErrorMessage()
                )));

            mCancelPaymentRequest = cancelPaymentResult.getValue();
            mCommandMap.put(this, promise);
        } catch (Exception exception) {
            logger.info("Exception: " + exception.toString());
            promise.resolve(ToJson(
                    SmartSaleTerminalCancelPaymentCommand.createFailed(
                        mCreatedDate.toString(), mRequestDate.toString(), null,
                        PaymentServiceErrorCode.UNEXPECTED, exception.getMessage()
            )));
        }
    }

    public void runRestartDevice(@NonNull Promise promise) {
        logger.info("Начало runRestartDevice");
        try {
            registerRequestDate();
            if (!Globals.getPosTerminalConnected()) {
                promise.resolve(ToJson(
                        SmartSaleTerminalRestartDeviceCommand.createFailed(
                                mCreatedDate.toString(), mRequestDate.toString(), null,
                                PaymentServiceErrorCode.SEND_REQUEST_ERROR, POS_TERMINAL_NOT_FOUND
                        )));
                return;
            }

            if (isInvalidTerminalId()) {
                promise.resolve(ToJson(
                        SmartSaleTerminalRestartDeviceCommand.createFailed(
                                mCreatedDate.toString(), mRequestDate.toString(), null,
                                PaymentServiceErrorCode.SEND_REQUEST_ERROR, POS_TERMINAL_ID_EMPTY
                        )
                ));
                return;
            }

            IPaymentService paymentService = PaymentService.create(mContext, this, mTerminalId);

            StatusValueResult<RestartDeviceRequestDto, PaymentServiceErrorCode> restartDeviceResult = paymentService.restartDeviceAsync();

            if (!restartDeviceResult.getSucceeded())
                promise.resolve(ToJson(
                        SmartSaleTerminalRestartDeviceCommand.createFailed(
                                mCreatedDate.toString(), mRequestDate.toString(), null,
                                restartDeviceResult.getStatus(), restartDeviceResult.getErrorMessage()
                        )));

            mRestartDeviceRequest = restartDeviceResult.getValue();
            mCommandMap.put(this, promise);
        } catch (Exception exception) {
            logger.info("Exception: " + exception.toString());
            promise.resolve(ToJson(
                    SmartSaleTerminalRestartDeviceCommand.createFailed(
                            mCreatedDate.toString(), mRequestDate.toString(), null,
                            PaymentServiceErrorCode.UNEXPECTED, exception.getMessage()
                    )));
        }
    }

    @Override
    public void OnProgress(PaymentServiceProgress value) {
    }

    @Override
    public void OnDone(GetConnectionStatusResponseDto result) {
        registerResponseDate();
        logger.info("OnDone GetConnectionStatusResponseDto: " + result);
        if (mCommandMap.containsKey(this)) {
            Promise promise = mCommandMap.get(this);
            mCommandMap.remove(this);

            promise.resolve(ToJson(
                    SmartSaleTerminalGetConnectStatusCommand.createSucceeded(
                        mCreatedDate.toString(), mRequestDate.toString(), mResponseDate.toString(),
                            mGetConnectRequest, result
            )));
        }
    }

    @Override
    public void OnDone(MakePaymentResponseDto result) {
        registerResponseDate();
        logger.info("OnDone MakePaymentResponseDto: " + result);
        if (mCommandMap.containsKey(this)) {
            Promise promise = mCommandMap.get(this);
            mCommandMap.remove(this);

            promise.resolve(ToJson(
                    SmartSaleTerminalMakePaymentCommand.createSucceeded(
                        mCreatedDate.toString(), mRequestDate.toString(), mResponseDate.toString(),
                            mMakePaymentRequest, result
            )));
        }
    }

    @Override
    public void OnDone(CancelPaymentResponseDto result) {
        registerResponseDate();
        logger.info("OnDone CancelPaymentResponseDto: " + result);

        if (mCommandMap.containsKey(this)) {
            Promise promise = mCommandMap.get(this);
            mCommandMap.remove(this);

            promise.resolve(ToJson(
                    SmartSaleTerminalCancelPaymentCommand.createSucceeded(
                        mCreatedDate.toString(), mRequestDate.toString(), mResponseDate.toString(),
                            mCancelPaymentRequest, result
            )));
        }
    }

    @Override
    public void OnDone(MakeRefundResponseDto result) {
        registerResponseDate();
        logger.info("OnDone MakeRefundResponseDto: " + result);

        if (mCommandMap.containsKey(this)) {
            Promise promise = mCommandMap.get(this);
            mCommandMap.remove(this);

            promise.resolve(ToJson(
                    SmartSaleTerminalMakeRefundCommand.createSucceeded(
                        mCreatedDate.toString(), mRequestDate.toString(), mResponseDate.toString(),
                            mMakeRefundRequest, result
            )));
        }
    }

    @Override
    public void OnDone(ReconciliationOfTotalsResponseDto result) {
        registerResponseDate();
        logger.info("OnDone ReconciliationOfTotalsResponseDto: " + result);

        if (mCommandMap.containsKey(this)) {
            Promise promise = mCommandMap.get(this);
            mCommandMap.remove(this);

            promise.resolve(ToJson(
                    SmartSaleTerminalReconciliationOfTotalsCommand.createSucceeded(
                            mCreatedDate.toString(), mRequestDate.toString(), mResponseDate.toString(),
                            mReconciliateTotalsRequest, result
                    )));
        }
    }

    @Override
    public void OnDone(RestartDeviceResponseDto result) {
        registerResponseDate();
        logger.info("OnDone RestartDeviceResponseDto: " + result);

        if (mCommandMap.containsKey(this)) {
            Promise promise = mCommandMap.get(this);
            mCommandMap.remove(this);

            promise.resolve(ToJson(
                    SmartSaleTerminalRestartDeviceCommand.createSucceeded(
                            mCreatedDate.toString(), mRequestDate.toString(), mResponseDate.toString(),
                            mRestartDeviceRequest, result
                    )));
        }
    }

    private static String ToJson(Object obj) {
        String result = JsonHelper.ToJson(obj);
        logger.info(result);

        return result;
    }
}
