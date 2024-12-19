package com.izigo.smartsaleterminal.paymentService;

import androidx.annotation.NonNull;

public interface IReconciliationOfTotalsEngine {
    void initialize(@NonNull IReconciliationOfTotalsEngineCallbackHandler callbackHandler);
    void letsBegin(boolean run);
    void destroy();
}
