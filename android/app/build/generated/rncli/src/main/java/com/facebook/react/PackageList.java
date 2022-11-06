
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

import com.simicart.BuildConfig;
import com.simicart.R;

// @react-native-community/async-storage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// @react-native-community/cookies
import com.reactnativecommunity.cookies.CookieManagerPackage;
// @react-native-community/datetimepicker
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
// @react-native-community/geolocation
import com.reactnativecommunity.geolocation.GeolocationPackage;
// @react-native-community/netinfo
import com.reactnativecommunity.netinfo.NetInfoPackage;
// @react-native-community/toolbar-android
import com.reactnativecommunity.toolbarandroid.ReactToolbarPackage;
// @react-native-google-signin/google-signin
import co.apptailor.googlesignin.RNGoogleSigninPackage;
// @sentry/react-native
import io.sentry.react.RNSentryPackage;
// react-native-awesome-card-io
import com.cardio.RNCardIOPackage;
// react-native-device-info
import com.learnium.RNDeviceInfo.RNDeviceInfo;
// react-native-fbsdk-next
import com.facebook.reactnative.androidsdk.FBSDKPackage;
// react-native-firebase
import io.invertase.firebase.RNFirebasePackage;
// react-native-fs
import com.rnfs.RNFSPackage;
// react-native-image-base64
import fr.snapp.imagebase64.RNImgToBase64Package;
// react-native-image-picker
import com.imagepicker.ImagePickerPackage;
// react-native-maps
import com.airbnb.android.react.maps.MapsPackage;
// react-native-onesignal
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
// react-native-reanimated
import com.swmansion.reanimated.ReanimatedPackage;
// react-native-restart
import com.avishayil.rnrestart.ReactNativeRestartPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-splash-screen
import org.devio.rn.splashscreen.SplashScreenReactPackage;
// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// react-native-version-check
import io.xogus.reactnative.versioncheck.RNVersionCheckPackage;
// react-native-webview
import com.reactnativecommunity.webview.RNCWebViewPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  public PackageList(ReactNativeHost reactNativeHost) {
    this.reactNativeHost = reactNativeHost;
  }

  public PackageList(Application application) {
    this.reactNativeHost = null;
    this.application = application;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      new AsyncStoragePackage(),
      new CookieManagerPackage(),
      new RNDateTimePickerPackage(),
      new GeolocationPackage(),
      new NetInfoPackage(),
      new ReactToolbarPackage(),
      new RNGoogleSigninPackage(),
      new RNSentryPackage(),
      new RNCardIOPackage(),
      new RNDeviceInfo(),
      new FBSDKPackage(),
      new RNFirebasePackage(),
      new RNFSPackage(),
      new RNImgToBase64Package(),
      new ImagePickerPackage(),
      new MapsPackage(),
      new ReactNativeOneSignalPackage(),
      new ReanimatedPackage(),
      new ReactNativeRestartPackage(),
      new RNScreensPackage(),
      new SplashScreenReactPackage(),
      new VectorIconsPackage(),
      new RNVersionCheckPackage(),
      new RNCWebViewPackage()
    ));
  }
}
