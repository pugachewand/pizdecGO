package com.izigo.smartsaleterminal.operations;

import androidx.annotation.NonNull;

import org.javamoney.moneta.Money;

import javax.money.CurrencyUnit;

import com.izigo.smartsaleterminal.enums.PosTerminalOperationStatus;
import com.izigo.utils.MoneyHelper;
import ru.inpas.connector.lib.SAParam;

public class PosActivityResponseHelper {
    /**
     * Reads and returns field SAParam.ID.SAF_TRX_STATUS value
     */
    public static PosTerminalOperationStatus ExtractPosTerminalOperationStatus(@NonNull SAParam saParam) {
        final int operationStatusInt = saParam.getInteger(SAParam.ID.SAF_TRX_STATUS);
        final SAParam.STATUS operationStatus = PosTerminalOperationStatus.convertFromInt(operationStatusInt);
        return PosTerminalOperationStatus.convertFromEnum(operationStatus);
    }

    /**
     * Reads and returns combined value from fields SAF_TRX_AMOUNT + SAF_TRX_CURRENCY_CODE
     */
    @NonNull
    public static Money ExtractPaymentAmount(@NonNull SAParam saParam) {
        final String manAmountInCents = saParam.getString(SAParam.ID.SAF_TRX_AMOUNT);
        final String manCurrencyCode = saParam.getString(SAParam.ID.SAF_TRX_CURRENCY_CODE);

        Integer amountInCents = Integer.parseInt(manAmountInCents);
        Integer currencyNumCode = Integer.parseInt(manCurrencyCode);

        CurrencyUnit currency = MoneyHelper.getCurrencyByNumCode(currencyNumCode);
        Money moneyInCents = Money.of(amountInCents, currency);

        return MoneyHelper.fromCents(moneyInCents);
    }
}
