package com.izigo.heartbeat;

import com.izigo.MainActivity;
import com.izigo.MainActivityComponent;
import com.izigo.utils.DateTimeHelper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

public class HeartbeatEngine extends MainActivityComponent {

    private static final Logger mLogger = LoggerFactory.getLogger(MainActivity.class);
    private Timer mTimer = null;

    @Override
    public void onStart() {
        mLogger.info("HeartbeatEngine.onStart");
//        createTimer();
    }

    @Override
    public void onStop() {
        mLogger.info("HeartbeatEngine.onStop");
//        dropTimer();
    }

    @Override
    public void onPause() {
        mLogger.info("HeartbeatEngine.onPause");
        dropTimer();
    }

    @Override
    public void onResume() {
        mLogger.info("HeartbeatEngine.onResume");
        createTimer();
    }

    @Override
    public void onDestroy() {
        mLogger.info("HeartbeatEngine.onDestroy");

        dropTimer();

        super.onDestroy();
    }

    private void createTimer() {
        mLogger.info("HeartbeatEngine.createTimer");
        synchronized (this) {
            if (mTimer != null) {
                mLogger.info(" - timer is already exists. returns.");
                return;
            }

            mTimer = new Timer("Heartbeat timer");

            final int periodInSeconds = Globals.getHeartbeatDelayInSeconds();
            final int periodInMillis = periodInSeconds * 1000;
            final LocalDateTime lastTickDateTime = Globals.getLastTickDateTime();
            final LocalDateTime nextTickDateTime = (lastTickDateTime == null) ? null : lastTickDateTime.plusSeconds(periodInSeconds);
            final boolean createForNow = nextTickDateTime == null || nextTickDateTime.isBefore(LocalDateTime.now());
            Date nextTickDate = null;

            if (createForNow)
                mTimer.schedule(new HeartbeatTimerTask(), 1000, periodInMillis);
            else {
                nextTickDate = DateTimeHelper.convert(nextTickDateTime);
                mTimer.schedule(new HeartbeatTimerTask(), nextTickDate, periodInMillis);
            }

            mLogger.info(String.format(" - timer is created (startTime=%s).", createForNow ? "now" : nextTickDate));
        }
    }

    private void dropTimer() {
        mLogger.info("HeartbeatEngine.dropTimer");
        synchronized (this) {
            if (mTimer == null) {
                mLogger.info(" - timer is null. returns.");
                return;
            }

            mTimer.cancel();
            mTimer.purge();

            mTimer = null;
            mLogger.info(" - timer is canceled.");
        }
    }

    private final class HeartbeatTimerTask extends TimerTask {
        @Override
        public void run() {
            Globals.notifyForTick();
        }
    }
}
