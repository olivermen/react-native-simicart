import React from 'react';
import { connect } from 'react-redux';
import SimiPageComponent from '@base/components/SimiPageComponent';
import { Container, Toast, View } from 'native-base';
import { Platform, ScrollView } from 'react-native';
import { customer_login, quoteitems, address_book_mode, devices } from '@helper/constants';
import AppStorage from '@helper/storage';
import Connection from '@base/network/Connection';
import NewConnection from '@base/network/NewConnection';
import NavigationManager from '@helper/NavigationManager';
import simicart from '@helper/simicart';
import Device from '@helper/device';
import Identify from '@helper/Identify';
import Events from '@helper/config/events';
import SplashScreen from 'react-native-splash-screen'
import material from "@theme/variables/material";

class LoginPage extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            enableSignIn: this.props.navigation.getParam('email') ? true : false,
            rememberMeEnable: false
        };
        this.isCheckout = this.props.navigation.getParam('isCheckout') ? this.props.navigation.getParam('isCheckout') : false;
        this.callback = this.props.navigation.getParam('callback') ? this.props.navigation.getParam('callback') : undefined;
        this.customerData = null;
        this.loginData = {};

        this.dispatchSplashCompleted();
    }

    dispatchSplashCompleted() {
        if (Identify.getMerchantConfig().storeview.base.force_login && Identify.getMerchantConfig().storeview.base.force_login == '1') {
            this.isRight = false;
            this.isBack = false;
            this.isMenu = false;
        }

        for (let i = 0; i < Events.events.splash_completed.length; i++) {
            let node = Events.events.splash_completed[i];
            if (node.force_login && node.force_login === true) {
                this.isRight = false;
                this.isBack = false;
                this.isMenu = false;
            }
        }
    }

    componentDidMount() {
        super.componentDidMount();
        setTimeout(() => {
            SplashScreen.hide();
        }, 1000);
    }

    startLogin = () => {
        try {
            AppStorage.removeAllSavedInfo();
            Connection.setCustomer(null);
            Identify.setCustomerParams(null);
            this.loginData = this.form.getLoginData();
            this.props.storeData('showLoading', { type: 'dialog' });
            new NewConnection()
                .init(customer_login, 'customer_login', this)
                .addGetData(this.loginData)
                .connect();
        } catch (e) {
            console.log(e.message);
        }
    }

    setData(data, requestID) {
        if (requestID == 'customer_login') {
            this.props.clearData();
            this.customerData = data;
            this.saveCustomerData();
            this.getQuoteItems();
            this.tracking();
            AppStorage.saveData('quote_id', '');
        } else if (requestID == 'get_quoteitems') {
            if (!this.isCheckout) {
                let welcomeMessage = this.generateWelcomeMessage(this.customerData.customer);
                Toast.show({ text: welcomeMessage, duration: 3000, textStyle: { fontFamily: material.fontFamily } })
            }
            this.props.storeData('actions', [
                { type: 'showLoading', data: { type: 'none' } },
                { type: 'customer_data', data: this.customerData.customer },
                { type: 'quoteitems', data: data }
            ]);
            this.registerDeviceWithEmail();
            this.navigate();
        }
    }

    generateWelcomeMessage = (data) => {
        let message = Identify.__('Welcome %@ %@ Start shopping now');
        return message.replace("%@ %@", data.firstname + ' ' + data.lastname);
    };

    getQuoteItems() {
        new NewConnection()
            .init(quoteitems, 'get_quoteitems', this)
            .connect();
    }

    saveCustomerData() {
        try {
            Identify.setCustomerData(this.customerData.customer);
            let dataCustomer = null;
            // if (this.customerData.customer.simi_hash && this.customerData.customer.simi_hash != '') {
            //     dataCustomer = {
            //         email: this.loginData.email,
            //         simi_hash: this.customerData.customer.simi_hash
            //     }
            // } else {
            dataCustomer = this.loginData;
            // }
            Connection.setCustomer(dataCustomer);   // For old customization
            Identify.setCustomerParams(dataCustomer);
            AppStorage.saveCustomerAutoLoginInfo(this.loginData);
            if (this.state.rememberMeEnable === true) {
                AppStorage.saveRemembermeLoginInfo(this.loginData);
            }
        } catch (error) {
            // Error saving data
        }
    }

    registerDeviceWithEmail() {
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
        AppStorage.getData('notification_token').then((savedToken) => {
            if (savedToken) {
                new NewConnection()
                    .init(devices, 'register_device', this, 'POST')
                    .addBodyData({
                        device_token: savedToken,
                        is_demo: simicart.isDemo,
                        plaform_id: platformID,
                        app_id: simicart.appID,
                        build_version: simicart.appVersion,
                        user_email: this.loginData.email,
                        ...locationParams
                    })
                    .connect();
            }
        });
    }

    navigate = () => {
        if(this.callback) {
            this.callback();
        } else if (this.isCheckout) {
            NavigationManager.backToPreviousPage(this.props.navigation);
            NavigationManager.openPage(this.props.navigation, 'AddressBook', {
                isCheckout: true,
                mode: address_book_mode.checkout.select
            });
        } else {
            NavigationManager.backToRootPage(this.props.navigation);
        }
    }

    updateButtonStatus(status) {
        if (status != this.state.enableSignIn) {
            this.setState({ enableSignIn: status });
        }
    }

    createRef(id) {
        switch (id) {
            case 'default_login_form':
                return ref => (this.form = ref);
            default:
                return undefined;
        }
    }

    addMorePropsToComponent(element) {
        return {
            onRef: this.createRef(element.id)
        };
    }

    renderPhoneLayout() {
        return (
            <Container style={{ backgroundColor: material.appBackground }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ paddingTop: 35, paddingBottom: 35, paddingLeft: 15, paddingRight: 15 }}>
                        {this.renderLayoutFromConfig('login_layout', 'content')}
                    </View>
                </ScrollView>
            </Container>
        );
    }

    tracking() {
        let data = {};
        data['event'] = 'login_action';
        data['action'] = 'login_success';
        data['method'] = 'normal';
        Events.dispatchEventAction(data, this);
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.customer_data };
}

//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        },
        clearData: () => {
            dispatch({ type: 'clear_all_data', data: null })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);