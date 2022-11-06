import WebViewPayment from '@screens/webview/WebViewPayment';
import { order_history } from '@helper/constants';
import NewConnection from '@base/network/NewConnection';
import { Toast } from 'native-base';
import material from "@theme/variables/material";
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';

export default class CustomPayment extends WebViewPayment {

    constructor(props) {
        super(props);
        this.payment = this.props.navigation.getParam('payment');
        this.orderInfo = this.props.navigation.getParam('orderInfo');
        this.customPayment = this.props.navigation.getParam('customPayment');
        this.mode = this.props.navigation.getParam('mode');
        this.isRight = false;
        this.isPaymentWebview = true;
    }

    setData(data) {
        this.showLoading('showLoading', { type: 'none' });
        Toast.show({
            text: Identify.__('Your order has been canceled'),
            type: 'success',
            duration: 3000,
            textStyle: { fontFamily: material.fontFamily }
        });
        NavigationManager.backToRootPage(this.props.navigation);
    }

    cancelOrder() {
        this.showLoading('showLoading', { type: 'dialog' });
        new NewConnection()
            .init(order_history + '/' + this.orderInfo.invoice_number, 'cancel_order', this, 'PUT')
            .addBodyData({ status: 'cancel' })
            .connect();
    }

    addMorePropsToWebView() {
        return ({
            notification: this.orderInfo.notification,
            url: this.orderInfo.url_action,
            orderID: this.orderInfo.invoice_number,
            mode: this.mode,
            keySuccess: this.customPayment.url_success,
            messageSuccess: this.customPayment.message_success,
            keyFail: this.customPayment.url_fail,
            messageFail: this.customPayment.message_fail,
            keyError: this.customPayment.url_error,
            messageError: this.customPayment.message_error,
            keyReview: this.customPayment.url_cancel,
            messageReview: this.customPayment.message_cancel,
        });
    }
}