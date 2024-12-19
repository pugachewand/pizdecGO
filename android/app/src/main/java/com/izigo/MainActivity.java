package com.izigo;


import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.izigo.heartbeat.HeartbeatEngine;
import com.izigo.logger.LoggerEnums;
import com.izigo.scanner.IScannerEngineListener;
import com.izigo.scanner.ScannerDeviceMonitor;
import com.izigo.smartsaleterminal.PosTerminalMonitor;
import com.izigo.utils.UsbPermissionHelper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MainActivity
        extends ReactActivity
        implements IScannerEngineListener
{
  private static final Logger mLogger = LoggerFactory.getLogger(MainActivity.class);

  private final Object mIntentProcessorSyncObject = new Object();
  private PosTerminalMonitor mPosTerminalMonitor;
  private ScannerDeviceMonitor mScannerDeviceMonitor;
  private HeartbeatEngine mHeartbeatEngine;

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "iziGo";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    requestWindowFeature(Window.FEATURE_NO_TITLE);
    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN);
    super.onCreate(savedInstanceState);

    enableImmersiveMode();
    
    mLogger.info(LoggerEnums.AppInitialization.toString());

    mPosTerminalMonitor = PosTerminalMonitor.create(this, mIntentProcessorSyncObject);
    mScannerDeviceMonitor = ScannerDeviceMonitor.create(getApplicationContext(), this, mIntentProcessorSyncObject, this);
    mHeartbeatEngine = new HeartbeatEngine();
  }

  private MainApplication.IziGoReactNativeHost getHost() {
    return (MainApplication.IziGoReactNativeHost) getReactNativeHost();
  }

  protected void enableImmersiveMode() {
    WindowInsetsControllerCompat windowInsetsController =
            WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
    windowInsetsController.setSystemBarsBehavior(
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
    );

    getWindow().getDecorView().setOnApplyWindowInsetsListener((view, windowInsets) -> {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                windowInsetsController.hide(WindowInsetsCompat.Type.systemBars());
      }
      return view.onApplyWindowInsets(windowInsets);
    });
  }

  @Override
  protected void onDestroy() {
    mLogger.info("MainActivity.onDestroy");

    mScannerDeviceMonitor.onDestroy();
    mHeartbeatEngine.onDestroy();

    com.izigo.smartsaleterminal.Globals.destroyRotEngine();

    super.onDestroy();
  }

  @Override
  protected void onStart() {
    mLogger.info("MainActivity.onStart");

    super.onStart();

    getHost().customInititialize();

    mPosTerminalMonitor.onStart();
    mScannerDeviceMonitor.onStart();
    mHeartbeatEngine.onStart();
  }

  @Override
  protected void onStop() {
    mLogger.info("MainActivity.onStop");

    mPosTerminalMonitor.onStop();
    mScannerDeviceMonitor.onStop();
    mHeartbeatEngine.onStop();

    getHost().customUninitialize();

    super.onStop();
  }

  @Override
  public void onNewIntent(Intent intent) {
    mLogger.info("MainActivity.onNewIntent " + UsbPermissionHelper.intentToString(intent));

    super.onNewIntent(intent);

    setIntent(intent);
  }

  @Override
  protected void onResume() {
    mLogger.info("MainActivity.onResume");
    super.onResume();

    mPosTerminalMonitor.onResume();
    mScannerDeviceMonitor.onResume();
    mHeartbeatEngine.onResume();
  }

  @Override
  protected void onPause() {
    mLogger.info("MainActivity.onPause");

    mPosTerminalMonitor.onPause();
    mScannerDeviceMonitor.onPause();
    mHeartbeatEngine.onPause();

    super.onPause();
  }

  @Override
  public void onRead(String data) {
    mLogger.info("MainActivity.onRead: " + data);
    sendEvent(getReactNativeHost().getReactInstanceManager().getCurrentReactContext(), "onScannerReadAsync", data);
  }

  private void sendEvent(ReactContext reactContext,
                         String eventName,
                         String params) {
    reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
  }
}
