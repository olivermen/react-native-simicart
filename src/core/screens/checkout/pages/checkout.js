import React from 'react';
import SimiPageComponent from "@base/components/SimiPageComponent";
import NewConnection from "@base/network/NewConnection";
import { connect } from 'react-redux';
import { View, Keyboard, ScrollView, findNodeHandle, Alert, Platform } from 'react-native'
import { Container, Toast } from 'native-base';
import { onepage } from '@helper/constants';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import Events from '@helper/config/events';
import AppStorage from '@helper/storage';
import { checkout_mode } from '@helper/constants';
import material from '@theme/variables/material';

class Checkout extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state
        };
        this.isFirstRequest = true;
        this.isPlace = false;
        this.mode = this.props.navigation.getParam('mode');
        this.shippingAddressParams = this.props.navigation.getParam('shippingAddressParams');
        this.billingAddressParams = this.props.navigation.getParam('billingAddressParams');
        this.list = null;
        this.totals = null;
        this.selectedPayment = null;
        this.isRight = false;
        this.onSaveShippingAddress = this.onSaveShippingAddress.bind(this);
        this.onSaveBillingAddress = this.onSaveBillingAddress.bind(this);
        this.handleWhenRequestFail.bind(this);
        this.acceptTerm = false;
        if (this.mode == checkout_mode.new_customer) {
            let loginData = {};
            loginData['email'] = this.shippingAddressParams.email;
            loginData['password'] = this.shippingAddressParams.customer_password;
            AppStorage.saveCustomerAutoLoginInfo(loginData);
            AppStorage.saveRemembermeLoginInfo(loginData);
        }
    }

    componentWillMount() {
        if (this.props.showLoading.type === 'none') {
            this.props.storeData('showLoading', { type: 'full' });
        }
    }
    onSaveAddress(isInitRequest = false) {
        this.onSaveMethod({
            b_address: this.billingAddressParams,
            s_address: this.shippingAddressParams
        }, isInitRequest);
    }
    onSaveShippingAddress(shippingParams) {
        this.shippingAddressParams = shippingParams;
        if (this.mode == checkout_mode.new_customer) {
            this.shippingAddressParams['email'] = this.billingAddressParams.email;
            this.shippingAddressParams['customer_password'] = this.billingAddressParams.customer_password;
            this.shippingAddressParams['confirm_password'] = this.billingAddressParams.confirm_password;
        }
        this.onSaveAddress();
    }
    onSaveBillingAddress(billingParams) {
        this.billingAddressParams = billingParams;
        this.onSaveAddress();
    }
    onSaveMethod(bodyData, isInitRequest = false) {
        if (!isInitRequest) {
            this.props.storeData('showLoading', { type: 'dialog' });
            if (Identify.TRUE(Identify.getMerchantConfig().storeview.checkout.enable_address_params)) {
                bodyData = {
                    ...bodyData,
                    b_address: this.billingAddressParams,
                    s_address: this.shippingAddressParams
                }
            }
        }

        newConnection = new NewConnection();
        newConnection.init(onepage, 'save_onepage', this, 'PUT');
        newConnection.addBodyData(bodyData);
        newConnection.connect();
    }

    isCanPlaceOrder() {
        let isShippingSelected = false;
        let isPaymentSelected = false;
        if (this.props.data.order.shipping == 0 && !this.props.data.order.shipping_address) {
            isShippingSelected = true;
        } else {
            this.props.data.order.shipping.forEach(element => {
                if (element.s_method_selected) {
                    isShippingSelected = true;
                }
            });
        }
        this.props.data.order.payment.forEach(element => {
            if (element.p_method_selected) {
                isPaymentSelected = true;
            }
        });
        if (!isShippingSelected) {
            Toast.show({
                text: Identify.__('Please select shipping method'),
                type: "danger", textStyle: { fontFamily: material.fontFamily }, duration: 3000
            })
            return false;
        }
        if (!isPaymentSelected) {
            Toast.show({
                text: Identify.__('Please select payment method'),
                type: "danger", textStyle: { fontFamily: material.fontFamily }, duration: 3000
            })
            return false;
        }
        if (!this.acceptTerm) {
            Toast.show({
                text: Identify.__('Please accept term and condition'),
                type: "danger", textStyle: { fontFamily: material.fontFamily }, duration: 3000
            })
            return false;
        }
        return true;
    }
    onPlaceOrder(params = null) {
        if (this.isCanPlaceOrder() && !this.dispatchOnPlaceOrder()) {
            this.isPlace = true;
            this.props.storeData('showLoading', { type: 'dialog' });

            newConnection = new NewConnection();
            newConnection.init(onepage, 'place_order', this, 'POST');
            if (Identify.TRUE(Identify.getMerchantConfig().storeview.checkout.enable_address_params)) {
                params = {
                    ...params,
                    b_address: this.billingAddressParams,
                    s_address: this.shippingAddressParams
                }
            }
            if (params) {
                newConnection.addBodyData(params);
            }
            newConnection.connect();
        }
    }
    componentDidMount() {
        super.componentDidMount();
        this.onSaveAddress(true)
    }
    onPlaceOrderSuccess(order) {
        let data = {};
        data['event'] = 'checkout_action';
        data['action'] = 'place_order_successful';
        data['total'] = this.totals;
        data['order_id'] = order.invoice_number;

        Events.dispatchEventAction(data, this);
        switch (this.selectedPayment.show_type) {
            case 3:
                this.processPaymentWebView(order);
                break;
            default:
                let checkCustomPayment = this.processCustomPayment(order);
                if (!checkCustomPayment) {
                    if (order.hasOwnProperty('notification') && !Identify.isEmpty(order.notification) && Identify.TRUE(order.notification.show_popup)) {
                        this.props.storeData('showNotification', { show: true, data: order.notification });
                        //open home page.
                        NavigationManager.backToRootPage(this.props.navigation);
                        this.props.navigation.goBack(null);
                    } else {
                        AppStorage.saveData('quote_id', '');
                        NavigationManager.clearStackAndOpenPage(this.props.navigation, 'Thankyou', {
                            invoice: order.invoice_number,
                            mode: this.mode,
                        });
                    }
                }
                break;
        }
    }
    processPaymentWebView(order) {
        let selectedPaymentId = this.selectedPayment.payment_method.toUpperCase();
        let routerName = '';
        let params = {
            orderInfo: order,
            payment: this.selectedPayment,
            mode: this.mode,
        };
        for (let i = 0; i < Events.events.payments.length; i++) {
            let node = Events.events.payments[i];
            if (node.active === true && node.payment_method.toUpperCase() === selectedPaymentId) {
                routerName = node.router_name;
            }
        }
        if (routerName === '' && !Identify.isEmpty(this.props.customPayment)) {
            this.props.customPayment.forEach(payment => {
                if (payment.paymentmethod.toUpperCase() === selectedPaymentId) {
                    routerName = 'CustomPayment';
                    params['customPayment'] = payment;
                }
            });
        }
        if (routerName != '') {
            NavigationManager.clearStackAndOpenPage(this.props.navigation, routerName, params);
        } else {
            Toast.show({
                text: Identify.__('Some errors occured. Please try again later'),
                type: "danger", textStyle: { fontFamily: material.fontFamily }, duration: 3000
            })
        }
    }
    handleWhenRequestFail(requestID) {
        this.props.storeData('showLoading', { type: 'none' });
        if (this.isPlace) {
            this.isPlace = false;
        }
        if (this.isFirstRequest) {
            NavigationManager.backToPreviousPage(this.props.navigation);
        }
    }
    setData(data, requestID) {
        if (this.isPlace) {
            this.props.storeData('actions', [
                { type: 'showLoading', data: { type: 'none' } },
                { type: 'quoteitems', data: {} }
            ]);
            if (data.order) {
                this.onPlaceOrderSuccess(data.order);
            } else {
                AppStorage.removeAllSavedInfo();
            }
        } else {
            this.list = this.props.quoteitems.quoteitems;
            this.totals = data.order.total;
            this.props.storeData('actions', [
                { type: 'showLoading', data: { type: 'none' } },
                { type: 'order_review_data', data: data }
            ]);
            this.scrollToSection();
        }
        if (data.message || data.order.message) {
            let messages = data.message ? data.message : data.order.message;
            let message = messages[0];
            Keyboard.dismiss();
            Toast.show({
                text: Identify.__(message),
                duration: 3000, textStyle: { fontFamily: material.fontFamily }
            });
        }
        if (this.isFirstRequest) {
            let data = {};
            data['event'] = 'checkout_action';
            data['action'] = 'init_checkout';
            data['total'] = this.totals;
            Events.dispatchEventAction(data, this);
        }
        this.isPlace = false;
        this.isFirstRequest = false;
    }

    scrollToSection() {
        let scrollToPayment = this.props.navigation.getParam('scroll_to_payment');
        if (scrollToPayment) {
            setTimeout(() => {
                this.payment.scrollToPayment();
            }, 700);
        }
    }

    processCustomPayment(order) {
        let customPayment = false;
        let paymentCustom = null;
        let selectedPaymentId = this.selectedPayment.payment_method.toUpperCase();
        if (!Identify.isEmpty(this.props.customPayment)) {
            this.props.customPayment.forEach(payment => {
                if (payment.paymentmethod.toUpperCase() === selectedPaymentId) {
                    customPayment = true;
                    paymentCustom = payment
                }
            });
        }
        if (customPayment) {
            NavigationManager.clearStackAndOpenPage(this.props.navigation, 'CustomPayment', {
                orderInfo: order,
                payment: this.selectedPayment,
                customPayment: paymentCustom
            });
        }
        return customPayment;
    }

    createRef(id) {
        switch (id) {
            case 'default_payment':
                return ref => (this.payment = ref);
            case 'default_shipping':
                return ref => (this.shipping = ref);
            default:
                return undefined;
        }
    }

    addMorePropsToComponent(element) {
        return {
            title: element.title_content ? element.title_content : '',
            from: 'checkout',
            onRef: this.createRef(element.id),
        };
    }

    shouldRenderLayoutFromConfig() {
        if (!Identify.isEmpty(this.props.data)) {
            return true;
        }
        return false;
    }

    setScrollViewRef = (element) => {
        this.scrollViewRef = element;
    };

    renderPhoneLayout() {
        return (
            <Container style={{ backgroundColor: material.appBackground }}>
                <ScrollView ref={this.setScrollViewRef}>
                    <View style={{ paddingBottom: Platform.OS == 'android' ? 60 : material.isIphoneX ? 190 : 170 }}>
                        {this.renderLayoutFromConfig('checkout_layout', 'content')}
                    </View>
                </ScrollView>
                {this.renderLayoutFromConfig('checkout_layout', 'container')}
            </Container>
        );
    }

    dispatchOnPlaceOrder() {
        for (let i = 0; i < Events.events.on_place_order.length; i++) {
            let node = Events.events.on_place_order[i];
            if (node.active === true) {
                let action = node.action;
                return action.onPlaceOrder(this);
            }
        }
        return false;
    }
}
const mapStateToProps = (state) => {
    return {
        data: state.redux_data.order_review_data,
        quoteitems: state.redux_data.quoteitems,
        customPayment: state.redux_data.customPayment,
        showLoading: state.redux_data.showLoading,
        customer_data: state.redux_data.customer_data,
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
// export default Checkout;
