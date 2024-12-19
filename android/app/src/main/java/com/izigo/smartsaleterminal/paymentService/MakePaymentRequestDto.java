package com.izigo.smartsaleterminal.paymentService;

import androidx.annotation.NonNull;

import java.math.BigDecimal;

import com.izigo.smartsaleterminal.operations.makePayment.MakePaymentRequest;

public class MakePaymentRequestDto {
    private int operationId;
    private String operation;
    private String terminalId;
    private String rawData;
    private BigDecimal amount;
    private String currencyIso;

    public MakePaymentRequestDto() { }

    public int getOperationId() { return operationId; }
    public void setOperationId(int value) { this.operationId = value; }

    public String getOperation() { return operation; }
    public void setOperation(String value) { this.operation = value; }

    public String getTerminalId() { return terminalId; }
    public void setTerminalId(String value) { this.terminalId = value; }

    public String getRawData() { return rawData; }
    public void setRawData(String value) { this.rawData = value; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal value) { this.amount = value; }

    public String getCurrencyIso() { return currencyIso; }
    public void setCurrencyIso(String value) { this.currencyIso = value; }

    @NonNull
    public static MakePaymentRequestDto copyFrom(@NonNull MakePaymentRequest request) {
        MakePaymentRequestDto dto = new MakePaymentRequestDto();

        dto.setOperationId(request.getOperationId());
        dto.setOperation(request.getOperationName());
        dto.setTerminalId(request.getTerminalId());
        dto.setRawData(request.getRawData());

        dto.setAmount(request.getAmount().getNumberStripped());
        dto.setCurrencyIso(request.getAmount().getCurrency().getCurrencyCode());

        return dto;
    }
}
