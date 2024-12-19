package com.izigo.smartsaleterminal.paymentService;

public enum PaymentServiceProgress {
    UNDEFINED(0),
    CONNECTING(1),
    CONNECTED(2),
    DISCONNECTING(3),
    DISCONNECTED(4),
    SENDING(5),
    RECEIVING(6);

    private final int value;

    private PaymentServiceProgress(int value) {
        this.value = value;
    }

    public int getValue() {
        return this.value;
    }
}
