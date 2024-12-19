package com.izigo.scanner;

import com.izigo.utils.events.IEventListener;

public interface IScannerStateChangeEventListener extends IEventListener {
    void changed(boolean value);
}
