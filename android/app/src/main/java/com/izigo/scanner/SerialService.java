package com.izigo.scanner;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Binder;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.izigo.MainActivity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.ArrayDeque;

public class SerialService extends Service implements SerialListener {

    class SerialBinder extends Binder {
        SerialService getService() { return SerialService.this; }
    }
    private static final Logger logger = LoggerFactory.getLogger(MainActivity.class);

    private enum QueueType {Connect, ConnectError, Read, IoError}

    private static class QueueItem {
        QueueType type;
        ArrayDeque<byte[]> datas;
        Exception e;

        QueueItem(QueueType type) { this.type=type; if(type==QueueType.Read) init(); }
        QueueItem(QueueType type, Exception e) { this.type=type; this.e=e; }
        QueueItem(QueueType type, ArrayDeque<byte[]> datas) { this.type=type; this.datas=datas; }

        void init() { datas = new ArrayDeque<>(); }
        void add(byte[] data) { datas.add(data); }
    }

    private final Handler mainLooper;
    private final IBinder binder;
    private final ArrayDeque<QueueItem> queue1, queue2;
    private final QueueItem lastRead;

    private SerialSocket socket;
    private SerialListener listener;
    private boolean connected;

    public SerialService() {
        mainLooper = new Handler(Looper.getMainLooper());
        this.binder = new SerialBinder();
        this.queue1 = new ArrayDeque<>();
        this.queue2 = new ArrayDeque<>();
        lastRead = new QueueItem(QueueType.Read);
    }

    @Override
    public void onDestroy() {
        cancelNotification();
        disconnect();
        super.onDestroy();
    }

    public void connect(SerialSocket socket) throws IOException {
        socket.connect(this);
        this.socket = socket;
        this.connected = true;
    }

