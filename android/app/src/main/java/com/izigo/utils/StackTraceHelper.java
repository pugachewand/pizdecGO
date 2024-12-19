package com.izigo.utils;

public final class StackTraceHelper {
    public static String toString(StackTraceElement[] array) {
        if (array == null)
            return "empty";

        StringBuilder sb = new StringBuilder();
        for (StackTraceElement item : array) {
            sb.append(item.toString());
            sb.append("\n");
        }

        return sb.toString();
    }
}
