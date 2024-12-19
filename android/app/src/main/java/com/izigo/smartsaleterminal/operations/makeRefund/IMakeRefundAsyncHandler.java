package com.izigo.smartsaleterminal.operations.makeRefund;

import com.izigo.smartsaleterminal.operations.PosActivityProgressEvent;
import com.izigo.smartsaleterminal.operations.makeRefund.MakeRefundResponse;

public interface IMakeRefundAsyncHandler {
    void OnProgress(PosActivityProgressEvent progressEvent);
    void OnDone(MakeRefundResponse result);
}
