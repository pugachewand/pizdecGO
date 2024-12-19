package com.izigo.smartsaleterminal;

import androidx.annotation.NonNull;

import com.izigo.MainActivity;
import com.izigo.smartsaleterminal.paymentService.CancelPaymentRequestDto;
import com.izigo.smartsaleterminal.paymentService.CancelPaymentResponseDto;
import com.izigo.smartsaleterminal.paymentService.PaymentServiceErrorCode;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SmartSaleTerminalCancelPaymentCommand extends SmartSaleTerminalCommandBase{
    private CancelPaymentRequestDto mRequest;
    private CancelPaymentResponseDto mResponse;
    private static final Logger logger = LoggerFactory.getLogger(MainActivity.class);

    private SmartSaleTerminalCancelPaymentCommand(String createdDate, String requestDate, String responseDate, boolean succeeded) {
        super(createdDate, requestDate, responseDate, succeeded);
    }

    @NonNull
    public static SmartSaleTerminalCancelPaymentCommand createSucceeded(
            @NonNull String createdDate, @NonNull String requestDate, @NonNull String responseDate,
            @NonNull CancelPaymentRequestDto request, @NonNull CancelPaymentResponseDto response
    ) {
        SmartSaleTerminalCancelPaymentCommand cmd = new SmartSaleTerminalCancelPaymentCommand(
                createdDate, requestDate, responseDate, true);

        cmd.setRequest(request);
        cmd.setResponse(response);
        logger.info(cmd.mRequest.toString() + "\n" + cmd.mResponse.toString());

        return cmd;
    }

    @NonNull
    public static SmartSaleTerminalCancelPaymentCommand createFailed(
            @NonNull String createdDate, @NonNull String requestDate, String responseDate,
            @NonNull PaymentServiceErrorCode errorCode, String errorMessage
    ) {
        SmartSaleTerminalCancelPaymentCommand cmd = new SmartSaleTerminalCancelPaymentCommand(
                createdDate, requestDate, responseDate, false);

        cmd.setErrorCode(errorCode);
        cmd.setErrorMessage(errorMessage);
        logger.info(cmd.getErrorCode() + "\n" + errorMessage);

        return cmd;
    }

    public CancelPaymentRequestDto getRequest() { return mRequest; }
    public void setRequest(CancelPaymentRequestDto value) { this.mRequest = value; }

    public CancelPaymentResponseDto getResponse() { return mResponse; }
    public void setResponse(CancelPaymentResponseDto value) { this.mResponse = value; }
}
