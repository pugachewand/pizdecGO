package com.izigo.smartsaleterminal.paymentService;

import java.math.BigDecimal;

import com.izigo.utils.StatusValueResult;

public interface IPaymentService {
    StatusValueResult<GetConnectionStatusRequestDto, PaymentServiceErrorCode> getConnectionStatusAsync();
    StatusValueResult<MakePaymentRequestDto, PaymentServiceErrorCode> makePaymentAsync(BigDecimal amount, String currencyIso);
    StatusValueResult<CancelPaymentRequestDto, PaymentServiceErrorCode> cancelPaymentAsync(BigDecimal amount, String currencyIso, String authorizeCode, String linkNumberRrn);
    StatusValueResult<MakeRefundRequestDto, PaymentServiceErrorCode> makeRefundAsync(BigDecimal amount, String currencyIso, String authorizeCode, String linkNumberRrn);
    StatusValueResult<ReconciliationOfTotalsRequestDto, PaymentServiceErrorCode> reconciliationOfTotalsAsync();
    StatusValueResult<RestartDeviceRequestDto, PaymentServiceErrorCode> restartDeviceAsync();
}
