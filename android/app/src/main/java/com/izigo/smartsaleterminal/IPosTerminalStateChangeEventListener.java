package com.izigo.smartsaleterminal;

import com.izigo.utils.events.IEventListener;

public interface IPosTerminalStateChangeEventListener extends IEventListener {
    void changed(boolean value);
}
