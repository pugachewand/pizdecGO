package com.izigo.smartsaleterminal.paymentService;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.PromiseImpl;
import com.izigo.MainActivity;
import com.izigo.utils.DateTimeHelper;
import com.izigo.utils.MemoryHelper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.Timer;
import java.util.TimerTask;

public class ReconciliationOfTotalsEngine implements IReconciliationOfTotalsEngine {
    private boolean mInitialized;
    private static final int TASK_STATUS_LIFETIME_IN_SECONDS = 1 * 60; // 1 minute
    private static final int PROCEDURE_LIFE_PULSE_TIMEOUT_IN_SECONDS = 2 * 60; // 2 minutes

    private final int WAITING_FOR_NEXT_ROT_ATTEMPT_PERIOD_IN_SECONDS = 20; // 20 seconds
    private final int WAITING_ROT_ATTEMPT_COUNT = 15;
    private final LocalDateTime mTimeOfStart;
    private final long mPeriod;
    private final int mRepeatOnErrorCount;
    private final String createLog;

    private Timer mStartTimer = null;
    private Timer mFinishTimer = null;
    private Timer mWaitingTimer = null;

    private int mBeginningAttempt = 0;
    private static final Logger logger = LoggerFactory.getLogger(MainActivity.class);

    private TaskStatusContainer mTaskStatus = new TaskStatusContainer(TaskStatus.Idle);
    private IReconciliationOfTotalsEngineCallbackHandler mCallbackHandler = null;

    private ReconciliationOfTotalsEngine(
            LocalDateTime timeOfStart, long period,
            int repeatOnErrorCount, String logText
            ) {
        mInitialized = false;
        mTimeOfStart = timeOfStart;
        mPeriod = period;
        mRepeatOnErrorCount = repeatOnErrorCount;
        createLog = logText;
    }

    public static IReconciliationOfTotalsEngine create(
            String timeOfStart, int periodInMinutes, String lastTimeOfRun,
            int repeatOnErrorCount
    ) {
        StringBuilder sb = new StringBuilder(String.format(
                "RotEngine::create (timeOfStart: %s, periodInMinutes: %d, lastTimeOfRun: %s)",
                timeOfStart, periodInMinutes, lastTimeOfRun));
        logger.info("");
        LocalDateTime localTimeOfStart = DateTimeHelper.parse(timeOfStart);
        LocalDateTime localLastTimeOfRun = lastTimeOfRun != null
            ? DateTimeHelper.parse(lastTimeOfRun) : null;

        sb.append(System.lineSeparator());
        sb.append(String.format(" - parsed values (timeOfStart: %s, lastTimeOfRun: %s)",
                localTimeOfStart, localLastTimeOfRun));

        long periodMilliseconds = periodInMinutes * 60L * 1000L;

        LocalDateTime now = LocalDateTime.now();

        LocalDateTime startTime;

        sb.append(System.lineSeparator());

        if (now.isBefore(localTimeOfStart)) {
            startTime = localTimeOfStart;
            sb.append(String.format(" - Now (%s) before than timeOfStart (%s). StartTime = timeOfStart.",
                    now, localTimeOfStart));
        } else {
            if (localLastTimeOfRun == null || localLastTimeOfRun.isBefore(localTimeOfStart)) {
                startTime = localTimeOfStart;
                sb.append(String.format(" - lastTimeOfRun (%s) is null or before than timeOfStart (%s). StartTime = timeOfStart.",
                        localLastTimeOfRun, localTimeOfStart));
            } else {
                startTime = calculateStartTime(localTimeOfStart, localLastTimeOfRun, periodMilliseconds * 1000L * 1000L);
                sb.append(String.format(" - lastTimeOfRun (%s) after than timeOfStart (%s). StartTime is calculated to %s.",
                        localLastTimeOfRun, localTimeOfStart, startTime));
            }
        }

        return new ReconciliationOfTotalsEngine(
                startTime, periodMilliseconds,
                repeatOnErrorCount, sb.toString()
        );
    }

