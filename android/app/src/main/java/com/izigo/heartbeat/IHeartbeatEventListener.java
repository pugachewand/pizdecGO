package com.izigo.heartbeat;

import com.izigo.utils.events.IEventListener;

public interface IHeartbeatEventListener extends IEventListener {
    void tick();
}
