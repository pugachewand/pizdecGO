package com.izigo.smartsaleterminal.paymentService;

import com.facebook.react.bridge.Promise;

public interface IReconciliationOfTotalsEngineCallbackHandler {
    void onBegin();
    void onProgress(String value);
    void onEnd(boolean result, String data);
    void onMakeReconciliationRequest(Promise promise);
}
