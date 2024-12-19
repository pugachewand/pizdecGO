package com.izigo.utils;

import androidx.annotation.NonNull;

import org.javamoney.moneta.Money;

import javax.money.CurrencyQueryBuilder;
import javax.money.CurrencyUnit;
import javax.money.Monetary;

public class MoneyHelper {
    public static final int SUPPORTED_CURRENCY_NUM_CODE = 643;
    public static final String SUPPORTED_CURRENCY_ISO_CODE = "RUB";

    public static int getCurrencyNumCode(@NonNull Money value) {
        return value.getCurrency().getNumericCode();
    }

    public static CurrencyUnit getCurrencyByNumCode(Integer numCode) {
        return Monetary.getCurrency(
                CurrencyQueryBuilder
                        .of()
                        .setNumericCodes(numCode)
                        .build()
        );
    }

    public static String getCurrencyNumCodeString(@NonNull Money value) {
        return String.format("%d", getCurrencyNumCode(value));
    }

    public static boolean isSupportedCurrency(@NonNull Money value) {
        return getCurrencyNumCode(value) == SUPPORTED_CURRENCY_NUM_CODE;
    }

    public static Money toCents(@NonNull Money value) {
        return value.scaleByPowerOfTen(2);
    }

    public static Money fromCents(@NonNull Money value) { return value.scaleByPowerOfTen(-2); }

    public static String toString(Money value) {
        int leftPart = value.getNumber().intValueExact();
        return String.valueOf(leftPart);
    }
}
