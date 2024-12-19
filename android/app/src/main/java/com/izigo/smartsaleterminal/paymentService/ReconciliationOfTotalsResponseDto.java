package com.izigo.smartsaleterminal.paymentService;

import androidx.annotation.NonNull;

import com.izigo.smartsaleterminal.enums.PosTerminalOperationStatus;
import com.izigo.smartsaleterminal.operations.reconciliationOfTotals.ReconciliationOfTotalsResponse;

public class ReconciliationOfTotalsResponseDto {
    private int operationId;
    private String operation;
    private String terminalId;
    private String rawData;
    private PosTerminalOperationStatus posTerminalOperationStatus;
    private Integer transactionIdInExternalDevice;
    private String additionalResponseData;
    private String nativeResultCode;
    private String nativeErrorMessage;

    public ReconciliationOfTotalsResponseDto() { }

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

    public Integer getTransactionIdInExternalDevice() { return transactionIdInExternalDevice; }
    public void setTransactionIdInExternalDevice(Integer value) { this.transactionIdInExternalDevice = value; }

    public String getAdditionalResponseData() { return additionalResponseData; }
    public void setAdditionalResponseData(String value) { this.additionalResponseData = value; }

    public String getNativeResultCode() { return nativeResultCode; }
    public void setNativeResultCode(String nativeResultCode) { this.nativeResultCode = nativeResultCode; }

    public String getNativeErrorMessage() { return nativeErrorMessage; }
    public void setNativeErrorMessage(String nativeErrorMessage) { this.nativeErrorMessage = nativeErrorMessage; }

    @NonNull
    public static ReconciliationOfTotalsResponseDto copyFrom(@NonNull ReconciliationOfTotalsResponse response) {
        ReconciliationOfTotalsResponseDto dto = new ReconciliationOfTotalsResponseDto();

        dto.setOperationId(response.getOperationId());
        dto.setOperation(response.getOperationName());
        dto.setTerminalId(response.getTerminalId());
        dto.setRawData(response.getRawData());

        dto.setPosTerminalOperationStatus(response.getPosTerminalOperationStatus());
        dto.setTransactionIdInExternalDevice(response.getTransactionIdInExternalDevice());
        dto.setAdditionalResponseData(response.getAdditionalResponseData());

        dto.setNativeResultCode(response.getResponseCode().toString());
        dto.setNativeErrorMessage(response.getErrorMessage());

        return dto;
    }
}
