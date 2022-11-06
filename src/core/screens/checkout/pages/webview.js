import WebViewPayment from '@screens/webview/WebViewPayment';
import Identify from '@helper/Identify';
import simicart from '@helper/simicart';
import { Toast } from 'native-base';
import material from "@theme/variables/material";
import NavigationManager from '@helper/NavigationManager';
import CookieManager from '@react-native-community/cookies';

export default class CheckoutWebView extends WebViewPayment {

    constructor(props) {
        super(props);
        this.checkoutWebView = Identify.getMerchantConfig().storeview.checkout.checkout_webview;
        this.quoteId = this.props.navigation.getParam('quote_id');
        this.isRight = false;
        this.isPaymentWebview = true;
        this.params = Identify.getCheckoutParams('simiconnector/checkout', this.quoteId);
        CookieManager.clearAll(true)
            .then((res) => {
                console.log('CookieManager.clearAll =>', res);
            });
    }

    backAction() {
        if(this.webView) {
            this.webView.onBackPress();
            return true;
        }
        return false;
    }

    onSuccess() {
        Toast.show({
            text: Identify.__('Thank you for your purchase'),
            type: 'success',
            duration: 3000, textStyle: { fontFamily: material.fontFamily }
        });
        NavigationManager.backToRootPage(this.props.navigation);
        return true;
    }

    addMorePropsToWebView() {
        let base_url = simicart.merchant_url
        if (Identify.getMerchantConfig().storeview.base.base_url) {
            base_url = Identify.getMerchantConfig().storeview.base.base_url;
        }
        return ({
            url: base_url + '/simiconnector/index/redirect?token=' + this.params.token + '&salt=' + this.params.salt,
            redirectThankyou: '0',
            keySuccess: this.checkoutWebView.success_url,
            messageSuccess: Identify.__('Thank you for your purchase'),
            keyFail: this.checkoutWebView.fail_url,
            messageFail: Identify.__('Payment failed. Please try again'),
            enableCancelOrder: false
        });
    }
}