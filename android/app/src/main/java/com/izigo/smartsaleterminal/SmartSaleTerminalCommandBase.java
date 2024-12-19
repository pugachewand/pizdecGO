package com.izigo.smartsaleterminal;

import com.izigo.smartsaleterminal.paymentService.PaymentServiceErrorCode;

public abstract class SmartSaleTerminalCommandBase {
    private final String mCreatedDate;
    private final String mRequestDate;
    private final String mResponseDate;
    private PaymentServiceErrorCode mErrorCode;
    private String mErrorMessage;
    private final boolean mSucceeded;

    protected SmartSaleTerminalCommandBase(String createdDate, String requestDate, String responseDate, boolean succeeded) {
        mCreatedDate = createdDate;
        mRequestDate = requestDate;
        mResponseDate = responseDate;
        mSucceeded = succeeded;
    }

    public String getCreatedDate() { return mCreatedDate; }

    public String getRequestDate() { return mRequestDate; }

    public String getResponseDate() { return mResponseDate; }

    public boolean getSucceeded() { return mSucceeded; }

    public PaymentServiceErrorCode getErrorCode() { return mErrorCode; }
    public void setErrorCode(PaymentServiceErrorCode value) { this.mErrorCode = value; }

    public String getErrorMessage() { return mErrorMessage; }
    public void setErrorMessage(String value) { this.mErrorMessage = value; }
}
