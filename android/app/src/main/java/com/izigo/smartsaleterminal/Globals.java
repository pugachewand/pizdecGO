package com.izigo.smartsaleterminal;

import androidx.annotation.NonNull;

import com.izigo.smartsaleterminal.paymentService.IReconciliationOfTotalsEngine;
import com.izigo.smartsaleterminal.paymentService.ReconciliationOfTotalsEngine;

public class Globals {
    private static boolean gPosTerminalConnected = false;
    private static IReconciliationOfTotalsEngine gReconciliationEngine = null;
    public static String gTerminalId = null;
    private static final PosTerminalConnectedStateNotifier gPosTerminalConnectedStateNotifier = new PosTerminalConnectedStateNotifier();

    public static IReconciliationOfTotalsEngine getRotEngine() { return gReconciliationEngine; }

    public static void createRotEngine(
            String timeOfStart, int periodInMinutes, String lastTimeOfRun, int repeatOnErrorCount
    ) {
        if (gReconciliationEngine != null)
            destroyRotEngine();

        gReconciliationEngine = ReconciliationOfTotalsEngine.create(timeOfStart, periodInMinutes, lastTimeOfRun, repeatOnErrorCount);
    }

    public static boolean getTerminalConnected() {
        return gPosTerminalConnected;
    }

    public static void destroyRotEngine() {
        if (gReconciliationEngine != null) {
            gReconciliationEngine.destroy();
            gReconciliationEngine = null;
        }
    }

    public static boolean getPosTerminalConnected() {
        return Globals.gPosTerminalConnected;
    }

    public static void setPosTerminalConnected(boolean value) {
        boolean changed = gPosTerminalConnected != value;

        gPosTerminalConnected = value;

        if (changed)
            gPosTerminalConnectedStateNotifier.notifyListeners(gPosTerminalConnected);
    }

    public static void subscribeForPosTerminalConnectedStateNotification(@NonNull IPosTerminalStateChangeEventListener listener) {
        gPosTerminalConnectedStateNotifier.addListener(listener);
    }

    public static void unsubscribeFromPosTerminalConnectedStateNotification(@NonNull IPosTerminalStateChangeEventListener listener) {
        gPosTerminalConnectedStateNotifier.removeListener(listener);
    }
}
