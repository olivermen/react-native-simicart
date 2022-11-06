import React from 'react';
import WebViewPayment from '@base/components/payment/webview';
import SimiPageComponent from "@base/components/SimiPageComponent";

export default class WebViewPaymentPage extends SimiPageComponent {

    constructor(props) {
        super(props);
    }

    onSuccess() {
        return false;
    }

    onFail() {
        return false;
    }

    onError() {
        return false;
    }

    onReview() {
        return false;
    }

    addMorePropsToWebView() {
        return {};
    }

    renderPhoneLayout() {
        return (
            <WebViewPayment parent={this}
                navigation={this.props.navigation}
                onRef={ref => (this.webView = ref)}
                {...this.addMorePropsToWebView()} />
        );
    }

}
