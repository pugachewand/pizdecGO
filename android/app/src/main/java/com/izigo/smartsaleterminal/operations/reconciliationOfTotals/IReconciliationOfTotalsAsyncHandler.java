package com.izigo.smartsaleterminal.operations.reconciliationOfTotals;

import com.izigo.smartsaleterminal.operations.PosActivityProgressEvent;

public interface IReconciliationOfTotalsAsyncHandler {
    void OnProgress(PosActivityProgressEvent progressEvent);
    void OnDone(ReconciliationOfTotalsResponse result);
}
