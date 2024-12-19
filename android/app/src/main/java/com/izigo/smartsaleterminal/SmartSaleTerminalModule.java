package com.izigo.smartsaleterminal;

import android.app.Activity;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.izigo.MainActivity;
import com.izigo.smartsaleterminal.paymentService.IReconciliationOfTotalsEngineCallbackHandler;
import com.izigo.utils.MemoryHelper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SmartSaleTerminalModule
        extends ReactContextBaseJavaModule
        implements IReconciliationOfTotalsEngineCallbackHandler, IPosTerminalStateChangeEventListener {

    private static final Logger mLogger = LoggerFactory.getLogger(MainActivity.class);

    SmartSaleTerminalModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    public boolean isMainContext(ReactApplicationContext reactContext) {
        return getReactApplicationContext() == reactContext;
    }

    @Override
    public void initialize() {
        super.initialize();
        mLogger.info("SmartSaleTerminalModule.initialize");
        customInitialize();
    }

    public void customInitialize() {
        mLogger.info("SmartSaleTerminalModule.customInitialize");
        com.izigo.smartsaleterminal.Globals.subscribeForPosTerminalConnectedStateNotification(this);
    }

    public void customUninitialize() {
        mLogger.info("SmartSaleTerminalModule.customUninitialize");
        com.izigo.smartsaleterminal.Globals.unsubscribeFromPosTerminalConnectedStateNotification(this);
    }

    @ReactMethod
    public void getConnectionStatus(Promise promise) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            Log.w("NO_ACTIVITY", "activity is null");
            promise.reject("NO_ACTIVITY", "activity is null");
            return;
        }

        SmartSaleTerminalCommandExecutor executor = new SmartSaleTerminalCommandExecutor(getReactApplicationContext(),
                com.izigo.smartsaleterminal.Globals.gTerminalId);
        executor.runGetConnectionStatus(promise);
    }

    @ReactMethod
    public void makePayment(ReadableMap requestData, Promise promise) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            Log.w("NO_ACTIVITY", "activity is null");
            promise.reject("NO_ACTIVITY", "activity is null");
            return;
        }
        SmartSaleTerminalCommandExecutor executor = new SmartSaleTerminalCommandExecutor(getReactApplicationContext(),
                com.izigo.smartsaleterminal.Globals.gTerminalId);
        executor.runMakePayment(requestData, promise);
    }

    @ReactMethod
    public void reconciliateOfTotals(Promise promise) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            Log.w("NO_ACTIVITY", "activity is null");
            promise.reject("NO_ACTIVITY", "activity is null");
            return;
        }

        SmartSaleTerminalCommandExecutor executor = new SmartSaleTerminalCommandExecutor(getReactApplicationContext(),
                com.izigo.smartsaleterminal.Globals.gTerminalId);
        executor.runReconciliationOfTotals(promise);
    }

    @ReactMethod
    public void makeRefund(ReadableMap requestData, Promise promise) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            Log.w("NO_ACTIVITY", "activity is null");
            promise.reject("NO_ACTIVITY", "activity is null");
            return;
        }

        SmartSaleTerminalCommandExecutor executor = new SmartSaleTerminalCommandExecutor(getReactApplicationContext(),
                com.izigo.smartsaleterminal.Globals.gTerminalId);
        executor.runMakeRefund(requestData, promise);
    }

    @ReactMethod
    public void cancelPayment(ReadableMap requestData, Promise promise) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            Log.w("NO_ACTIVITY", "activity is null");
            promise.reject("NO_ACTIVITY", "activity is null");
            return;
        }
        SmartSaleTerminalCommandExecutor executor = new SmartSaleTerminalCommandExecutor(getReactApplicationContext(),
                com.izigo.smartsaleterminal.Globals.gTerminalId);
        executor.runCancelPayment(requestData, promise);
    }

    @ReactMethod
    public void restartDevice(Promise promise) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            Log.w("NO_ACTIVITY", "activity is null");
            promise.reject("NO_ACTIVITY", "activity is null");
            return;
        }
        SmartSaleTerminalCommandExecutor executor = new SmartSaleTerminalCommandExecutor(getReactApplicationContext(),
                com.izigo.smartsaleterminal.Globals.gTerminalId);
        executor.runRestartDevice(promise);
    }

    @ReactMethod
    public void getTerminalId(Promise promise) {
        mLogger.info(com.izigo.smartsaleterminal.Globals.gTerminalId.toString());
        promise.resolve(com.izigo.smartsaleterminal.Globals.gTerminalId);
    }

    @ReactMethod
    public void setTerminalId(String terminalId, Promise promise) {
        com.izigo.smartsaleterminal.Globals.gTerminalId = terminalId;
        mLogger.info("newTerminalId: " + terminalId + "\n" + "Global: " + com.izigo.smartsaleterminal.Globals.gTerminalId.toString());
        promise.resolve(com.izigo.smartsaleterminal.Globals.gTerminalId == terminalId);
    }

    @ReactMethod
    public void createReconciliateOfTotals(ReadableMap requestData, Promise promise) {
        String timeOfStart = requestData.getString("timeOfStart");
        Integer periodInMinutes = requestData.getInt("periodInMinutes");
        String lastTimeOfRun = requestData.getString("lastTimeOfRun");
        Integer repeatOnErrorCount = requestData.getInt("repeatOnErrorCount");

        boolean oldDestroyed = false;
        if (com.izigo.smartsaleterminal.Globals.getRotEngine() != null) {
            com.izigo.smartsaleterminal.Globals.destroyRotEngine();
            oldDestroyed = true;
        }

        mLogger.info("Instance: " + MemoryHelper.getAddress(this) + " oldDestroyed: " + oldDestroyed + " timeOfStart: "+ timeOfStart+ " periodInMinutes: " + periodInMinutes + " lastTimeOfRun: " + lastTimeOfRun + " repeatOnErrorCount: " + repeatOnErrorCount);

        com.izigo.smartsaleterminal.Globals.createRotEngine(timeOfStart, periodInMinutes, lastTimeOfRun, repeatOnErrorCount);
        promise.resolve("Instance: " + MemoryHelper.getAddress(this) + " oldDestroyed: " + oldDestroyed + " timeOfStart: "+ timeOfStart+ " periodInMinutes: " + periodInMinutes + " lastTimeOfRun: " + lastTimeOfRun + " repeatOnErrorCount: " + repeatOnErrorCount);
    }

    @ReactMethod
    public void initializeReconciliateOfTotals(Promise promise) {
        if (com.izigo.smartsaleterminal.Globals.getRotEngine() != null) {
            com.izigo.smartsaleterminal.Globals.getRotEngine().initialize(this);
            mLogger.info("Инициализирован успешно");
            promise.resolve("Инициализирован успешно");
        }
        else {
            mLogger.info("Не инициализирован");
            promise.reject("Сверка итогов", "Не инициализирован");
        }
    }

    @ReactMethod
    public void beginReconciliateOfTotals(ReadableMap requestData, Promise promise) {
        Boolean isReady = requestData.getBoolean("isReady");
        mLogger.info(isReady.toString());
        if (com.izigo.smartsaleterminal.Globals.getRotEngine() != null) {
            mLogger.info("Движок есть, запрос на letsBegin");
            com.izigo.smartsaleterminal.Globals.getRotEngine().letsBegin(isReady);
        }
        else {
            mLogger.info("Не инициализирован");
            promise.reject("Сверка итогов", "Не инициализирован");
        }
    }
    @ReactMethod
    public void getTerminalStatus(Promise promise) {
        boolean terminalConnected = com.izigo.smartsaleterminal.Globals.getTerminalConnected();
        mLogger.info("getTerminalStatus returns " + terminalConnected);
        promise.resolve(terminalConnected);
    }
    @Override
    public String getName() {
        return "SmartSaleTerminalModule";
    }

    @Override
    public void onBegin() {
        sendEvent(this.getReactApplicationContext(), "ROTOnBegin", "begin");
    }

    @Override
    public void onProgress(String value) {
        mLogger.info("ROTOnProgress::" + value.toString());
        sendEvent(this.getReactApplicationContext(), "ROTOnProgress", value);
    }

    @Override
    public void onEnd(boolean result, String data) {
        String convertedDataToSend = "{" + "\"result\":" + result + "," + "\"data\":" + data + "}";
        mLogger.info(convertedDataToSend);
        sendEvent(this.getReactApplicationContext(), "ROTOnEnd", convertedDataToSend);
    }

    @Override
    public void onMakeReconciliationRequest(Promise promise) {
        mLogger.info("Запуск сверки через кнопку");
        SmartSaleTerminalCommandExecutor executor = new SmartSaleTerminalCommandExecutor(getReactApplicationContext(),
                com.izigo.smartsaleterminal.Globals.gTerminalId);
        executor.runReconciliationOfTotals(promise);
    }
    @Override
    public void changed(boolean value) {
        mLogger.info("SmartSaleTerminalModule.changed PosTerminal connect state to " + value);
        sendEvent(this.getReactApplicationContext(), "TerminalState", String.valueOf(value));
    }
    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           String params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}