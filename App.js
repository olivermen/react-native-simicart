import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import AppRouter from './router/navigation';
import { Root } from 'native-base';
import Spinner from '@base/components/spinner';
import { I18nManager, Platform, DeviceEventEmitter, TouchableOpacity, NativeModules } from 'react-native';
import type { Notification, RemoteMessage, NotificationOpen } from 'react-native-firebase';
import firebase from 'react-native-firebase';
import Connection from '@base/network/Connection';
import AppStorage from '@helper/storage';
import { devices } from '@helper/constants';
import NotificationPopup from '@base/components/notification';
import VersionUpdate from '@base/components/versionUpdate'
import VersionCheck from 'react-native-version-check';
import simicart from '@helper/simicart';
import Device from '@helper/device';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import Geolocation from '@react-native-community/geolocation';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import OneSignal from 'react-native-onesignal';
import * as Sentry from '@sentry/react-native';
import { requestTrackingPermission, getTrackingStatus } from 'react-native-tracking-transparency';

Sentry.init({ 
    dsn: 'https://34a08d6102a64b61a33561d73f59d874@sentry.io/1783442',
    enableNative: false
});

const store = createStore(reducers);

const NativeMethod = Platform.OS === 'ios' ? NativeModules.NativeMethod : NativeModules.NativeMethodModule;

export default class App extends React.Component {
    constructor(props) {
        super(props);
        I18nManager.allowRTL(true);
        I18nManager.swapLeftAndRightInRTL(true);
        I18nManager.forceRTL(I18nManager.isRTL);
        this.router = null;
        this.requestedRegisterDevice = false;

        OneSignal.init("ONESIGNAL");
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
        OneSignal.inFocusDisplaying(0);
    }
    componentDidMount() {
        if (Platform.OS === 'android') {
            DeviceEventEmitter.addListener('type_device_event', e => {
                AppStorage.saveData('type_device', e);
                if (e === 'tablet') {
                    Device.is_android_tablet = true
                } else {
                    Device.is_android_tablet = false
                }
            });
        }

        if (simicart.isDemo == '0') {
            if (Platform.OS === 'android') {
                this.getAppInforAndroid()
            } else {
                this.getAppInforIos()
            }
        }

        setTimeout(
            () => {
                if (Platform.OS === 'ios') {
                    NativeMethod.registerNotification();
                }
                Geolocation.getCurrentPosition(
                    (position) => {
                        Identify.setLocation(position.coords.latitude, position.coords.longitude);
                        AppStorage.getData('notification_token').then((savedToken) => {
                            if (savedToken) {
                                this.requestRegisterDevice(savedToken);
                            }
                        });
                    },
                    (error) => { console.log(error) },
                    { enableHighAccuracy: false, timeout: 50000 },
                );
                this.registerNotificationListener();
            },
            5000
        );

        getTrackingStatus().then(trackingStatus => {
            if (!trackingStatus || trackingStatus === 'not-determined') {
                requestTrackingPermission().then(newTrackingStatus => {
                    if (newTrackingStatus && newTrackingStatus === 'authorized' || newTrackingStatus === 'unavailable') {
                        Identify.enableAppTracking();
                    }
                });
            }
            if (trackingStatus && trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
                Identify.enableAppTracking();
            }
        });
    }

