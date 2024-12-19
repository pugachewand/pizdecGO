package com.izigo.smartsaleterminal.paymentService;

import androidx.annotation.NonNull;

import com.izigo.smartsaleterminal.operations.restartDevice.RestartDeviceRequest;

public class RestartDeviceRequestDto {
    private int operationId;
    private String operation;
    private String terminalId;
    private String rawData;
    private String userCommandId;

    public RestartDeviceRequestDto() { }

    public int getOperationId() { return operationId; }
    public void setOperationId(int value) { this.operationId = value; }

    public String getOperation() { return operation; }
    public void setOperation(String value) { this.operation = value; }

    public String getTerminalId() { return terminalId; }
    public void setTerminalId(String value) { this.terminalId = value; }

    public String getRawData() { return rawData; }
    public void setRawData(String value) { this.rawData = value; }

    public String getUserCommandId() { return userCommandId; }
    public void setUserCommandId(String value) { this.userCommandId = value; }

    @NonNull
    public static RestartDeviceRequestDto copyFrom(@NonNull RestartDeviceRequest request) {
        RestartDeviceRequestDto dto = new RestartDeviceRequestDto();

        dto.setOperationId(request.getOperationId());
        dto.setOperation(request.getOperationName());
        dto.setTerminalId(request.getTerminalId());
        dto.setRawData(request.getRawData());

        dto.setUserCommandId(request.getUserCommandId());

        return dto;
    }
}