    public void destroy() {
        dropStartingTimer();
        dropWaitingTimer();
        dropFinishTimer();
        logger.info("");
        setTaskStatus(TaskStatus.Idle);
    }

    private static LocalDateTime calculateStartTime(LocalDateTime timeOfStart, LocalDateTime lastTimeOfRun, long periodNanos) {
        LocalDateTime newTimeOfStart = timeOfStart;

        while (newTimeOfStart.isBefore(lastTimeOfRun)) {
            newTimeOfStart = newTimeOfStart.plusNanos(periodNanos);
        }

        return newTimeOfStart;
    }

    @Override
    public void initialize(@NonNull IReconciliationOfTotalsEngineCallbackHandler callbackHandler) {
        if (mInitialized) {
            sendProgress(createLog);
            sendProgress(String.format("RotEngine::initialize (instance: %s). ALREADY initialized.",
                    MemoryHelper.getAddress(this)));
            return;
        }

        mInitialized = true;
        mCallbackHandler = callbackHandler;
        sendProgress(createLog);
        sendProgress(String.format("RotEngine::initialize (instance: %s). Start at: %s, period: %d ms",
                MemoryHelper.getAddress(this), mTimeOfStart.toString(), mPeriod));

        dropStartingTimer();
        setStartingTimer();
    }

    private void setStartingTimer() {
        mStartTimer = new Timer("Starting timer");
        mStartTimer.scheduleAtFixedRate(
                new ReconciliationStartTask(this),
                DateTimeHelper.convert(mTimeOfStart),
                mPeriod
        );
    }

    private void dropStartingTimer() {
        if (mStartTimer != null) {
            mStartTimer.cancel();
            mStartTimer.purge();
            mStartTimer = null;
        }
    }

    @Override
    public void letsBegin(boolean run) {
        sendProgress(String.format("RotEngine::letsBegin(%s)", run));
        if (getTaskStatus() != TaskStatus.Started) {
            sendProgress(String.format("RotEngine::letsBegin failed because task status = %s", getTaskStatus()));
            return;
        }

        if (run) {
            setTaskStatus(TaskStatus.LetsRun);
            doLaunchReconciliationRequest();
        } else {
            setTaskStatus(TaskStatus.Waiting);
            setWaitingTimer(new WaitingForBeginTask(this), WAITING_FOR_NEXT_ROT_ATTEMPT_PERIOD_IN_SECONDS);
        }
    }

    private void sendProgress(String value) {
        if (mCallbackHandler != null)
          mCallbackHandler.onProgress(value);
    }

    private void raiseOnBegin() {
        sendProgress("RotEngine::raiseOnBegin");
        mCallbackHandler.onBegin();
    }

    private void raiseOnEnd(boolean result, String data) {
        sendProgress(String.format("RotEngine::raiseOnEnd(%s, %s)", result, data));
        mCallbackHandler.onEnd(result, data);
    }

    private TaskStatus getTaskStatus() {
        return mTaskStatus.getStatus();
    }

    private boolean isTaskStatusExpired() {
        return mTaskStatus.isExpired(TASK_STATUS_LIFETIME_IN_SECONDS);
    }

    private boolean isTaskFrozen() {
        boolean expired = isTaskStatusExpired();
        boolean result = mTaskStatus.getStatus() != TaskStatus.Idle && expired;

        sendProgress(String.format("RotEngine::isTaskFrozen = %s (status: %s, time: %s, now: %s",
                result, mTaskStatus.getStatus(), mTaskStatus.mChangedAt, LocalDateTime.now()));

        return result;
    }

    private void setTaskStatus(TaskStatus value) {
        mTaskStatus.setStatus(value);
        sendProgress(String.format("~RotEngine::setTaskStatus(%s)", value));
    }

