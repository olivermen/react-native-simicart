import React from 'react';
import { connect } from 'react-redux';
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify';
import { StackActions } from 'react-navigation';
import { products_mode } from '@helper/constants';
import { Accordion, Header, View, Text } from "native-base";
import Device from '@helper/device';
import { Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import Item from './item';
import Redriect from './redriect';
import Events from '@helper/config/events';

let height = Dimensions.get('window').height / 2;

class Zara extends React.Component {
    tracking(paramAction) {
        let params = { ...paramAction };
        params['event'] = 'home_action';
        Events.dispatchEventAction(params, this);
    }
    renderZaraImage(data, keyUrl) {
        let url = data[keyUrl];
        if (!url) {
            return null;
        }
        let aspectRatio = data.width / data.height;
        if (!aspectRatio) {
            aspectRatio = 2;
        }
        if (Device.isTablet()) {
            url = data[keyUrl + '_tablet'];
            aspectRatio = data.width_tablet / data.height_tablet;
        }
        return (
            <Image
                style={{ width: '100%', aspectRatio: aspectRatio }}
                source={{ uri: url }}
                resizeMode="stretch" />
        );
    }

    renderHeader(item, expanded) {
        if (expanded === true) {
            setTimeout(() => {
                if (this.props.parent.scrollView) {
                    this.props.parent.scrollView.scrollTo({ x: 0, y: height, animated: true })
                }
            }, 200);
        }
        if (item.simicategory_id) {
            return this.renderZaraImage(item, 'simicategory_filename');
        } else if (item.productlist_id) {
            return this.renderZaraImage(item, 'list_image');
        } else {
            return this.renderZaraImage(item, 'banner_name');
        }
    }

    renderContentWithChildren(data) {
        return (
            <FlatList
                ref={r => this.flatlist = r}
                data={data}
                keyExtractor={(item) => item.entity_id}
                renderItem={({ item, index }) =>
                    <Item item={item} />
                } />
        )
    }

    directToOtherPage(item) {
        let routeName = '';
        let params = {};
        if (item.banner_id) {
            let obj = this.renderBannerParams(item);
            routeName = obj.routeName;
            params = obj.params;
        } else {
            let cat_name = item.cat_name
            let id = item.category_id
            routeName = 'Products';
            if (id) {
                params = {
                    categoryId: id,
                    categoryName: cat_name,
                };
                trackingParams = {
                    action: 'selected_category',
                    category_id: id
                }
            } else {
                params = {
                    spotId: item.productlist_id,
                    'mode': products_mode.spot,
                };
                trackingParams = {
                    action: 'selected_product_list',
                    product_list_id: item.productlist_id
                }
            }
            this.tracking(trackingParams);
        }
        return <Redriect navigation={this.props.navigation} routeName={routeName} params={params} />;
    }

    renderBannerParams(item) {
        let data = {};
        data['event'] = 'home_action';
        data['action'] = 'selected_banner';
        data['banner_title'] = item.banner_title;
        data['banner_id'] = item.banner_id;
        let type = item.type;
        switch (type) {
            case '1':
                routeName = 'ProductDetail';
                params = {
                    productId: item.product_id,
                };
                data['banner_type'] = 'product';
                data['product_id'] = item.product_id;
                break;
            case '2':
                if (item.has_children) {
                    routeName = 'Category';
                    params = {
                        categoryId: item.category_id,
                        categoryName: item.cat_name,
                    };
                } else {
                    routeName = 'Products';
                    params = {
                        categoryId: item.category_id,
                        categoryName: item.cat_name,
                    };
                }
                data['banner_type'] = 'category';
                data['category_id'] = item.category_id;
                break;
            case '3':
                routeName = 'WebViewPage';
                params = {
                    uri: item.banner_url,
                };
                data['banner_type'] = 'web';
                break;
            default:
                break;
        }
        Events.dispatchEventAction(data, this);
        return { routeName, params };
    }

    renderContent(item) {
        if (item.has_children && item.simicategory_id) {
            return this.renderContentWithChildren(item.children)
        } else {
            return this.directToOtherPage(item)
        }
    }

    render() {
        let banners = this.props.data.home.homebanners.homebanners;
        banners.sort(function (a, b) {
            return parseInt(a.sort_order) - parseInt(b.sort_order);
        });

        let categories = this.props.data.home.homecategories.homecategories;
        categories.sort(function (a, b) {
            return parseInt(a.sort_order) - parseInt(b.sort_order);
        });

        let products = this.props.data.home.homeproductlists.homeproductlists;
        products.sort(function (a, b) {
            return parseInt(a.sort_order) - parseInt(b.sort_order);
        });

        let all_items = banners.concat(categories.concat(products));
        let allCategories = <Accordion
            dataArray={all_items}
            renderHeader={this.renderHeader.bind(this)}
            renderContent={this.renderContent.bind(this)}
        />
        return (
            <View>
                {allCategories}
            </View>
        )
    }
}
const mapStateToProps = (state) => {
    return { data: state.redux_data.home_data };
}
export default connect(mapStateToProps)(Zara);
