package com.izigo.smartsaleterminal;

import androidx.annotation.NonNull;

import com.izigo.MainActivity;
import com.izigo.smartsaleterminal.paymentService.ReconciliationOfTotalsRequestDto;
import com.izigo.smartsaleterminal.paymentService.ReconciliationOfTotalsResponseDto;
import com.izigo.smartsaleterminal.paymentService.PaymentServiceErrorCode;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SmartSaleTerminalReconciliationOfTotalsCommand extends SmartSaleTerminalCommandBase {
    private ReconciliationOfTotalsRequestDto mRequest;
    private ReconciliationOfTotalsResponseDto mResponse;
    private static final Logger logger = LoggerFactory.getLogger(MainActivity.class);

    private SmartSaleTerminalReconciliationOfTotalsCommand(String createdDate, String requestDate, String responseDate, boolean succeeded) {
        super(createdDate, requestDate, responseDate, succeeded);
    }

    @NonNull
    public static SmartSaleTerminalReconciliationOfTotalsCommand createSucceeded(
            @NonNull String createdDate, @NonNull String requestDate, @NonNull String responseDate,
            @NonNull ReconciliationOfTotalsRequestDto request, @NonNull ReconciliationOfTotalsResponseDto response
    ) {
        SmartSaleTerminalReconciliationOfTotalsCommand cmd = new SmartSaleTerminalReconciliationOfTotalsCommand(
                createdDate, requestDate, responseDate, true);

        cmd.setRequest(request);
        cmd.setResponse(response);
        logger.info(cmd.mRequest.toString() + "\n" + cmd.mResponse.toString());

        return cmd;
    }

    @NonNull
    public static SmartSaleTerminalReconciliationOfTotalsCommand createFailed(
            @NonNull String createdDate, @NonNull String requestDate, String responseDate,
            @NonNull PaymentServiceErrorCode errorCode, String errorMessage
    ) {
        SmartSaleTerminalReconciliationOfTotalsCommand cmd = new SmartSaleTerminalReconciliationOfTotalsCommand(
                createdDate, requestDate, responseDate, false);

        cmd.setErrorCode(errorCode);
        cmd.setErrorMessage(errorMessage);
        logger.info(cmd.getErrorCode() + "\n" + errorMessage);

        return cmd;
    }

    public ReconciliationOfTotalsRequestDto getRequest() { return mRequest; }
    public void setRequest(ReconciliationOfTotalsRequestDto value) { this.mRequest = value; }

    public ReconciliationOfTotalsResponseDto getResponse() { return mResponse; }
    public void setResponse(ReconciliationOfTotalsResponseDto value) { this.mResponse = value; }
}