    private void setFinishTimer() {
        sendProgress("RotEngine::setFinishTimer");
        dropFinishTimer();

        sendProgress("RotEngine::setFinishTimer create and schedule");
        mFinishTimer = new Timer("Finishing timer");
        mFinishTimer.schedule(
                new ReconciliationFinishTask(this),
                PROCEDURE_LIFE_PULSE_TIMEOUT_IN_SECONDS * 1000L
        );
    }

    private void dropFinishTimer() {
        if (mFinishTimer == null)
            return;

        mFinishTimer.cancel();
        mFinishTimer.purge();
        mFinishTimer = null;
    }

    private void setWaitingTimer(@NonNull TimerTask waitingTask, int delayInSeconds) {
        sendProgress(String.format("RotEngine::setWaitingTimer(%s, %d)", waitingTask, delayInSeconds));
        dropWaitingTimer();

        mWaitingTimer = new Timer("Waiting timer");
        mWaitingTimer.schedule(waitingTask, delayInSeconds * 1000L);
    }

    private void dropWaitingTimer() {
        if (mWaitingTimer == null)
            return;

        mWaitingTimer.cancel();
        mWaitingTimer.purge();
        mWaitingTimer = null;
    }

    private void doStartProcedure() {
        sendProgress("RotEngine::doStartProcedure enter");

        try {
            if (getTaskStatus() != TaskStatus.Idle && !isTaskStatusExpired()) {
                sendProgress("RotEngine::doStartProcedure - Procedure starting is interrupted because task status is not Idle and not expired!");
                return;
            }

            mBeginningAttempt = 1;
            setTaskStatus(TaskStatus.Started);
            raiseOnBegin();
            setFinishTimer();
        } finally {
            sendProgress("RotEngine::doStartProcedure leave");
        }
    }

    private void doFinishProcedure() {
        sendProgress("RotEngine::doFinishProcedure enter");
        logger.info("");
        try {
            if (isTaskFrozen()) {
                sendProgress("RotEngine::doFinishProcedure - task is frozen");
                setTaskStatus(TaskStatus.Idle);
                raiseOnEnd(false, null);
            } else {
                if (getTaskStatus() != TaskStatus.Idle) {
                    sendProgress("RotEngine::doFinishProcedure recreate finish timer needed");
                    new Thread(() -> {
                        try {
                            Thread.sleep(500);
                            sendProgress("RotEngine::doFinishProcedure run thread to recreate finish timer");
                            setFinishTimer();
                        } catch (InterruptedException e) {
                            sendProgress("RotEngine::doFinishProcedure recreate thread interrupted");
                            Thread.currentThread().interrupt();
                        }
                    }).start();
                }
            }
        } finally {
            sendProgress("RotEngine::doFinishProcedure leave");
        }
    }

    private void doBeginNextAttempt() {
        sendProgress("RotEngine::doBeginNextAttempt enter");

        try {
            if (getTaskStatus() != TaskStatus.Waiting) {
                sendProgress(String.format("RotEngine::doBeginNextAttempt failed because task status %s", getTaskStatus()));
                return;
            }

            mBeginningAttempt++;
            if (mBeginningAttempt > WAITING_ROT_ATTEMPT_COUNT) {
                sendProgress("RotEngine::doBeginNextAttempt attempts count limit is reached");
                setTaskStatus(TaskStatus.Idle);
                dropFinishTimer();
                return;
            }

            sendProgress(String.format("RotEngine::doBeginNextAttempt attempt %d of %d", mBeginningAttempt, WAITING_ROT_ATTEMPT_COUNT));
            setTaskStatus(TaskStatus.Started);
            raiseOnBegin();
            setFinishTimer();
        } finally {
            sendProgress("RotEngine::doBeginNextAttempt leave");
        }
    }

    private void doLaunchReconciliationRequest() {
        setTaskStatus(TaskStatus.Running);
        sendProgress(String.format("RotEngine::doLaunchReconciliationRequest"));
        Promise promise = new PromiseImpl(new LaunchSucceeded(this), new LaunchFailed(this));
        mCallbackHandler.onMakeReconciliationRequest(promise);
    }