    public void disconnect() {
        this.connected = false; // ignore data,errors while disconnecting
        cancelNotification();
        if(this.socket != null) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    public void attach(SerialListener listener) {
        if(Looper.getMainLooper().getThread() != Thread.currentThread())
            throw new IllegalArgumentException("not in main thread");
        cancelNotification();
        // use synchronized() to prevent new items in queue2
        // new items will not be added to queue1 because mainLooper.post and attach() run in main thread
        synchronized (this) {
            this.listener = listener;
        }
        for(QueueItem item : this.queue1) {
            switch(item.type) {
                case Connect:       listener.onSerialConnect      (); break;
                case ConnectError:  listener.onSerialConnectError (item.e); break;
                case Read:          listener.onSerialRead         (item.datas); break;
                case IoError:       listener.onSerialIoError      (item.e); break;
            }
        }
        for(QueueItem item : this.queue2) {
            switch(item.type) {
                case Connect:       listener.onSerialConnect      (); break;
                case ConnectError:  listener.onSerialConnectError (item.e); break;
                case Read:          listener.onSerialRead         (item.datas); break;
                case IoError:       listener.onSerialIoError      (item.e); break;
            }
        }
        this.queue1.clear();
        this.queue2.clear();
    }

    public void detach() {
        if(this.connected)
            createNotification();
        // items already in event queue (posted before detach() to mainLooper) will end up in queue1
        // items occurring later, will be moved directly to queue2
        // detach() and mainLooper.post run in the main thread, so all items are caught
        this.listener = null;
    }

    private void createNotification() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel nc = new NotificationChannel(Constants.NOTIFICATION_CHANNEL, "Background service", NotificationManager.IMPORTANCE_LOW);
            nc.setShowBadge(false);
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            logger.info("SerialService::");
            nm.createNotificationChannel(nc);
        }
        Intent restartIntent = new Intent()
                .setClassName(this, Constants.INTENT_CLASS_MAIN_ACTIVITY)
                .setAction(Intent.ACTION_MAIN)
                .addCategory(Intent.CATEGORY_LAUNCHER);
        int flags = Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_MUTABLE : 0;
        PendingIntent restartPendingIntent = PendingIntent.getActivity(this, 1, restartIntent,  flags);
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, Constants.NOTIFICATION_CHANNEL)
                .setContentIntent(restartPendingIntent)
                .setOngoing(true);
        // @drawable/ic_notification created with Android Studio -> New -> Image Asset using @color/colorPrimaryDark as background color
        // Android < API 21 does not support vectorDrawables in notifications, so both drawables used here, are created as .png instead of .xml
        Notification notification = builder.build();
        logger.info("SerialService::");
        startForeground(Constants.NOTIFY_MANAGER_START_FOREGROUND_SERVICE, notification);
    }

    private void cancelNotification() {
        stopForeground(true);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) { return binder; }

    @Override
    public void onSerialConnect() {
        logger.info("SerialService::");
        if(this.connected) {
            logger.info("this.connected");
            synchronized (this) {
                if (this.listener != null) {
                    logger.info("this.listener != null");
                    this.mainLooper.post(() -> {
                        if (this.listener != null) {
                            logger.info("this.listener != null");
                            this.listener.onSerialConnect();
                        } else {
                            logger.info("this.queue1.add(new QueueItem(QueueType.Connect))");
                            this.queue1.add(new QueueItem(QueueType.Connect));
                        }
                    });
                } else {
                    logger.info("new QueueItem(QueueType.Connect)");
                    this.queue2.add(new QueueItem(QueueType.Connect));
                }
            }
        }
    }

    @Override
    public void onSerialConnectError(Exception e) {
        if(this.connected) {
            synchronized (this) {
                if (this.listener != null) {
                    this.mainLooper.post(() -> {
                        if (this.listener != null) {
                            this.listener.onSerialConnectError(e);
                        } else {
                            this.queue1.add(new QueueItem(QueueType.ConnectError, e));
                            disconnect();
                        }
                    });
                } else {
                    this.queue2.add(new QueueItem(QueueType.ConnectError, e));
                    disconnect();
                }
            }
        }
    }

    @Override
    public void onSerialRead(ArrayDeque<byte[]> datas) {
        throw new UnsupportedOperationException();
    }

    /**
     * reduce number of UI updates by merging data chunks.
     * Data can arrive at hundred chunks per second, but the UI can only
     * perform a dozen updates if receiveText already contains much text.
     *
     * On new data inform UI thread once (1).
     * While not consumed (2), add more data (3).
     */
    @Override
    public void onSerialRead(byte[] data) {
        if(this.connected) {
            synchronized (this) {
                if (this.listener != null) {
                    boolean first;
                    synchronized (this.lastRead) {
                        first = this.lastRead.datas.isEmpty(); // (1)
                        this.lastRead.add(data); // (3)
                    }
                    if(first) {
                        this.mainLooper.post(() -> {
                            ArrayDeque<byte[]> datas;
                            synchronized (this.lastRead) {
                                datas = this.lastRead.datas;
                                this.lastRead.init(); // (2)
                            }
                            if (this.listener != null) {
                                this.listener.onSerialRead(datas);
                            } else {
                                this.queue1.add(new QueueItem(QueueType.Read, datas));
                            }
                        });
                    }
                } else {
                    if(this.queue2.isEmpty() || this.queue2.getLast().type != QueueType.Read)
                        this.queue2.add(new QueueItem(QueueType.Read));
                    this.queue2.getLast().add(data);
                }
            }
        }
    }

    @Override
    public void onSerialIoError(Exception e) {
        if(this.connected) {
            synchronized (this) {
                if (this.listener != null) {
                    this.mainLooper.post(() -> {
                        if (this.listener != null) {
                            this.listener.onSerialIoError(e);
                        } else {
                            this.queue1.add(new QueueItem(QueueType.IoError, e));
                            disconnect();
                        }
                    });
                } else {
                    this.queue2.add(new QueueItem(QueueType.IoError, e));
                    disconnect();
                }
            }
        }
    }
}
