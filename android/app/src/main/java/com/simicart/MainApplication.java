package com.simicart;

import android.app.Application;

import com.facebook.react.PackageList;

import com.crashlytics.android.core.CrashlyticsCore;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.react.BuildConfig;
import com.facebook.react.ReactApplication;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.rnfs.RNFSPackage;
import fr.snapp.imagebase64.RNImgToBase64Package;
import com.imagepicker.ImagePickerPackage;
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnativecommunity.cookies.CookieManagerPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import com.cardio.RNCardIOPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import io.sentry.react.RNSentryPackage;

import java.util.List;

import com.crashlytics.android.Crashlytics;

import io.fabric.sdk.android.Fabric;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.simicart.wraper.NativeMethodPackage;
import com.reactnativecommunity.cookies.CookieManagerPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;

import co.apptailor.googlesignin.RNGoogleSigninPackage;;


public class MainApplication extends Application implements ReactApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            @SuppressWarnings("UnnecessaryLocalVariable")
            List<ReactPackage> packages = new PackageList(this).getPackages();
            packages.add(new NativeMethodPackage());
            packages.add(new RNFirebaseMessagingPackage());
            packages.add(new RNFirebaseNotificationsPackage());
            packages.add(new RNFirebaseAnalyticsPackage());

            return packages;
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Crashlytics crashlyticsKit = new Crashlytics.Builder()
                .core(new CrashlyticsCore.Builder().disabled(com.crashlytics.android.BuildConfig.DEBUG).build())
                .build();
        // Fabric.with(this, crashlyticsKit);
        FacebookSdk.sdkInitialize(this);
        SoLoader.init(this, /* native exopackage */ false);
    }

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }
}
