package com.izigo.smartsaleterminal.operations.cancelPayment;

import androidx.annotation.NonNull;

import org.javamoney.moneta.Money;

import com.izigo.smartsaleterminal.enums.PosActivityResultCode;
import com.izigo.smartsaleterminal.enums.PosTerminalOperation;
import com.izigo.smartsaleterminal.enums.PosTerminalOperationStatus;
import com.izigo.smartsaleterminal.operations.PosActivityResponseBase;
import com.izigo.smartsaleterminal.operations.PosActivityResponseHelper;
import com.izigo.utils.ValueResult;
import ru.inpas.connector.lib.PosExchange;
import ru.inpas.connector.lib.SAParam;

public class CancelPaymentResponse extends PosActivityResponseBase {
    private PosTerminalOperationStatus mPosTerminalOperationStatus = PosTerminalOperationStatus.UNDEFINED;
    private String mHostResponseCode;
    private Money mAmount;
    private String mDateTimeOfHostOperation;
    private String mOriginalDateTimeOfTerminalOperation;
    private Integer mTransactionIdInCommutationServer;
    private Integer mTransactionIdInExternalDevice;
    private String mMerchantId;
    private String mCardNumber;
    private String mAuthorizeCode;
    private String mLinkNumberRrn;
    private String mAdditionalResponseData;
    private String mReceiptData;

    protected CancelPaymentResponse(PosTerminalOperation operation, String terminalId,
                                    PosActivityResultCode resultCode, String errorMessage) {
        super(operation, terminalId, resultCode, errorMessage);
    }

    public PosTerminalOperationStatus getPosTerminalOperationStatus() { return mPosTerminalOperationStatus; }
    private void setPosTerminalOperationStatus(PosTerminalOperationStatus value) { mPosTerminalOperationStatus = value; }

    public String getHostResponseCode() { return mHostResponseCode; }
    private void setHostResponseCode(String value) { mHostResponseCode = value; }

    public Money getAmount() { return mAmount; }
    private void setAmount(Money value) { mAmount = value; }

    public String getDateTimeOfHostOperation() { return mDateTimeOfHostOperation; }
    public void setDateTimeOfHostOperation(String value) { mDateTimeOfHostOperation = value; }

    public String getOriginalDateTimeOfTerminalOperation() { return mOriginalDateTimeOfTerminalOperation; }
    public void setOriginalDateTimeOfTerminalOperation(String value) { mOriginalDateTimeOfTerminalOperation = value; }

    public Integer getTransactionIdInCommutationServer() { return mTransactionIdInCommutationServer; }
    public void setTransactionIdInCommutationServer(Integer value) { mTransactionIdInCommutationServer = value; }

    public Integer getTransactionIdInExternalDevice() { return mTransactionIdInExternalDevice; }
    public void setTransactionIdInExternalDevice(Integer value) { mTransactionIdInExternalDevice = value; }

    public String getMerchantId() { return mMerchantId; }
    public void setMerchantId(String value) { mMerchantId = value; }

    public String getCardNumber() { return mCardNumber; }
    public void setCardNumber(String value) { mCardNumber = value; }

    public String getAuthorizeCode() { return mAuthorizeCode; }
    public void setAuthorizeCode(String value) { mAuthorizeCode = value; }

    public String getLinkNumberRrn() { return mLinkNumberRrn; }
    public void setLinkNumberRrn(String value) { mLinkNumberRrn = value; }

    public String getAdditionalResponseData() { return mAdditionalResponseData; }
    public void setAdditionalResponseData(String value) { mAdditionalResponseData = value; }

    public String getReceiptData() { return mReceiptData; }
    public void setReceiptData(String value) { mReceiptData = value; }

    private static CancelPaymentResponse createFailed(
            PosTerminalOperation operation, String terminalId, PosActivityResultCode resultCode, String errorMessage) {

        CancelPaymentResponse response = new CancelPaymentResponse(operation, terminalId, resultCode, errorMessage);

        response.setPosTerminalOperationStatus(PosTerminalOperationStatus.ERROR);

        return response;
    }

    @NonNull
    public static CancelPaymentResponse create(
            @NonNull PosTerminalOperation operation, @NonNull String terminalId,
            @NonNull PosExchange.Result result, SAParam responseResult
    ) {
        if (result != PosExchange.Result.DONE)
            return createFailed(operation, terminalId, PosActivityResultCode.convertFrom(result), "Some error occurred during request executing.");

        CancelPaymentResponse response = new CancelPaymentResponse(operation, terminalId,
                PosActivityResultCode.convertFrom(result), null);

        response.setPosTerminalOperationStatus(PosActivityResponseHelper.ExtractPosTerminalOperationStatus(responseResult)); //SAF_TRX_STATUS
        response.setHostResponseCode(responseResult.getString(SAParam.ID.SAF_RESPONSE_CODE));
        response.setAmount(PosActivityResponseHelper.ExtractPaymentAmount(responseResult)); //SAF_TRX_AMOUNT + SAF_TRX_CURRENCY_CODE

        response.setDateTimeOfHostOperation(responseResult.getString(SAParam.ID.SAF_TRX_DATE_TIME_HOST));
        response.setOriginalDateTimeOfTerminalOperation(responseResult.getString(SAParam.ID.SAF_TRX_ORG_DATE_TIME));
        response.setTransactionIdInCommutationServer(responseResult.getInteger(SAParam.ID.SAF_TRX_ID));
        response.setTransactionIdInExternalDevice(responseResult.getInteger(SAParam.ID.SAF_STAN));

        response.setMerchantId(responseResult.getString(SAParam.ID.SAF_MERCHANT_ID));
        response.setCardNumber(responseResult.getString(SAParam.ID.SAF_PAN));

        response.setAuthorizeCode(responseResult.getString(SAParam.ID.SAF_AUTH_CODE));
        response.setLinkNumberRrn(responseResult.getString(SAParam.ID.SAF_RRN));

        response.setAdditionalResponseData(responseResult.getString(SAParam.ID.SAF_ADD_RESPONSE_DATA));
        final byte[] optCryptogramData = responseResult.getBytes(SAParam.ID.SAF_FILE_DATA);
        final byte[] optAdditionalTransactionData = responseResult.getBytes(SAParam.ID.SAF_ADDITIONAL_TRX_DATA);

        response.setReceiptData(responseResult.getString(SAParam.ID.SAF_RECEIPT_DATA));

        return response;
    }

}
