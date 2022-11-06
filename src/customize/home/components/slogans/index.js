import React from 'react';
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify';
import { Image, Dimensions, TouchableOpacity } from 'react-native';
import { Text, H3 } from 'native-base';
import { connect } from 'react-redux';
import Events from '@helper/config/events';
import material from '@theme/variables/material';
import ScaledImage from '../../../base/components/ScaledImage';
import NewConnection from '@base/network/NewConnection';
import SimiCart from '@helper/simicart';

class Slogans extends React.Component {

    constructor(props) {
        super(props);
    }

    requestCheckUrl = (path) => {
        this.props.storeData('showLoading', { type: 'dialog' });
        new NewConnection()
            .init('simiconnector/rest/v2/deeplinks', 'get_deeplink_data', this)
            .addGetData({
                url: SimiCart.pwa_url.slice(0, -1) + path
            })
            .connect();
    }

    setData(data) {
        this.props.storeData('showLoading', { type: 'none' });
        if (data) {
            let type = data.deeplink.type;
            switch (type) {
                case '1':
                    NavigationManager.openPage(this.props.navigation, 'Products', {
                        categoryId: data.deeplink.id,
                        categoryName: data.deeplink.name
                    });
                    break;
                case '2':
                    NavigationManager.openPage(this.props.navigation, 'ProductDetail', {
                        productId: data.deeplink.id
                    });
                    break;
                default:
                    NavigationManager.openPage(this.props.navigation, 'WebViewPage', {
                        uri: data.deeplink.full_url
                    });
                    break;
            }
        }
    }

    render() {
        if (!this.props.slogan || Identify.isEmpty(this.props.slogan)) {
            return null;
        } else {
            return Object.keys(this.props.slogan).map(key => {
                const item = this.props.slogan[key];
                return (
                    <TouchableOpacity
                        key={key}
                        onPress={() => this.requestCheckUrl(item.target_link)}>
                        <ScaledImage
                            uri={item.mobile_image}
                            width={Dimensions.get('window').width - 24}
                            style={{ marginTop: 20, marginHorizontal: 12 }} />
                    </TouchableOpacity>
                );
            });
        }
    }
}

const mapStateToProps = (state) => {
    return { slogan: state.redux_data.home_data.home.slogan };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Slogans);
