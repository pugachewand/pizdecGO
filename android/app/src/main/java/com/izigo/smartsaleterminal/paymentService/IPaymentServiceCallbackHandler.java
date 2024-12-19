package com.izigo.smartsaleterminal.paymentService;

public interface IPaymentServiceCallbackHandler {
    void OnProgress(PaymentServiceProgress value);

    void OnDone(GetConnectionStatusResponseDto result);
    void OnDone(MakePaymentResponseDto result);
    void OnDone(CancelPaymentResponseDto result);
    void OnDone(MakeRefundResponseDto result);
    void OnDone(ReconciliationOfTotalsResponseDto result);
    void OnDone(RestartDeviceResponseDto result);
}
