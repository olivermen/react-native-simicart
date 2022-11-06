import React from 'react';
import { connect } from 'react-redux';
import Connection from '@base/network/Connection';
import NewConnection from '@base/network/NewConnection';
import { storeviews, devices, quoteitems, customer_login } from '@helper/constants';
import Identify from '@helper/Identify';
import { NativeModules, Platform } from 'react-native';
import AppStorage from '@helper/storage';
import firebase from 'react-native-firebase';
import simicart from '@helper/simicart';
import { I18nManager } from 'react-native';
import RNRestart from 'react-native-restart';
import Device from '@helper/device';

const nativeMethod = Platform.OS === 'ios' ? null : NativeModules.NativeMethodModule;

class Settings extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        let api = storeviews;
        AppStorage.getData('store_id').then((storeID) => {
            if (storeID) {
                api = api + '/' + storeID;
            } else {
                api = api + '/default';
            }

            AppStorage.getData('currency_code').then((currencyCode) => {
                let params = {};
                if (currencyCode) {
                    params = {
                        currency: currencyCode
                    };
                }
                new NewConnection()
                    .init(api, 'get_merchant_config', this)
                    .addGetData(params)
                    .connect();
            });
        });
    }
    setData(data, requestID) {
        if (requestID == 'get_merchant_config') {
            this.storeViewData = data;
            if (data.storeview.hasOwnProperty('base') && data.storeview.base.hasOwnProperty('locale_identifier')) {
                Identify.locale_identifier = data.storeview.base.locale_identifier;
            }
            AppStorage.getData('appIsRtl').then(res => {
                if (res === undefined && data.storeview.hasOwnProperty('base')) {
                    let isRTL = '';
                    if (data.storeview.base.is_rtl == 1) {
                        isRTL = 'yes';
                    } else {
                        isRTL = 'no';
                    }
                    AppStorage.saveData('appIsRtl', isRTL).then(() => {
                        if (isRTL == 'yes') {
                            I18nManager.forceRTL(true)
                            RNRestart.Restart()
                        }
                    })
                }
            })
            Connection.setMerchantConfig(data);  // For old customization
            Identify.setMerchantConfig(data);

            AppStorage.saveData('store_id', data.storeview.base.store_id);
            AppStorage.saveData('currency_code', data.storeview.base.currency_code);

            if (Platform.OS !== 'ios' && data.storeview.base.android_sender) {
                this.registerToken(data.storeview.base.android_sender);
            }
            this.props.storeData('merchant_configs', data);
        } else {
            AppStorage.saveData('notification_token', data.device.device_token);
        }
    }

    handleWhenRequestFail(url, requestID) {
        if (url == customer_login) {
            AppStorage.removeAutologinInfo();
            this.props.storeData('merchant_configs', this.storeViewData);
        }
    }

    registerToken(senderID) {
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    this.requestRegisterDevice(senderID);
                } else {
                    // user doesn't have permission
                    firebase.messaging().requestPermission()
                        .then(() => {
                            this.requestRegisterDevice(senderID);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            });
    }

    async requestRegisterDevice(senderID) {
        if (Platform.OS !== 'ios') {
            let platformID = undefined;
            let locationParams = {};
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
            let token = await nativeMethod.createNotificationToken(senderID);
            AppStorage.getData('notification_token').then((savedToken) => {
                if (!savedToken || (savedToken && token !== savedToken)) {
                    new NewConnection()
                        .init(devices, 'register_device', this, 'POST')
                        .addBodyData({
                            device_token: token,
                            is_demo: simicart.isDemo,
                            plaform_id: platformID,
                            app_id: simicart.appID,
                            build_version: simicart.appVersion,
                            ...locationParams
                        })
                        .connect();
                }
            });
        }
    }
    render() {
        return (null);
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

// export default Settings;