    getAppInforIos() {
        fetch('http://itunes.apple.com/lookup?bundleId=' + simicart.appID)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                let errors = {};
                errors['errors'] = [
                    { message: Identify.__('Network response was not ok') }
                ]
                return errors;
            }).then(data => {
                if (data.errors) {
                    console.log(data.errors)
                } else if (data.results.length > 0 && this.isNeedUpdate(simicart.appVersion, data.results[0].version)) {
                    setTimeout(
                        () => { store.dispatch({ type: 'showUpdate', data: { show: true, urlApp: data.results[0].trackViewUrl } }) }, 7000
                    )
                }
            }).catch(error => {
                console.log(error)
            })
    }
    getAppInforAndroid() {
        VersionCheck.needUpdate()
            .then(async res => {
                if (res && res.isNeeded) {
                    VersionCheck.getPlayStoreUrl().then(url => {
                        setTimeout(
                            () => { store.dispatch({ type: 'showUpdate', data: { show: true, urlApp: url } }) }, 7000
                        )
                    })
                }
            }).catch((error) => {
                console.log(error);
            });
    }
    isNeedUpdate(currentVersion, appVersion) {
        let cVersion = []
        currentVersion.split('.').forEach(number => {
            cVersion.push(parseInt(number, 10))
        })

        let asVersion = []
        appVersion.split('.').forEach(number => {
            asVersion.push(parseInt(number, 10))
        })

        let cVersionDepth = cVersion.length
        let asVersionDepth = asVersion.length

        let depth = 0;
        if (cVersionDepth > asVersionDepth) {
            depth = cVersionDepth
            for (let i = 0; i < (cVersionDepth - asVersionDepth); i++) {
                asVersion.push(0)
            }
        } else {
            depth = asVersionDepth
            for (let i = 0; i < (asVersionDepth - cVersionDepth); i++) {
                cVersion.push(0)
            }
        }

        for (let i = 0; i <= depth; i++) {
            if (cVersion[i] < asVersion[i]) {
                return true
            }
        }
    }

    requestRegisterDevice(token) {
        if (Platform.OS === 'ios') {
            if (Device.isTablet()) {
                platformID = '2';
            } else {
                platformID = '1';
            }
        } else {
            platformID = '3';
        }
        let location = Identify.getLocation();
        if (location) {
            locationParams = {
                latitude: location.lat,
                longitude: location.lng
            }
        }
        Connection.restData();
        Connection.setBodyData({
            device_token: token,
            is_demo: simicart.isDemo,
            plaform_id: platformID,
            app_id: simicart.appID,
            build_version: simicart.appVersion,
            ...locationParams
        });
        Connection.connect(devices, this, 'POST');
    }
    setData(data) {
        if (data.device) {
            AppStorage.saveData('notification_token', data.device.device_token);
        }
    }
    componentWillUnmount() {
        // this.messageListener();
        // this.notificationListener();
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
    }
    render() {
        return (
            <Provider store={store}>
                <Root>
                    <AppRouter />
                    <Spinner />
                    <NotificationPopup />
                    <VersionUpdate />
                </Root>
            </Provider>
        );
    }

    registerNotificationListener() {
        if (Platform.OS === 'ios') {
            let context = this;
            PushNotificationIOS.requestPermissions();
            PushNotificationIOS.addEventListener('register', function (token) {
                if (!this.requestedRegisterDevice) {
                    this.requestedRegisterDevice = true;
                    AppStorage.getData('notification_token').then((savedToken) => {
                        if (!savedToken || (savedToken && token !== savedToken)) {
                            context.requestRegisterDevice(token);
                        }
                    });
                }
            });
        }

        this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
            if (message && message._data && message._data.message) {
                console.log('Message Received');
                console.log(message);
                let data = JSON.parse(message._data.message);
                if (data.show_popup == '1') {
                    store.dispatch({ type: 'showNotification', data: { show: true, data: data } });
                } else {
                    this.pushNotiStatusBar(data);
                }
            }
        });
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
            console.log('Notification Received');
            console.log(notification);
            let data = notification._data;
            if (data.show_popup) {
                store.dispatch({ type: 'showNotification', data: { show: true, data: data } });
            } else {
                this.pushNotiStatusBar(data);
            }
        });
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            const notification: Notification = notificationOpen.notification;
            console.log(notification);
            let data = {};
            if (notification._data || notification._android) {
                if (Platform.OS === 'ios') {
                    data = notification._data;
                } else {
                    data = notification._android._notification._data;
                }
                console.log('Opened Received');
                console.log(data);
                if (data.show_popup == '1') {
                    store.dispatch({ type: 'showNotification', data: { show: true, data: data } });
                } else {
                    this.openNotification(data);
                }
            }

        });

        if (Platform.OS !== 'ios') {
            const channel = new firebase.notifications.Android.Channel(simicart.appID, simicart.appID, firebase.notifications.Android.Importance.Max)
                .setDescription(simicart.appID + ' notification channel');
            firebase.notifications().android.createChannel(channel);
        }
    }

    pushNotiStatusBar(data) {
        const notification = new firebase.notifications.Notification()
            .setNotificationId(Identify.makeid())
            .setTitle(data.title ? data.title : data.notice_title)
            .setBody(data.message ? data.message : data.notice_content)
            .setData(data);
        notification
            .android.setChannelId(simicart.appID)
            .android.setSmallIcon('@drawable/ic_launcher')
            .android.setAutoCancel(true);

        if (data.image_url && data.image_url != null && data.image_url != '') {
            notification
                .android.setLargeIcon(data.image_url)
                .android.setBigPicture(data.image_url);
        }

        firebase.notifications().displayNotification(notification)
    }

    openNotification(notification) {
        let type = notification.type;
        let routeName = ''
        switch (type) {
            case '1':
                routeName = 'ProductDetail';
                params = {
                    productId: notification.productID ? notification.productID : notification.product_id,
                };
                break;
            case '2':
                if (notification.has_child) {
                    routeName = 'Category';
                    params = {
                        categoryId: notification.categoryID ? notification.categoryID : notification.category_id,
                        categoryName: notification.categoryName ? notification.categoryName : notification.category_name,
                    };
                } else {
                    routeName = 'Products';
                    params = {
                        categoryId: notification.categoryID ? notification.categoryID : notification.category_id,
                        categoryName: notification.categoryName ? notification.categoryName : notification.category_name,
                    };
                }
                break;
            case '3':
                routeName = 'WebViewPage';
                params = {
                    uri: notification.url ? notification.url : notification.notice_url,
                };
                break;
            default:
                break;
        }
        if (routeName != '') {
            NavigationManager.openRootPage(null, routeName, params);
        }
    }

    onReceived(notification) {
        console.log("Notification received: ", notification);
        notification['is_onesignal'] = "1";
        store.dispatch({ type: 'showNotification', data: { show: true, data: notification } });
    }

    onOpened(openResult) {
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
        openResult.notification['is_onesignal'] = "1";
        setTimeout(
            () => { store.dispatch({ type: 'showNotification', data: { show: true, data: openResult.notification } }) }, 7000
        )
    }

    onIds(device) {
        console.log('Device info: ', device);
    }
}

TouchableOpacity.defaultProps = {
    activeOpacity: 0.5,
    delayPressIn: 30
}
