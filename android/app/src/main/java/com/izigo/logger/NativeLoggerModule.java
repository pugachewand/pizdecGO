package com.izigo.logger;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.izigo.MainActivity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NativeLoggerModule extends ReactContextBaseJavaModule {
    NativeLoggerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    private static final int LOG_LEVEL_DEBUG = 0;
    private static final int LOG_LEVEL_INFO = 1;
    private static final int LOG_LEVEL_WARNING = 2;
    private static final int LOG_LEVEL_ERROR = 3;
    private static final Logger logger = LoggerFactory.getLogger(MainActivity.class);

    @ReactMethod
    public void writeLog(double level, String str) {
        switch ((int) level) {
            case LOG_LEVEL_DEBUG:
                logger.debug(str);
                break;
            case LOG_LEVEL_INFO:
                logger.info(str);
                break;
            case LOG_LEVEL_WARNING:
                logger.warn(str);
                break;
            case LOG_LEVEL_ERROR:
                logger.error(str);
                break;
        }
    }
    public String getName() {
        return "NativeLoggerModule";
    }

}
