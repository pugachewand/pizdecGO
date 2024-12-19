package com.izigo.utils;

public class ValueResult<T> {
    private T mValue;
    private boolean mSucceeded;
    private String mErrorMessage;

    private ValueResult(boolean succeeded, T value, String errorMessage) {
        mSucceeded = succeeded;
        mValue = value;
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

    public static <T> ValueResult Success(T value) {
        return new ValueResult<T>(true, value, null);
    }

    public static <T> ValueResult Failure(String errorMessage) {
        return new ValueResult<T>(false, null, errorMessage);
    }
}
