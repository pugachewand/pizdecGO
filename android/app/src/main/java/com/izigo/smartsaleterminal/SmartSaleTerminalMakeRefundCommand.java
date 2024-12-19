package com.izigo.smartsaleterminal;

import androidx.annotation.NonNull;

import com.izigo.MainActivity;
import com.izigo.smartsaleterminal.paymentService.MakeRefundRequestDto;
import com.izigo.smartsaleterminal.paymentService.MakeRefundResponseDto;
import com.izigo.smartsaleterminal.paymentService.PaymentServiceErrorCode;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SmartSaleTerminalMakeRefundCommand extends SmartSaleTerminalCommandBase{
    private MakeRefundRequestDto mRequest;
    private MakeRefundResponseDto mResponse;
    private static final Logger logger = LoggerFactory.getLogger(MainActivity.class);

    private SmartSaleTerminalMakeRefundCommand(String createdDate, String requestDate, String responseDate, boolean succeeded) {
        super(createdDate, requestDate, responseDate, succeeded);
    }

    @NonNull
    public static SmartSaleTerminalMakeRefundCommand createSucceeded(
            @NonNull String createdDate, @NonNull String requestDate, @NonNull String responseDate,
            @NonNull MakeRefundRequestDto request, @NonNull MakeRefundResponseDto response
    ) {
        SmartSaleTerminalMakeRefundCommand cmd = new SmartSaleTerminalMakeRefundCommand(
                createdDate, requestDate, responseDate, true);

        cmd.setRequest(request);
        cmd.setResponse(response);
        logger.info(cmd.mRequest.toString() + "\n" + cmd.mResponse.toString());

        return cmd;
    }

    @NonNull
    public static SmartSaleTerminalMakeRefundCommand createFailed(
            @NonNull String createdDate, @NonNull String requestDate, String responseDate,
            @NonNull PaymentServiceErrorCode errorCode, String errorMessage
    ) {
        SmartSaleTerminalMakeRefundCommand cmd = new SmartSaleTerminalMakeRefundCommand(
                createdDate, requestDate, responseDate, false);

        cmd.setErrorCode(errorCode);
        cmd.setErrorMessage(errorMessage);
        logger.info(cmd.getErrorCode() + "\n" + errorMessage);

        return cmd;
    }

    public MakeRefundRequestDto getRequest() { return mRequest; }
    public void setRequest(MakeRefundRequestDto value) { this.mRequest = value; }

    public MakeRefundResponseDto getResponse() { return mResponse; }
    public void setResponse(MakeRefundResponseDto value) { this.mResponse = value; }
}