    private void doProcessLaunchSucceeded(Object object) {
        sendProgress("RotEngine::doProcessLaunchSucceeded");
        setTaskStatus(TaskStatus.Idle);
        dropFinishTimer();
        raiseOnEnd(true, String.valueOf(object));
    }

    private void doProcessLaunchFailed(Object object) {
        sendProgress("RotEngine::doProcessLaunchFailed");
        setTaskStatus(TaskStatus.Idle);
        dropFinishTimer();
        raiseOnEnd(false, String.valueOf(object));
    }

    private class LaunchSucceeded implements Callback {
        @NonNull
        private final ReconciliationOfTotalsEngine mEngine;

        public LaunchSucceeded(@NonNull ReconciliationOfTotalsEngine engine) {
            mEngine = engine;
        }

        @Override
        public void invoke(Object... objects) {
            mEngine.doProcessLaunchSucceeded(objects[0]);
        }
    }

    private class LaunchFailed implements Callback {
        @NonNull
        private final ReconciliationOfTotalsEngine mEngine;

        public LaunchFailed(@NonNull ReconciliationOfTotalsEngine engine) {
            mEngine = engine;
        }

        @Override
        public void invoke(Object... objects) {
            mEngine.doProcessLaunchFailed(objects[0]);
        }
    }

    private class ReconciliationStartTask extends TimerTask {
        private final ReconciliationOfTotalsEngine mEngine;

        public ReconciliationStartTask(@NonNull ReconciliationOfTotalsEngine engine) {
            mEngine = engine;
        }

        @Override
        public void run() {
            mEngine.sendProgress("Timer RotEngine::ReconciliationStartTask started.");

            try {
                mEngine.doStartProcedure();
            } finally {
                mEngine.sendProgress("Timer RotEngine::ReconciliationStartTask finished.");
            }
        }
    }

    private class ReconciliationFinishTask extends TimerTask {
        @NonNull
        private final ReconciliationOfTotalsEngine mEngine;

        public ReconciliationFinishTask(@NonNull ReconciliationOfTotalsEngine engine) {
            mEngine = engine;
        }

        @Override
        public void run() {
            mEngine.sendProgress("Timer RotEngine::ReconciliationFinishTask started.");

            try {
                mEngine.doFinishProcedure();
            } finally {
                mEngine.sendProgress("Timer RotEngine::ReconciliationFinishTask finished.");
            }
        }
    }

    private class WaitingForBeginTask extends TimerTask {
        @NonNull
        private final ReconciliationOfTotalsEngine mEngine;

        public WaitingForBeginTask(@NonNull ReconciliationOfTotalsEngine engine) {
            mEngine = engine;
        }

        @Override
        public void run() {
            mEngine.sendProgress("Timer RotEngine::WaitingForBeginTask started.");

            try {
                mEngine.doBeginNextAttempt();
            } finally {
                mEngine.sendProgress("Timer RotEngine::WaitingForBeginTask finished.");
            }
        }
    }

    private enum TaskStatus {
        // свободное состояние
        Idle,
        // таймер сработал и запустил задачу
        Started,
        // задача ожидает разрешения на запуск сверки
        Waiting,
        // задача ожидает разрешения на запуск сверки
        LetsRun,
        // сверка итогов запущена
        Running
    }

    private class TaskStatusContainer {
        private TaskStatus mStatus;
        private LocalDateTime mChangedAt;

        public TaskStatusContainer(TaskStatus initValue) {
            setStatus(initValue);
        }

        public void setStatus(TaskStatus value) {
            mStatus = value;
            mChangedAt = LocalDateTime.now();
        }

        public TaskStatus getStatus() {
            return mStatus;
        }

        public boolean isExpired(int lifetimePeriodInSeconds) {
            return mChangedAt.plusSeconds(lifetimePeriodInSeconds).isBefore(LocalDateTime.now());
        }
    }
}
