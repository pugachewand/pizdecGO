package com.izigo.smartsaleterminal.operations.connectionStatus;

import com.izigo.smartsaleterminal.enums.PosTerminalOperation;
import com.izigo.smartsaleterminal.operations.PosActivityRequestBase;

public class GetConnectionStatusRequest extends PosActivityRequestBase {
    public GetConnectionStatusRequest(String terminalId) {
        super(PosTerminalOperation.GET_CONNECT_STATUS, terminalId);
    }
}
