package com.izigo.smartsaleterminal.paymentService;

import androidx.annotation.NonNull;

import com.izigo.smartsaleterminal.operations.reconciliationOfTotals.ReconciliationOfTotalsRequest;

public class ReconciliationOfTotalsRequestDto {
    private int operationId;
    private String operation;
    private String terminalId;
    private String rawData;

    public ReconciliationOfTotalsRequestDto() { }

    public int getOperationId() { return operationId; }
    public void setOperationId(int value) { this.operationId = value; }

    public String getOperation() { return operation; }
    public void setOperation(String value) { this.operation = value; }

    public String getTerminalId() { return terminalId; }
    public void setTerminalId(String value) { this.terminalId = value; }

    public String getRawData() { return rawData; }
    public void setRawData(String value) { this.rawData = value; }

    @NonNull
    public static ReconciliationOfTotalsRequestDto copyFrom(@NonNull ReconciliationOfTotalsRequest request) {
        ReconciliationOfTotalsRequestDto dto = new ReconciliationOfTotalsRequestDto();

        dto.setOperationId(request.getOperationId());
        dto.setOperation(request.getOperationName());
        dto.setTerminalId(request.getTerminalId());
        dto.setRawData(request.getRawData());

        return dto;
    }
}
