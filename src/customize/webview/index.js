import React from 'react';
import { View, BackHandler, ActivityIndicator, Linking, Platform } from 'react-native';
import { Container } from 'native-base';
import Identify from '@helper/Identify';
import { WebView } from 'react-native-webview';
import variable from '@theme/variables/material';
import SimiPageComponent from "@base/components/SimiPageComponent";

class WebViewPage extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.label = this.props.navigation.getParam("label")
        this.state = {
            ...this.state,
            visible: false,
        }
    }

    webView = {
        canGoBack: false,
        ref: null,
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress = () => {
        if (this.webView.canGoBack && this.webView.ref) {
            this.webView.ref.goBack();
            return true;
        }
        return false;
    }

    _onShouldStartLoadWithRequest = request => {
        const currentUrl = decodeURIComponent(request.url);
        if (currentUrl.includes('https://wa.me/9651848848')) {
            let phone = '+9651848848'
            if (Platform.OS === 'android') {
                Linking.canOpenURL('whatsapp://send?text=')
                    .then((supported) => {
                        if (!supported) {
                            Linking.openURL("market://details?id=com.whatsapp");
                        } else {
                            Linking.openURL('http://api.whatsapp.com/send?phone=' + phone);
                        }
                    })
                    .catch((err) => console.error('An error occurred', err));
            } else {
                Linking.canOpenURL('whatsapp://')
                    .then((supported) => {
                        if (!supported) {
                            openURL('https://itunes.apple.com/vn/app/whatsapp-messenger/id1557448796')
                        } else {
                            Linking.openURL('http://api.whatsapp.com/send?phone=' + phone);
                        }
                    })
                    .catch((err) => console.error('An error occurred', err));
            }
            return false
        } else if (currentUrl.includes('tel:+9651848848')) {
            Linking.openURL('tel:+9651848848')
            return false
        } else if (currentUrl.includes('support@cloud9albahar.com')) {
            Linking.openURL('mailto:support@cloud9albahar.com')
            return false
        } else if (currentUrl.includes('http://www.cloud9albahar.com')) {
            Linking.openURL('http://www.cloud9albahar.com')
            return false
        }
        return true
    }

    renderActivityIndicator() {
        return (
            <ActivityIndicator style={{
                flex: 1,
                position: 'absolute',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 'auto',
                marginBottom: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                justifyContent: 'center',
            }} />
        )
    }

    renderPhoneLayout() {
        return (
            <Container style={{ backgroundColor: variable.appBackground, overflow: 'hidden', flex: 1 }}>
                <WebView
                    originWhitelist={['*']}
                    source={this.createSource()}
                    onMessage={(event) => { }}
                    startInLoadingState={true}
                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                    onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest}
                    onLoad={() => this.setState({ visible: false })}
                    onLoadStart={() => this.setState({ visible: true })}
                    ref={r => this.webView.ref = r}
                />
                {this.state.visible ?
                    <View style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: 'white' }}>
                        {this.renderActivityIndicator()}
                    </View>
                    : null}
            </Container>
        );
    }

    _onNavigationStateChange(webViewState) {
        this.webView.canGoBack = webViewState.canGoBack;
        let url = webViewState.url;
        if (this.props.navigation.getParam("stoptask", null)) {
            let stopUrl = this.props.navigation.getParam("stopUrl");
            if (url == stopUrl) {
                this.props.navigation.goBack(null);
            }
        }
    }

    mountParams = (url) => {
        let prefix
        if (url.includes('lang=')) {
            prefix = '&'
        } else {
            prefix = '/?'
        }
        return prefix + 'simi-header-footer=hide'
    }

    createSource() {
        let source = {};
        if (this.props.navigation.getParam("uri")) {
            source['uri'] = this.props.navigation.getParam("uri") + this.mountParams(this.props.navigation.getParam("uri"));
        } else {
            source['html'] = this.props.navigation.getParam("html")
            source['baseUrl'] = Identify.getSimiCartConfig()['merchant_url'];
        }
        return source;
    }
}

export default WebViewPage;