package com.simicart.wraper;

import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.appindexing.Action;
import com.google.firebase.appindexing.FirebaseAppIndex;
import com.google.firebase.appindexing.FirebaseUserActions;
import com.google.firebase.appindexing.Indexable;
import com.google.firebase.appindexing.builders.Actions;
import com.google.firebase.appindexing.builders.Indexables;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.messaging.FirebaseMessaging;
// import me.leolin.shortcutbadger.ShortcutBadger;

import java.io.IOException;

public class NativeMethodModule extends ReactContextBaseJavaModule {
	ReactApplicationContext reactContext;

    public NativeMethodModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "NativeMethodModule";
    }

    @ReactMethod
    void createNotificationToken(String senderID, Promise promise) {
        new DeviceTokenAsync(senderID, promise).execute();
    }

    // @ReactMethod
    // void setBadge(int count) {
    //     ShortcutBadger.applyCount(this.reactContext, count);
    // }

    @ReactMethod
    void openSetting() {
        final Intent i = new Intent();
        i.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        i.addCategory(Intent.CATEGORY_DEFAULT);
        i.setData(Uri.parse("package:" + getReactApplicationContext().getPackageName()));
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        i.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
        i.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
        getReactApplicationContext().startActivity(i);
    }

    @ReactMethod
    void getDeviceID(Promise p) {
        p.resolve(Settings.Secure.getString(this.reactContext.getContentResolver(), Settings.Secure.ANDROID_ID));
    }

    @ReactMethod
    protected void startLog(String productName, String productSeoURL) {
        index(productName, productSeoURL);
        if(productSeoURL != null) {
            FirebaseUserActions.getInstance().start(getViewProductAction(productName, productSeoURL));
        }
    }

    @ReactMethod
    protected void endLog(String productName, String productSeoURL) {
        if(productSeoURL != null) {
            FirebaseUserActions.getInstance().end(getViewProductAction(productName, productSeoURL));
        }
    }

    public class DeviceTokenAsync extends AsyncTask<Void, Void, Void> {

        protected String senderID;
        protected Promise mPromise;

        public DeviceTokenAsync(String senderID, Promise promise) {
            this.senderID = senderID;
            mPromise = promise;
        }

        @Override
        protected Void doInBackground(Void... voids) {
            try {
                String notificationToken = FirebaseInstanceId.getInstance().getToken(senderID,
                        FirebaseMessaging.INSTANCE_ID_SCOPE);

                WritableMap map = Arguments.createMap();
                map.putString("token", notificationToken);
                mPromise.resolve(notificationToken);
            } catch (IOException e) {
                e.printStackTrace();
            }
            return null;
        }

        @Override
        protected void onPostExecute(Void voids) {

        }
    }

    protected void index(String productName, final String productSeoURL) {
        if(productSeoURL != null) {
            Log.e("SimiAppIndexing", "index ------------ SEO_URL " + productSeoURL);
            Indexable node = Indexables.newSimple(productName, productSeoURL);
            Task<Void> task = FirebaseAppIndex.getInstance().update(node);

            task.addOnSuccessListener(new OnSuccessListener<Void>() {
                @Override
                public void onSuccess(Void aVoid) {
                    Log.e("SimiAppIndexing", "App Indexing added "
                            + productSeoURL);
                }
            });

            task.addOnFailureListener(new OnFailureListener() {
                @Override
                public void onFailure(Exception exception) {
                    Log.e("SimiAppIndexing", "App Indexing failed to add " +
                            exception.getMessage());
                }
            });
        }

    }

    protected Action getViewProductAction(String productName, String productSeoURL) {
        return Actions.newView(productName, productSeoURL);
    }

}
