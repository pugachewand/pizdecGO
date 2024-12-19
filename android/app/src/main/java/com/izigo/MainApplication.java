package com.izigo;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

import com.izigo.heartbeat.HeartbeatPackage;
import com.izigo.logger.NativeLoggerPackage;
import com.izigo.scanner.ScannerPackage;
import com.izigo.smartsaleterminal.SmartSaleTerminalPackage;

public class MainApplication extends Application implements ReactApplication {

  private final IziGoReactNativeHost mReactNativeHost = new IziGoReactNativeHost(this);

  public static final class IziGoReactNativeHost extends DefaultReactNativeHost {
    private final SmartSaleTerminalPackage mSmartSaleTerminalPackage;
    private final ScannerPackage mScannerPackage;
    private final HeartbeatPackage mHeartbeatPackage;

    public IziGoReactNativeHost(Application app) {
        super(app);

        mSmartSaleTerminalPackage = new SmartSaleTerminalPackage();
        mScannerPackage = new ScannerPackage();
        mHeartbeatPackage = new HeartbeatPackage();
    }

    public void customInititialize() {
        mSmartSaleTerminalPackage.customInitialize();
        mScannerPackage.customInitialize();
        mHeartbeatPackage.customInitialize();
    }

    public void customUninitialize() {
        mSmartSaleTerminalPackage.customUninitialize();
        mScannerPackage.customUninitialize();
        mHeartbeatPackage.customUninitialize();
    }

    @Override
    public boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
        @SuppressWarnings("UnnecessaryLocalVariable")
        List<ReactPackage> packages = new PackageList(this).getPackages();
        // Packages that cannot be autolinked yet can be added manually here, for example:
        packages.add(mSmartSaleTerminalPackage);
        packages.add(mScannerPackage);
        packages.add(mHeartbeatPackage);
        packages.add(new NativeLoggerPackage());
        return packages;
    }

    @Override
    protected String getJSMainModuleName() {
        return "index";
    }

    @Override
    protected boolean isNewArchEnabled() {
        return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }

    @Override
    protected Boolean isHermesEnabled() {
        return BuildConfig.IS_HERMES_ENABLED;
    }
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }
  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.izigo.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException |
               NoSuchMethodException |
               IllegalAccessException |
               InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
