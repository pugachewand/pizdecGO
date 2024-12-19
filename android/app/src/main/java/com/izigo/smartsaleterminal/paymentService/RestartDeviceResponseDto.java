package com.izigo.smartsaleterminal.paymentService;

import androidx.annotation.NonNull;

import com.izigo.smartsaleterminal.enums.PosTerminalOperationStatus;
import com.izigo.smartsaleterminal.operations.restartDevice.RestartDeviceResponse;

public class RestartDeviceResponseDto {
    private int operationId;
    private String operation;
    private String terminalId;
    private String rawData;
    private PosTerminalOperationStatus posTerminalOperationStatus;
    private Integer nativeResult;

    public RestartDeviceResponseDto() { }

    public int getOperationId() { return operationId; }
    public void setOperationId(int value) { this.operationId = value; }

    public String getOperation() { return operation; }
    public void setOperation(String value) { this.operation = value; }

    public String getTerminalId() { return terminalId; }
    public void setTerminalId(String value) { this.terminalId = value; }

    public String getRawData() { return rawData; }
    public void setRawData(String value) { this.rawData = value; }

    public PosTerminalOperationStatus getPosTerminalOperationStatus() { return posTerminalOperationStatus; }
    private void setPosTerminalOperationStatus(PosTerminalOperationStatus value) { this.posTerminalOperationStatus = value; }

    public Integer getNativeResult() { return nativeResult; }
    private void setNativeResult(Integer value) { this.nativeResult = value; }

    @NonNull
    public static RestartDeviceResponseDto copyFrom(@NonNull RestartDeviceResponse response) {
        RestartDeviceResponseDto dto = new RestartDeviceResponseDto();

        dto.setOperationId(response.getOperationId());
        dto.setOperation(response.getOperationName());
        dto.setTerminalId(response.getTerminalId());
        dto.setRawData(response.getRawData());

        dto.setPosTerminalOperationStatus(response.getPosTerminalOperationStatus());
        dto.setNativeResult(response.getNativeResult());

        return dto;
    }
}
