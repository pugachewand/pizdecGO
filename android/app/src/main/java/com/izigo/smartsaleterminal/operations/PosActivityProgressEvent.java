package com.izigo.smartsaleterminal.operations;

import java.util.EventObject;

import com.izigo.smartsaleterminal.operations.PosActivityBase;
import ru.inpas.connector.lib.PosExchange;

public final class PosActivityProgressEvent extends EventObject {
    private final PosExchange.Progress mProgress;

    public PosActivityProgressEvent(PosActivityBase source, PosExchange.Progress progress) {
        super(source);

        mProgress = progress;
    }

    public PosExchange.Progress getProgressValue() {
        return mProgress;
    }
}
