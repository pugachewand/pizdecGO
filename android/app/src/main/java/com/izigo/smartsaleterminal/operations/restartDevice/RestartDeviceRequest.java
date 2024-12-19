package com.izigo.smartsaleterminal.operations.restartDevice;

import com.izigo.smartsaleterminal.enums.PosTerminalOperation;
import com.izigo.smartsaleterminal.operations.PosActivityRequestBase;

public class RestartDeviceRequest extends PosActivityRequestBase {
    private final String RestartCommandCode = "35";

    public RestartDeviceRequest(String terminalId) {
        super(PosTerminalOperation.CUSTOM_COMMAND, terminalId);
    }

    public String getUserCommandId() {
        return RestartCommandCode;
    }
}
