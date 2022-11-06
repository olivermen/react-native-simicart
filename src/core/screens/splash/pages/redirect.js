import React from 'react';
import NavigationManager from '@helper/NavigationManager';
import { Linking } from 'react-native';
import Events from '@helper/config/events';
import Identify from '@helper/Identify';
import firebase from 'react-native-firebase';
import { View } from 'react-native';
import md5 from 'md5';
import SplashScreen from 'react-native-splash-screen'
import SimiCart from '@helper/simicart';
import NewConnection from '@base/network/NewConnection';

export default class Redirect extends React.Component {

    constructor(props) {
        super(props);
        this.isWebApp = (Identify.appConfig.app_settings && Identify.appConfig.app_settings.web_app && Identify.appConfig.app_settings.web_app == '1') ? true : false;
        this.isProcessingLink = false;
    }

    requestGetDataFromURL(url) {
        if (this.isWebApp) {
            this.openHome(url);
        } else {
            this.isProcessingLink = true;
            new NewConnection()
                .init('simiconnector/rest/v2/deeplinks', 'get_deeplink_data', this)
                .addGetData({
                    url: url
                })
                .connect();
        }
    }

    setData(data) {
        this.isProcessingLink = false;
        if (data) {
            let type = data.deeplink.type;
            switch (type) {
                case '1':
                    this.processOpenCategory(data.deeplink);
                    break;
                case '2':
                    this.processOpenProduct(data.deeplink);
                    break;
                default:
                    break;
            }
        }
    }

    handleWhenRequestFail(url) {
        this.isProcessingLink = false;
    }

    processOpenCategory(data) {
        if (data.has_child == '1') {
            routeName = 'Category';
            params = {
                categoryId: data.id,
                categoryName: data.name
            };
        } else {
            routeName = 'Products';
            params = {
                categoryId: data.id,
                categoryName: data.name
            };
        }
        NavigationManager.openPage(this.props.navigation, routeName, params);
        setTimeout(() => {
            SplashScreen.hide();
        }, 1000);
    }

    processOpenProduct(data) {
        NavigationManager.openPage(this.props.navigation, 'ProductDetail', {
            productId: data.id
        });
        setTimeout(() => {
            SplashScreen.hide();
        }, 1000);
    }

    componentWillMount() {
        if (!Identify.isRunInitDeepLink) {
            Identify.isRunInitDeepLink = true;
            Linking.getInitialURL().then((url) => {
                this.processAppLinkUrl(url);
            }).catch(err => {
                console.log('App link error occurred: ' + err);
            });
        }
    }

    processAppLinkUrl(url) {
        if (url && url.startsWith('http') && !url.includes('page.link')) {
            if (!this.dispatchProcessAppLink(url, this.props.navigation)) {
                this.requestGetDataFromURL(url);
            }
        } else {
            firebase.links()
                .getInitialLink()
                .then((url) => {
                    if (url) {
                        this.requestGetDataFromURL(url);
                    }
                });
        }
    }

    dispatchProcessAppLink(link, navigation) {
        let processed = false;
        for (let i = 0; i < Events.events.app_link.length; i++) {
            let node = Events.events.app_link[i];
            if (node.active === true) {
                let action = node.action;
                processed = action.processAppLink(link, navigation);
            }
        }
        return processed;
    }

    dispatchAddRequests() {
        let plugins = [];
        for (let i = 0; i < Events.events.splash_requests.length; i++) {
            let node = Events.events.splash_requests[i];
            if (node.active === true) {
                let key = md5("splash_requests" + i);
                let Content = node.content;
                plugins.push(<Content obj={this} key={key} />);
            }
        }
        return plugins;
    }

    openHome(url = SimiCart.merchant_url) {
        if (Identify.appConfig.app_settings && Identify.appConfig.app_settings.web_app && Identify.appConfig.app_settings.web_app == '1') {
            NavigationManager.openRootPage(this.props.navigation, 'WebAppPage', {
                uri: url
            });
        } else {
            NavigationManager.openRootPage(this.props.navigation, 'Home');
        }
        setTimeout(() => {
            SplashScreen.hide();
        }, 1000);
    }

    componentDidMount() {
        this.openHome();
        Linking.addEventListener('url', (event) => {
            if (Identify.isOpenShareFB) {
                Identify.saveIsOpenShareFB(false);
            } else {
                if (!this.isProcessingLink) {
                    this.processAppLinkUrl(event.url);
                }
            }
        });
    }
    componentWillUnmount() {
        // Linking.removeEventListener('url', this._handleOpenURL);
    }

    render() {
        return (
            <View>
                {this.dispatchAddRequests()}
            </View>
        );
    }
}
