package com.izigo.smartsaleterminal.paymentService;

import androidx.annotation.NonNull;

import org.javamoney.moneta.Money;

import java.math.BigDecimal;

import com.izigo.smartsaleterminal.enums.PosTerminalOperationStatus;
import com.izigo.smartsaleterminal.operations.makeRefund.MakeRefundResponse;

public class MakeRefundResponseDto {
    private int operationId;
    private String operation;
    private String terminalId;
    private String rawData;
    private BigDecimal amount;
    private String currencyIso;
    private PosTerminalOperationStatus posTerminalOperationStatus;
    private PaymentStatus paymentStatus;
    private String hostResponseCode;
    private String dateTimeOfHostOperation;
    private String originalDateTimeOfTerminalOperation;
    private Integer transactionIdInCommutationServer;
    private Integer transactionIdInExternalDevice;
    private String merchantId;
    private String cardNumber;
    private String authorizeCode;
    private String linkNumberRrn;
    private String additionalResponseData;
    private String receiptData;
    private String nativeResultCode;
    private String nativeErrorMessage;

    public MakeRefundResponseDto() {}

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

    public PosTerminalOperationStatus getPosTerminalOperationStatus() { return posTerminalOperationStatus; }
    private void setPosTerminalOperationStatus(PosTerminalOperationStatus value) { this.posTerminalOperationStatus = value; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus value) { this.paymentStatus = value; }

    public String getHostResponseCode() { return hostResponseCode; }
    private void setHostResponseCode(String value) { this.hostResponseCode = value; }

    public String getDateTimeOfHostOperation() { return dateTimeOfHostOperation; }
    public void setDateTimeOfHostOperation(String value) { this.dateTimeOfHostOperation = value; }

    public String getOriginalDateTimeOfTerminalOperation() { return originalDateTimeOfTerminalOperation; }
    public void setOriginalDateTimeOfTerminalOperation(String value) { this.originalDateTimeOfTerminalOperation = value; }

    public Integer getTransactionIdInCommutationServer() { return transactionIdInCommutationServer; }
    public void setTransactionIdInCommutationServer(Integer value) { this.transactionIdInCommutationServer = value; }

    public Integer getTransactionIdInExternalDevice() { return transactionIdInExternalDevice; }
    public void setTransactionIdInExternalDevice(Integer value) { this.transactionIdInExternalDevice = value; }

    public String getMerchantId() { return merchantId; }
    public void setMerchantId(String value) { this.merchantId = value; }

    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String value) { this.cardNumber = value; }

    public String getAuthorizeCode() { return authorizeCode; }
    public void setAuthorizeCode(String value) { this.authorizeCode = value; }

    public String getLinkNumberRrn() { return linkNumberRrn; }
    public void setLinkNumberRrn(String value) { this.linkNumberRrn = value; }

    public String getAdditionalResponseData() { return additionalResponseData; }
    public void setAdditionalResponseData(String value) { this.additionalResponseData = value; }

    public String getReceiptData() { return receiptData; }
    public void setReceiptData(String value) { this.receiptData = value; }

    public String getNativeResultCode() { return nativeResultCode; }
    public void setNativeResultCode(String nativeResultCode) { this.nativeResultCode = nativeResultCode; }

    public String getNativeErrorMessage() { return nativeErrorMessage; }
    public void setNativeErrorMessage(String nativeErrorMessage) { this.nativeErrorMessage = nativeErrorMessage; }

    @NonNull
    public static MakeRefundResponseDto copyFrom(@NonNull MakeRefundResponse response) {
        MakeRefundResponseDto dto = new MakeRefundResponseDto();

        dto.setOperationId(response.getOperationId());
        dto.setOperation(response.getOperationName());
        dto.setTerminalId(response.getTerminalId());
        dto.setRawData(response.getRawData());

        if (response.getAmount() != null) {
            dto.setAmount(response.getAmount().getNumberStripped());
            dto.setCurrencyIso(response.getAmount().getCurrency().getCurrencyCode());
        }

        dto.setPosTerminalOperationStatus(response.getPosTerminalOperationStatus());

        dto.setAuthorizeCode(response.getAuthorizeCode());
        dto.setLinkNumberRrn(response.getLinkNumberRrn());

        dto.setHostResponseCode(response.getHostResponseCode());
        dto.setDateTimeOfHostOperation(response.getDateTimeOfHostOperation());
        dto.setOriginalDateTimeOfTerminalOperation(response.getOriginalDateTimeOfTerminalOperation());
        dto.setTransactionIdInCommutationServer(response.getTransactionIdInCommutationServer());
        dto.setTransactionIdInExternalDevice(response.getTransactionIdInExternalDevice());
        dto.setMerchantId(response.getMerchantId());
        dto.setCardNumber(response.getCardNumber());
        dto.setAdditionalResponseData(response.getAdditionalResponseData());
        dto.setReceiptData(response.getReceiptData());

        dto.setNativeResultCode(response.getResponseCode().toString());
        dto.setNativeErrorMessage(response.getErrorMessage());

        return dto;
    }
}
