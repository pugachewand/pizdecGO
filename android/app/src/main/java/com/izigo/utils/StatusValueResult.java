package com.izigo.utils;

public class StatusValueResult<T, U> {
    private T mValue;
    private U mStatus;
    private boolean mSucceeded;
    private String mErrorMessage;

    private StatusValueResult(boolean succeeded, T value, U status, String errorMessage) {
        mSucceeded = succeeded;
        mValue = value;
        mStatus = status;
        mErrorMessage = errorMessage;
    }

    public boolean getSucceeded() {
        return mSucceeded;
    }

    public String getErrorMessage() {
        return mErrorMessage;
    }

    public T getValue() {
        return mValue;
    }

    public U getStatus() { return mStatus; }

    public static <T, U> StatusValueResult Success(T value) {
        return new StatusValueResult<T, U>(true, value, null, null);
    }

    public static <T, U> StatusValueResult Failure(U status, String errorMessage) {
        return new StatusValueResult<T, U>(false, null, status, errorMessage);
    }
}
