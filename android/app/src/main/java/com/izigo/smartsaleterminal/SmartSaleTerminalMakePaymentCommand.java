package com.izigo.smartsaleterminal;

import androidx.annotation.NonNull;

import com.izigo.MainActivity;
import com.izigo.smartsaleterminal.paymentService.MakePaymentRequestDto;
import com.izigo.smartsaleterminal.paymentService.MakePaymentResponseDto;
import com.izigo.smartsaleterminal.paymentService.PaymentServiceErrorCode;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SmartSaleTerminalMakePaymentCommand extends SmartSaleTerminalCommandBase{
    private MakePaymentRequestDto mRequest;
    private MakePaymentResponseDto mResponse;
    private static final Logger logger = LoggerFactory.getLogger(MainActivity.class);

    private SmartSaleTerminalMakePaymentCommand(String createdDate, String requestDate, String responseDate, boolean succeeded) {
        super(createdDate, requestDate, responseDate, succeeded);
    }

    @NonNull
    public static SmartSaleTerminalMakePaymentCommand createSucceeded(
            @NonNull String createdDate, @NonNull String requestDate, @NonNull String responseDate,
            @NonNull MakePaymentRequestDto request, @NonNull MakePaymentResponseDto response
    ) {
        SmartSaleTerminalMakePaymentCommand cmd = new SmartSaleTerminalMakePaymentCommand(
                createdDate, requestDate, responseDate, true);

        cmd.setRequest(request);
        cmd.setResponse(response);
        logger.info(cmd.mRequest.toString() + "\n" + cmd.mResponse.toString());

        return cmd;
    }

    @NonNull
    public static SmartSaleTerminalMakePaymentCommand createFailed(
            @NonNull String createdDate, @NonNull String requestDate, String responseDate,
            @NonNull PaymentServiceErrorCode errorCode, String errorMessage
    ) {
        SmartSaleTerminalMakePaymentCommand cmd = new SmartSaleTerminalMakePaymentCommand(
                createdDate, requestDate, responseDate, false);

        cmd.setErrorCode(errorCode);
        cmd.setErrorMessage(errorMessage);
        logger.info(cmd.getErrorCode() + "\n" + errorMessage);

        return cmd;
    }

    public MakePaymentRequestDto getRequest() { return mRequest; }
    public void setRequest(MakePaymentRequestDto value) { this.mRequest = value; }

    public MakePaymentResponseDto getResponse() { return mResponse; }
    public void setResponse(MakePaymentResponseDto value) { this.mResponse = value; }
}
