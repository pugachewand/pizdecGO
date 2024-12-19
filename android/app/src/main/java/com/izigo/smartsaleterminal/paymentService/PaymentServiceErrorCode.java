package com.izigo.smartsaleterminal.paymentService;

public enum PaymentServiceErrorCode {
    UNDEFINED(0),
    UNEXPECTED(1),
    SEND_REQUEST_ERROR(2);

    private final int value;

    private PaymentServiceErrorCode(int value) {
        this.value = value;
    }

    public int getValue() {
        return this.value;
    }
}
