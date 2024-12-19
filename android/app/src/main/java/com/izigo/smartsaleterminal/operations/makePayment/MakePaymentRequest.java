package com.izigo.smartsaleterminal.operations.makePayment;

import androidx.annotation.NonNull;

import org.javamoney.moneta.Money;

import com.izigo.smartsaleterminal.enums.PosTerminalOperation;
import com.izigo.smartsaleterminal.operations.PosActivityRequestBase;
import com.izigo.utils.MoneyHelper;

public class MakePaymentRequest extends PosActivityRequestBase {
    private final Money mAmount;

    public MakePaymentRequest(String terminalId, @NonNull Money amount) {
        super(PosTerminalOperation.MAKE_PAYMENT, terminalId);

        checkCurrencyAndAmount(amount);
        mAmount = amount;
    }

    public Money getAmount() { return mAmount; }

    private static void checkCurrencyAndAmount(Money amount) {
        if (!MoneyHelper.isSupportedCurrency(amount))
            throw new IllegalArgumentException(String.format("Only RUB currency may be used."));
        if (amount.isNegativeOrZero())
            throw new IllegalArgumentException(String.format("Amount must be great than zero."));
    }
}
