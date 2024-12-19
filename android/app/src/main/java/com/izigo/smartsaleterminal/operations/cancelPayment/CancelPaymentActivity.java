package com.izigo.smartsaleterminal.operations.cancelPayment;

import android.content.Context;

import androidx.annotation.NonNull;

import org.javamoney.moneta.Money;

import com.izigo.smartsaleterminal.enums.PosTerminalOperation;
import com.izigo.smartsaleterminal.operations.PosActivityBase;
import com.izigo.smartsaleterminal.operations.PosActivityProgressEvent;
import com.izigo.smartsaleterminal.operations.PosExchangeSettings;
import com.izigo.utils.MoneyHelper;
import ru.inpas.connector.lib.PosExchange;
import ru.inpas.connector.lib.SAParam;

public final class CancelPaymentActivity extends PosActivityBase<CancelPaymentRequest, CancelPaymentResponse> {

    @NonNull
    private final ICancelPaymentAsyncHandler mAsyncHandler;

    public CancelPaymentActivity(
            @NonNull ICancelPaymentAsyncHandler asyncHandler, @NonNull Context context,
            @NonNull PosExchangeSettings posExchangeSettings) {
        super(context, posExchangeSettings);
        mAsyncHandler = asyncHandler;
    }

    @Override
    protected void FillSaRequestParameters(SAParam saRequest, CancelPaymentRequest request) {
        final Money amount = request.getAmount();
        final Money amountInCents = MoneyHelper.toCents(amount);
        final String stringAmount =  MoneyHelper.toString(amountInCents);

        saRequest.putString(SAParam.ID.SAF_MODELNO, mPosExchangeSettings.MODEL_NO);
        saRequest.putString(SAParam.ID.SAF_TRX_AMOUNT, stringAmount);
        saRequest.putString(SAParam.ID.SAF_TRX_CURRENCY_CODE, MoneyHelper.getCurrencyNumCodeString(amount));

        saRequest.putString(SAParam.ID.SAF_AUTH_CODE, request.getAuthorizeCode());
        saRequest.putString(SAParam.ID.SAF_RRN, request.getLinkNumberRrn());
    }

    @Override
    protected CancelPaymentResponse ProcessOperationResult(PosExchange.Result result, SAParam response) {
        return CancelPaymentResponse.create(
                PosTerminalOperation.CANCEL_PAYMENT,
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
    protected void InternalOnDone(CancelPaymentResponse result) {
        mAsyncHandler.OnDone(result);
    }
}
