package com.izigo.smartsaleterminal.operations.connectionStatus;

import com.izigo.smartsaleterminal.operations.PosActivityProgressEvent;
import com.izigo.smartsaleterminal.operations.connectionStatus.GetConnectionStatusResponse;

public interface IGetConnectionStatusAsyncHandler {
    void OnProgress(PosActivityProgressEvent progressEvent);
    void OnDone(GetConnectionStatusResponse result);
}
