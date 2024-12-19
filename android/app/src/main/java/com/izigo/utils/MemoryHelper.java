package com.izigo.utils;

public class MemoryHelper {
    public static String getAddress(Object value) {
        if (value == null)
            return String.valueOf(value);

        return value.toString();
    }
}
