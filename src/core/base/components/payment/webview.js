import React from 'react';
import { Container, Toast } from 'native-base';
import { BackHandler, Alert, Platform } from 'react-native';
import { order_history } from '@helper/constants';
import NewConnection from '../../network/NewConnection';
import Identify from '../../../helper/Identify';
import { connect } from 'react-redux';
import material from "@theme/variables/material";
import AppStorage from '@helper/storage';
import { WebView } from 'react-native-webview';
import NavigationManager from '@helper/NavigationManager';
import Events from '@helper/config/events';
class WebViewPayment extends React.Component {

    constructor(props) {
        super(props);
    }

    webView = {
        canGoBack: false,
        ref: null,
    }

    setData(data) {
        this.props.storeData('showLoading', { type: 'none' });
        Toast.show({
            text: Identify.__('Your order has been canceled'),
            type: 'success',
            duration: 3000,
            textStyle: { fontFamily: material.fontFamily }
        });
        NavigationManager.backToRootPage(this.props.navigation);
    }

    onBackPress = () => {
        if (this.webView.canGoBack && this.webView.ref) {
            this.webView.ref.goBack();
        } else if(this.props.enableCancelOrder) {
            Alert.alert(
                Identify.__('Warning'),
                Identify.__('Are you sure you want to cancel this order?'),
                [
                    { text: Identify.__('Cancel'), onPress: () => { style: 'cancel' } },
                    {
                        text: Identify.__('OK'), onPress: () => {
                            if (this.props.orderID) {
                                this.cancelOrder();
                            } else {
                                NavigationManager.backToRootPage(this.props.navigation);
                            }
                        }
                    },
                ],
                { cancelable: true }
            );
        } else {
            NavigationManager.backToRootPage(this.props.navigation);
        }
        return true;
    }

    cancelOrder() {
        this.props.storeData('showLoading', { type: 'dialog' });
        new NewConnection()
            .init(order_history + '/' + this.props.orderID, 'cancel_order', this, 'PUT')
            .addBodyData({ status: 'cancel' })
            .connect();
    }

    componentWillMount() {
        if (this.props.hasOwnProperty('onRef')) {
            this.props.onRef(this);
        }
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        }
    }

    componentWillUnmount() {
        if (this.props.hasOwnProperty('onRef')) {
            this.props.onRef(undefined);
        }
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
        }
    }

    navigateResults(message, type) {
        if (message) {
            Toast.show({
                text: message,
                type: type,
                duration: 3000, textStyle: { fontFamily: material.fontFamily }
            });
        }
        if (type === 'success' && this.props.orderID) {
            let data = {};
            data['event'] = 'checkout_action';
            data['action'] = 'place_order_successful';
            data['total'] = this.props.totals;
            data['order_id'] = this.props.order;
            Events.dispatchEventAction(data, this);

            NavigationManager.clearStackAndOpenPage(this.props.navigation, 'Thankyou', {
                invoice: this.props.orderID,
                mode: this.props.mode,
            });
        } else {
            NavigationManager.backToRootPage(this.props.navigation);
        }
    }

    processUrl(url) {
        if (this.props.keySuccess && url.includes(this.props.keySuccess)) {
            console.log('onSuccess');
            this.webView.ref.stopLoading();
            AppStorage.saveData('quote_id', '');
            if (!Identify.isEmpty(this.props.notification)) {
                this.props.storeData('actions', [
                    { type: 'showNotification', data: { show: true, data: this.props.notification } },
                    { type: 'quoteitems', data: {} }
                ]);
            } else {
                this.props.storeData('quoteitems', {});
            }
            if (!this.props.parent.onSuccess()) {
                this.navigateResults(this.props.messageSuccess, 'success');
            }
        } else if (this.props.keyFail && url.includes(this.props.keyFail)) {
            console.log('onFail');
            this.webView.ref.stopLoading();
            if (!this.props.parent.onFail()) {
                this.navigateResults(this.props.messageFail, 'warning');
            }
        } else if (this.props.keyError && url.includes(this.props.keyError)) {
            console.log('onError');
            this.webView.ref.stopLoading();
            if (!this.props.parent.onError()) {
                this.navigateResults(this.props.messageError, 'danger');
            }
        } else if (this.props.keyReview && url.includes(this.props.keyReview)) {
            console.log('onReview');
            this.webView.ref.stopLoading();
            if (!this.props.parent.onReview()) {
                this.navigateResults(this.props.messageReview, '');
            }
        } else if (this.props.customCondition && this.props.customCondition(url)) {
            console.log('onCustom');
            this.webView.ref.stopLoading();
            this.props.customAction();
        }
    }

    _onNavigationStateChange(webViewState) {
        this.webView.canGoBack = webViewState.canGoBack;
        let url = webViewState.url;
        console.log(url);
        if (this.props.parent) {
            this.processUrl(url);
        }
    }

    render() {
        return (
            <Container>
                <WebView
                    javaScriptEnabled={true}
                    originWhitelist={['*']}
                    source={{ uri: this.props.url }}
                    style={{ flex: 1 }}
                    startInLoadingState={this.props.showLoading ?? true}
                    ref={(webView) => { this.webView.ref = webView; }}
                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                    injectedJavaScript={this.props.injectedJavaScript} />
            </Container>
        );
    }
}

WebViewPayment.defaultProps = {
    enableCancelOrder: true
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};
export default connect(null, mapDispatchToProps)(WebViewPayment);
