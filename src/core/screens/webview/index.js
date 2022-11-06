import React from 'react';
import { BackHandler } from 'react-native';
import { Container } from 'native-base';
import Identify from '../../helper/Identify';
import SimiPageComponent from "../../base/components/SimiPageComponent";
import variable from '@theme/variables/material';
import { WebView } from 'react-native-webview';

const injectedJs = `
    document.querySelector('.bottom-menus-wrapper').style.display='none';
    document.querySelector('.header-app-phone').style.display='none';
    document.querySelector('.simi-cookie-sdk').style.display='none';
    document.querySelector('.footer-container').style.display='none';
    document.querySelector('.bottom-footer').style.display='none';
`;

class WebViewPage extends SimiPageComponent {
    constructor(props) {
        super(props);
    }

    webView = {
        canGoBack: false,
        ref: null,
    }

    onBackPress = () => {
        if (this.webView.canGoBack && this.webView.ref) {
            this.webView.ref.goBack();
            return true;
        }
        return false;
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    renderPhoneLayout() {
        return (
            <Container style={{ backgroundColor: variable.appBackground, overflow: 'hidden' }}>
                <WebView
                    javaScriptEnabled={true}
                    originWhitelist={['*']}
                    source={this.createSource()}
                    style={{ flex: 1 }}
                    startInLoadingState={true}
                    // injectedJavaScript={injectedJs}
                    javaScriptEnabledAndroid={true}
                    ref={(webView) => { this.webView.ref = webView; }}
                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                />
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

    createSource() {
        let source = {};
        if (this.props.navigation.getParam("uri")) {
            source['uri'] = this.props.navigation.getParam("uri");
            // source['headers'] = {Authorization: 'Bearer ' + Identify.getSimiCartConfig()['']};
        } else {
            source['html'] = this.props.navigation.getParam("html")
            source['baseUrl'] = Identify.getSimiCartConfig()['merchant_url'];
        }
        return source;
    }

}

export default WebViewPage;
