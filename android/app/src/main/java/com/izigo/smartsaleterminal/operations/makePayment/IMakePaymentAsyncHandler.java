package com.izigo.smartsaleterminal.operations.makePayment;

import com.izigo.smartsaleterminal.operations.PosActivityProgressEvent;
import com.izigo.smartsaleterminal.operations.makePayment.MakePaymentResponse;

public interface IMakePaymentAsyncHandler {
    void OnProgress(PosActivityProgressEvent progressEvent);
    void OnDone(MakePaymentResponse result);
}
