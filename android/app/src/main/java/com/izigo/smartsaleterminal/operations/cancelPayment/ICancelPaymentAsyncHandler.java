package com.izigo.smartsaleterminal.operations.cancelPayment;

import com.izigo.smartsaleterminal.operations.PosActivityProgressEvent;
import com.izigo.smartsaleterminal.operations.cancelPayment.CancelPaymentResponse;

public interface ICancelPaymentAsyncHandler {
    void OnProgress(PosActivityProgressEvent progressEvent);
    void OnDone(CancelPaymentResponse result);
}
