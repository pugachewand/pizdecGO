package com.izigo.smartsaleterminal.operations.cancelPayment;

import androidx.annotation.NonNull;

import org.javamoney.moneta.Money;

import com.izigo.smartsaleterminal.enums.PosTerminalOperation;
import com.izigo.smartsaleterminal.operations.PosActivityRequestBase;
import com.izigo.utils.MoneyHelper;

public class CancelPaymentRequest extends PosActivityRequestBase {
    private final Money mAmount;
    private final String mAuthorizeCode;
    private final String mLinkNumberRrn;

    public CancelPaymentRequest(String terminalId, @NonNull Money amount, String authorizeCode, String linkNumberRrn) {
        super(PosTerminalOperation.CANCEL_PAYMENT, terminalId);

        checkCurrencyAndAmount(amount);
        mAmount = amount;
        mAuthorizeCode = authorizeCode;
        mLinkNumberRrn = linkNumberRrn;
    }

    public Money getAmount() { return mAmount; }

    public String getAuthorizeCode() { return mAuthorizeCode; }

    public String getLinkNumberRrn() { return mLinkNumberRrn; }

    private static void checkCurrencyAndAmount(Money amount) {
        if (!MoneyHelper.isSupportedCurrency(amount))
            throw new IllegalArgumentException(String.format("Only RUB currency may be used."));
        if (amount.isNegativeOrZero())
            throw new IllegalArgumentException(String.format("Amount must be great than zero."));
    }
}
