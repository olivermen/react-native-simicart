import React from 'react';
import NavigationManager from '@helper/NavigationManager';
import { Linking } from 'react-native'
import Identify from '@helper/Identify'

export default class Redirect extends React.Component {
    componentWillMount() {
        if (this.props.routeName === 'WebViewPage' && Identify.getMerchantConfig().storeview.base.open_url_in_app && Identify.getMerchantConfig().storeview.base.open_url_in_app != '1') {
            Linking.openURL(this.props.params.uri);
        }else{
            NavigationManager.openPage(this.props.navigation, this.props.routeName, this.props.params);
        }    }
    render(){
        return null;
    }
}
