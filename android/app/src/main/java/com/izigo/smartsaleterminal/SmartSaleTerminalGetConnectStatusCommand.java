package com.izigo.smartsaleterminal;

import androidx.annotation.NonNull;

import com.izigo.MainActivity;
import com.izigo.smartsaleterminal.paymentService.GetConnectionStatusRequestDto;
import com.izigo.smartsaleterminal.paymentService.GetConnectionStatusResponseDto;
import com.izigo.smartsaleterminal.paymentService.PaymentServiceErrorCode;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SmartSaleTerminalGetConnectStatusCommand extends SmartSaleTerminalCommandBase{
    private GetConnectionStatusRequestDto mRequest;
    private GetConnectionStatusResponseDto mResponse;
    private static final Logger logger = LoggerFactory.getLogger(MainActivity.class);

    private SmartSaleTerminalGetConnectStatusCommand(String createdDate, String requestDate, String responseDate, boolean succeeded) {
        super(createdDate, requestDate, responseDate, succeeded);
    }

    @NonNull
    public static SmartSaleTerminalGetConnectStatusCommand createSucceeded(
            @NonNull String createdDate, @NonNull String requestDate, @NonNull String responseDate,
            @NonNull GetConnectionStatusRequestDto request, @NonNull GetConnectionStatusResponseDto response
    ) {
        SmartSaleTerminalGetConnectStatusCommand cmd = new SmartSaleTerminalGetConnectStatusCommand(
                createdDate, requestDate, responseDate, true);

        cmd.setRequest(request);
        cmd.setResponse(response);
        logger.info(cmd.mRequest.toString() + "\n" + cmd.mResponse.toString());

        return cmd;
    }

    @NonNull
    public static SmartSaleTerminalGetConnectStatusCommand createFailed(
            @NonNull String createdDate, @NonNull String requestDate, String responseDate,
            @NonNull PaymentServiceErrorCode errorCode, String errorMessage
    ) {
        SmartSaleTerminalGetConnectStatusCommand cmd = new SmartSaleTerminalGetConnectStatusCommand(
                createdDate, requestDate, responseDate, false);

        cmd.setErrorCode(errorCode);
        cmd.setErrorMessage(errorMessage);
        logger.info(cmd.getErrorCode() + "\n" + errorMessage);

        return cmd;
    }

    public GetConnectionStatusRequestDto getRequest() { return mRequest; }
    public void setRequest(GetConnectionStatusRequestDto value) { this.mRequest = value; }

    public GetConnectionStatusResponseDto getResponse() { return mResponse; }
    public void setResponse(GetConnectionStatusResponseDto value) { this.mResponse = value; }
}
