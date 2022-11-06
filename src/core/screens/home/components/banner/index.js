import React from 'react';
import { connect } from 'react-redux';
import { View, Image, TouchableOpacity, Linking } from 'react-native';
import Swiper from 'react-native-swiper';
import { StackActions } from 'react-navigation';
import NavigationManager from '../../../../helper/NavigationManager';
import styles from './styles';
import Events from '@helper/config/events';
import Identify from "../../../../helper/Identify";
import Device from '@helper/device';


class Banner extends React.Component {

    onSelectBanner(banner) {
        let data = {};
        data['event'] = 'home_action';
        data['action'] = 'selected_banner';
        data['banner_title'] = banner.banner_title;
        data['banner_id'] = banner.banner_id;
        let type = banner.type;
        switch (type) {
            case '1':
                routeName = 'ProductDetail';
                params = {
                    productId: banner.product_id,
                };
                data['banner_type'] = 'product';
                data['product_id'] = banner.product_id;
                break;
            case '2':
                if (banner.has_children) {
                    routeName = 'Category';
                    params = {
                        categoryId: banner.category_id,
                        categoryName: banner.cat_name,
                    };
                } else {
                    routeName = 'Products';
                    params = {
                        categoryId: banner.category_id,
                        categoryName: banner.cat_name,
                    };
                }
                data['banner_type'] = 'category';
                data['category_id'] = banner.category_id;
                break;
            case '3':
                routeName = 'WebViewPage';
                params = {
                    uri: banner.banner_url,
                };
                data['banner_type'] = 'web';
                break;
            default:
                break;
        }
        Events.dispatchEventAction(data, this);
        if (routeName === 'WebViewPage' && Identify.getMerchantConfig().storeview.base.open_url_in_app && Identify.getMerchantConfig().storeview.base.open_url_in_app != '1') {
            Linking.openURL(params.uri);
        }else{
            NavigationManager.openPage(this.props.navigation, routeName, params);
        }    
    }
    renderBanner(banner, urlBanner) {
        return (
            <TouchableOpacity key={banner.banner_id} onPress={() => {
                this.onSelectBanner(banner);
            }}>
                <View>
                    <Image source={{ uri: urlBanner }} style={styles.banner} />
                </View>
            </TouchableOpacity>
        )
    }
    getCustomHome = (keyParent) => {
        let custom = Events.events.customize_home;
        for (let i = 0; i < custom.length; i++) {
            let customProps = custom[i];
            for (let key in customProps) {
                if (key == keyParent) {
                    return customProps[keyParent]
                }
            }
        }
    }

    render() {
        let banners = [];

        let bannersData = this.props.data;
        bannersData.sort(function(a, b){
            var keyA = a.sort_order,
                keyB = b.sort_order;
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
        });

        for (let i in bannersData) {
            let banner = this.props.data[i];
            if (!Device.isTablet()) {
                if (banner.banner_name && banner.banner_name != null) {
                    banners.push(
                        this.renderBanner(banner, banner.banner_name)
                    );
                }
            } else {
                if (banner.banner_name_tablet && banner.banner_name_tablet != null) {
                    banners.push(
                        this.renderBanner(banner, banner.banner_name_tablet)
                    );
                }
            }
        }

        if (banners.length > 0) {
            return (
                <View style={styles.banner}>
                    <Swiper height={200} horizontal={true} autoplay autoplayTimeout={5} {...this.getCustomHome('banner')}>
                        {banners}
                    </Swiper>
                </View>
            );
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.home_data.home.homebanners.homebanners };
}
export default connect(mapStateToProps)(Banner);
