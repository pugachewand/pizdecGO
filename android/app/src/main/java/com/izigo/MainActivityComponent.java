package com.izigo;

public abstract class MainActivityComponent {
    public abstract void onStart();

    public abstract void onStop();

    public abstract void onPause();

    public abstract void onResume();

    public void onDestroy() { }
}
