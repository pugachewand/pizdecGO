package com.izigo.smartsaleterminal.operations;

import android.content.Context;

import androidx.annotation.NonNull;

import com.izigo.MainActivity;
import com.izigo.utils.ValueResult;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ru.inpas.connector.lib.PosExchange;
import ru.inpas.connector.lib.SAParam;

public abstract class PosActivityBase<T extends PosActivityRequestBase, U extends PosActivityResponseBase>
        implements PosExchange.IAsynHandler {

    protected final Context mContext;
    protected final PosExchangeSettings mPosExchangeSettings;
    private static final Logger logger = LoggerFactory.getLogger(MainActivity.class);

    private PosExchange mPosExchangeTask;

    protected PosActivityBase(@NonNull Context context,
                              @NonNull PosExchangeSettings posExchangeSettings) {
        mContext = context;
        mPosExchangeSettings = posExchangeSettings;

        mPosExchangeTask = null;

        setPosExchangeGlobalParams();
    }

    private void setPosExchangeGlobalParams() {
        PosExchange.SetParameter(PosExchange.ParameterId.CALLING_CONTEXT, mContext);

        PosExchange.SetParameter(PosExchange.ParameterId.LOG_MODE, mPosExchangeSettings.getLogMode());
        PosExchange.SetParameter(PosExchange.ParameterId.CONNECT_TIMEOUT, mPosExchangeSettings.getConnectTimeout());
        PosExchange.SetParameter(PosExchange.ParameterId.ACK_COUNT, mPosExchangeSettings.getAckCount());

        PosExchange.SetParameter(PosExchange.ParameterId.FILE_PATH, mPosExchangeSettings.getLogFilesDir());
    }

    public ValueResult<T> sendRequest(T request) {
        try {
            SAParam saRequest = generatePosExchangeRequest(request);
            String saToString = convertSaParamToString(saRequest);

            request.setRawData(saToString);
            logger.info("отправка на пос: \n" + saToString);
            mPosExchangeTask = new PosExchange(mContext, saRequest, this);
            logger.info("Отправили на пос ");

            return ValueResult.Success(request);
        } catch (Exception ex) {
            logger.info("Не смогли отправить на пос: " + ex.toString());
            return ValueResult.Failure(ex.getMessage());
        }
    }

    private SAParam generatePosExchangeRequest(T request) {
        SAParam saRequest = new SAParam();

        saRequest.putString(SAParam.ID.SAF_TERMINAL_ID, request.getTerminalId());
        saRequest.putInteger(SAParam.ID.SAF_OPER_ID, request.getOperationId());

        FillSaRequestParameters(saRequest, request);

        return saRequest;
    }

    protected abstract void FillSaRequestParameters(SAParam saRequest, T request);

    @Override
    public void OnDone(PosExchange.Result result) {
        logger.info("OnDone start, result: " + result.toString());
        try {
            SAParam response = mPosExchangeTask.GetResponse();
            U processedResult = ProcessOperationResult(result, response);
            String responseToString = convertSaParamToString(response);
            processedResult.setRawData(responseToString);
            logger.info("Ответ из шины: " + responseToString);

            InternalOnDone(processedResult);
            logger.info("Успешно десериализован ответ из шины");

        } catch (Exception ex) {
            logger.error("Неуспешно десериализован ответ из шины: \n" + ex.toString());
        } finally {
            mPosExchangeTask = null;
        }
    }

    protected abstract U ProcessOperationResult(PosExchange.Result result, SAParam response);

    protected abstract void InternalOnDone(U result);

    protected static String convertSaParamToString(SAParam response) {
        StringBuilder sb = new StringBuilder();

        if (response != null) {
        for (SAParam.ID id : SAParam.ID.values()) {
            if (!response.isEmpty(id)) {
                sb.append(id.toString()).append(String.format("(%d): ", id.getValue()));
                if (SAParam.isInteger(id)) {
                    sb.append(response.getInteger(id).toString());
                } else if (SAParam.isBinary(id)) {
                    sb.append(String.format("binary data, %d byte(s)", response.getBytes(id).length));
                } else {
                    sb.append("'").append(response.getString(id)).append("'");
                }
                sb.append(System.lineSeparator());
            }
        }
        } else {
            sb.append("null");
        }

        return sb.toString();
    }

    @Override
    public void OnProgress(PosExchange.Progress progress) {
        System.out.println("OnProgress  " + progress.toString());

        InternalOnProgress(new PosActivityProgressEvent(this, progress));
    }

    protected abstract void InternalOnProgress(PosActivityProgressEvent progressEvent);
}
