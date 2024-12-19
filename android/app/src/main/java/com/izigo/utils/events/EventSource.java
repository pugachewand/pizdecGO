package com.izigo.utils.events;

import androidx.annotation.NonNull;

import java.util.ArrayList;
import java.util.List;

public abstract class EventSource<T extends Object & IEventListener> {
    private final List<T> mListeners = new ArrayList<>();

    protected boolean addListener(@NonNull T listener) {
        if (!mListeners.contains(listener))
            return mListeners.add(listener);
        return false;
    }

    protected boolean removeListener(@NonNull T listener) {
        return mListeners.remove(listener);
    }

    public void cleanListeners() {
        mListeners.clear();
    }

    protected ArrayList<T> getListeners() {
        return new ArrayList<T>(mListeners);
    }

    protected final int getListenersCount() {
        return mListeners.size();
    }
}
