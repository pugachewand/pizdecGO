package com.izigo.smartsaleterminal;

import androidx.annotation.NonNull;

import com.izigo.MainActivity;
import com.izigo.smartsaleterminal.paymentService.PaymentServiceErrorCode;
import com.izigo.smartsaleterminal.paymentService.RestartDeviceRequestDto;
import com.izigo.smartsaleterminal.paymentService.RestartDeviceResponseDto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SmartSaleTerminalRestartDeviceCommand extends SmartSaleTerminalCommandBase {
    private RestartDeviceRequestDto mRequest;
    private RestartDeviceResponseDto mResponse;
    private static final Logger logger = LoggerFactory.getLogger(MainActivity.class);

    private SmartSaleTerminalRestartDeviceCommand(String createdDate, String requestDate, String responseDate, boolean succeeded) {
        super(createdDate, requestDate, responseDate, succeeded);
    }

    @NonNull
    public static SmartSaleTerminalRestartDeviceCommand createSucceeded(
            @NonNull String createdDate, @NonNull String requestDate, @NonNull String responseDate,
            @NonNull RestartDeviceRequestDto request, @NonNull RestartDeviceResponseDto response
    ) {
        SmartSaleTerminalRestartDeviceCommand cmd = new SmartSaleTerminalRestartDeviceCommand(
                createdDate, requestDate, responseDate, true);

        cmd.setRequest(request);
        cmd.setResponse(response);
        logger.info(cmd.mRequest.toString() + "\n" + cmd.mResponse.toString());

        return cmd;
    }

    @NonNull
    public static SmartSaleTerminalRestartDeviceCommand createFailed(
            @NonNull String createdDate, @NonNull String requestDate, String responseDate,
            @NonNull PaymentServiceErrorCode errorCode, String errorMessage
    ) {
        SmartSaleTerminalRestartDeviceCommand cmd = new SmartSaleTerminalRestartDeviceCommand(
                createdDate, requestDate, responseDate, false);

        cmd.setErrorCode(errorCode);
        cmd.setErrorMessage(errorMessage);
        logger.info(cmd.getErrorCode() + "\n" + errorMessage);

        return cmd;
    }

    public RestartDeviceRequestDto getRequest() { return mRequest; }
    public void setRequest(RestartDeviceRequestDto value) { this.mRequest = value; }

    public RestartDeviceResponseDto getResponse() { return mResponse; }
    public void setResponse(RestartDeviceResponseDto value) { this.mResponse = value; }
}
