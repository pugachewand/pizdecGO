package com.izigo.smartsaleterminal.operations;

import java.io.File;

import ru.inpas.connector.lib.PosExchange;

public class PosExchangeSettings {
    public static final int DEFAULT_CONNECT_TIMEOUT = 10;
    public static final int DEFAULT_ACK_COUNT = 3;
    public static final PosExchange.LogMode DEFAULT_LOG_MODE = PosExchange.LogMode.DEBUG;
    public static final String MODEL_NO = "iziGo";

    private String mTerminalId;
    private int mConnectTimeout;
    private int mAckCount;

    private File mLogFilesDir;
    private PosExchange.LogMode mLogMode;

    public static PosExchangeSettings createDefaultSettings(String terminalId, File logFilesDir) {
        return new PosExchangeSettings(terminalId, DEFAULT_CONNECT_TIMEOUT, DEFAULT_ACK_COUNT, logFilesDir, DEFAULT_LOG_MODE);
    }

    public PosExchangeSettings(String terminalId, int connectTimeOut, int ackCount, File logFilesDir, PosExchange.LogMode logMode) {
        mTerminalId = terminalId;

        mConnectTimeout = connectTimeOut;
        mAckCount = ackCount;

        mLogFilesDir = logFilesDir;
        mLogMode = logMode;
    }

    public String getTerminalId() {
        return mTerminalId;
    }

    public int getConnectTimeout() {
        return mConnectTimeout;
    }

    public int getAckCount() {
        return mAckCount;
    }

    public File getLogFilesDir() {
        return mLogFilesDir;
    }

    public PosExchange.LogMode getLogMode() {
        return mLogMode;
    }
}
