package com.izigo.smartsaleterminal.paymentService;

public enum PaymentStatus {
    UNDEFINED(0),
    SUCCESS(1),
    PAID(2),
    ERROR(3);

    private final int value;

    private PaymentStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return this.value;
    }
}
