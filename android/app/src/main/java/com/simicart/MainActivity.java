package com.simicart;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import org.devio.rn.splashscreen.SplashScreen;
import android.content.res.Configuration;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "SimiCart";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
//       SplashScreen.show(this);
        super.onCreate(savedInstanceState);

        final String type_device = this.getString(R.string.type_device);
        final ReactInstanceManager reactInstanceManager = getReactNativeHost().getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
        if (reactContext != null) {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("type_device_event", type_device);
        } else {
            reactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                @Override
                public void onReactContextInitialized(ReactContext context) {
                    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("type_device_event", type_device);
                    reactInstanceManager.removeReactInstanceEventListener(this);
                }
            });
        }
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }

    @Override
    public void onResume() {
        super.onResume();
        ReactContext reactContext = getReactInstanceManager().getCurrentReactContext();
        WritableMap params = Arguments.createMap();
        params.putString("event", "active");

        // when app starts reactContext will be null initially until bridge between Native and React Native is established
        if(reactContext != null) {
            getReactInstanceManager().getCurrentReactContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("ActivityStateChange", params);
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        ReactContext reactContext = getReactInstanceManager().getCurrentReactContext();
        WritableMap params = Arguments.createMap();
        params.putString("event", "inactive");

        if(reactContext != null) {
            getReactInstanceManager().getCurrentReactContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("ActivityStateChange", params);
        }
    }

    @Override
    public void onStop() {
        super.onStop();
        ReactContext reactContext = getReactInstanceManager().getCurrentReactContext();
        WritableMap params = Arguments.createMap();
        params.putString("event", "background");

        if(reactContext != null) {
            getReactInstanceManager().getCurrentReactContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("ActivityStateChange", params);
        }
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
