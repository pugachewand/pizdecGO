package com.izigo.smartsaleterminal.operations.makePayment;

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

public final class MakePaymentActivity extends PosActivityBase<MakePaymentRequest, MakePaymentResponse> {
    @NonNull
    private final IMakePaymentAsyncHandler mAsyncHandler;

    public MakePaymentActivity(
            @NonNull IMakePaymentAsyncHandler asyncHandler, @NonNull Context context,
            @NonNull PosExchangeSettings posExchangeSettings) {
        super(context, posExchangeSettings);
        mAsyncHandler = asyncHandler;
    }

    @Override
    protected void FillSaRequestParameters(SAParam saRequest, MakePaymentRequest request) {
        final Money amount = request.getAmount();
        final Money amountInCents = MoneyHelper.toCents(amount);
        final String stringAmount =  MoneyHelper.toString(amountInCents);

        saRequest.putString(SAParam.ID.SAF_MODELNO, mPosExchangeSettings.MODEL_NO);
        saRequest.putString(SAParam.ID.SAF_TRX_AMOUNT, stringAmount);
        saRequest.putString(SAParam.ID.SAF_TRX_CURRENCY_CODE, MoneyHelper.getCurrencyNumCodeString(amount));
    }

    @Override
    protected MakePaymentResponse ProcessOperationResult(PosExchange.Result result, SAParam response) {
        return MakePaymentResponse.create(
                PosTerminalOperation.MAKE_PAYMENT,
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
    protected void InternalOnDone(MakePaymentResponse result) {
        mAsyncHandler.OnDone(result);
    }
}
