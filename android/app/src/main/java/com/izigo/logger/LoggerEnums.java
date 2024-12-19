package com.izigo.logger;

public enum LoggerEnums {
    AppInitialization("\n \n \n \n Инициализация приложения"),

//    SCANNER
    ScannerInitialization("Инициализация сканера"),
    deviceNotFound ("connection failed: device not found"),
    driverNotFound ("connection failed: no driver for device"),
    notEnoughPorts ("connection failed: not enough ports at device"),
    permissionRequested ("connection failed: permission requested"),
    permissionDenied ("connection failed: permission denied"),
    openFailed ("connection failed: open failed"),
    setSettingParams ("Setting serial parameters failed"),
    SmartSaleTerminalGetConnectStatusCommandFailed ("SmartSaleTerminalGetConnectStatusCommand.createFailed"),
    SmartSaleTerminalGetConnectStatusCommandSuccess ("SmartSaleTerminalGetConnectStatusCommand.createSuccess"),
    SmartSaleTerminalMakePaymentCommandFailed ("SmartSaleTerminalMakePaymentCommand.createFailed"),
    SmartSaleTerminalMakePaymentCommandSuccess ("SmartSaleTerminalMakePaymentCommand.createSuccess"),
    SmartSaleTerminalReconciliationOfTotalsCommandFailed ("SmartSaleTerminalReconciliationOfTotalsCommand.createFailed"),
    SmartSaleTerminalReconciliationOfTotalsCommandSuccess ("SmartSaleTerminalReconciliationOfTotals.createSuccess"),
    SmartSaleTerminalMakeRefundCommandFailed ("SmartSaleTerminalMakeRefundCommand.createFailed"),
    SmartSaleTerminalMakeRefundCommandSuccess ("SmartSaleTerminalMakeRefundCommand.createSuccess"),
    SmartSaleTerminalCancelPaymentCommandFailed ("SmartSaleTerminalCancelPaymentCommand.createFailed"),
    SmartSaleTerminalCancelPaymentCommandSuccess ("SmartSaleTerminalCancelPaymentCommand.createSuccess"),
    ;


    private String title;

    LoggerEnums(String title) {
        this.title = title;
    }

    @Override
    public String toString() {
        return title;
    }
}
