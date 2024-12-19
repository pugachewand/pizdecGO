package com.izigo.smartsaleterminal.operations.restartDevice;

import com.izigo.smartsaleterminal.operations.PosActivityProgressEvent;

public interface IRestartDeviceAsyncHandler {
    void OnProgress(PosActivityProgressEvent progressEvent);
    void OnDone(RestartDeviceResponse result);
}
