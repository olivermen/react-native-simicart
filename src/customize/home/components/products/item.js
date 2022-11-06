import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Text } from "native-base";
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import Identify from '@helper/Identify';
import material from "@theme/variables/material";
import NewConnection from '@base/network/NewConnection';
import NavigationManager from '@helper/NavigationManager';
import Price from '../../../catalog/components/product/price';
import { products_mode, home_spot_products } from '@helper/constants';

class Item extends React.Component {

    componentDidMount() {
        if (this.isDataEmpty()) {
            this.requestData();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!this.isDataEmpty()) {
            return false;
        }
        return true;
    }

    isDataEmpty() {
        if (this.props.homeProductlists && this.props.homeProductlists.hasOwnProperty(this.props.productlist_id)) {
            return false;
        }
        return true;
    }

    requestData() {
        let params = {
            limit: 8,
            offset: 0
        };
        new NewConnection()
            .init(home_spot_products + '/' + this.props.productlist_id, 'get_homeproductlist_data', this)
            .addGetData(params)
            .connect();
    }

    setData(data) {
        this.processData(data);
    }

    processData(data) {
        let homeproductlists = data.homeproductlist;
        let dataForSave = {};
        dataForSave[homeproductlists.productlist_id] = homeproductlists.product_array;
        this.props.storeData('add_home_spot_data', dataForSave);
    }

    openProduct(item) {
        NavigationManager.openPage(this.props.navigation, 'ProductDetail', {
            productId: item.entity_id,
            objData: item
        });
    }

    checkTypeIdAndPrice(item) {
        if (item.type_id === 'configurable' && item.app_prices && item.app_prices.price == 0) {
            return false;
        }
        return true;
    }

    renderProducts(data) {
        return data.map(item => {
            if (item.entity_id == 'view_all') {
                return (
                    <TouchableOpacity
                        key={item.entity_id}
                        style={{ backgroundColor: 'white', borderRadius: 16, flex: 1, flexDirection: 'row', marginHorizontal: 5, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => {
                            let params = {
                                categoryName: this.props.title,
                                categoryId: this.props.item.category_id
                            };
                            NavigationManager.openPage(this.props.navigation, 'Products', params);
                        }}>
                        <Text style={{ fontSize: 28, color: '#E4531A', marginRight: 15, fontFamily: material.fontBold }}>{Identify.__('View All')}</Text>
                        <Image source={require('../../../icon/icon_next.png')} style={{ width: 30, height: 23, transform: Identify.isRtl() ? [{ rotate: '180deg' }] : undefined }} />
                    </TouchableOpacity>
                );
            }
            return (
                <View
                    key={item.entity_id}
                    style={{ backgroundColor: 'white', borderRadius: 16, flex: 1, flexDirection: 'row', marginHorizontal: 5 }}>
                    <Image
                        source={{ uri: item.special_offer_image ?? item.images[0].url }}
                        style={{ height: '100%', width: '33%', borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }} />
                    <View style={{ padding: 10, flex: 1 }}>
                        <Text style={{ fontSize: 16, fontFamily: material.fontBold, marginBottom: 10 }} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
                        {this.checkTypeIdAndPrice(item) && <Price
                            type={item.type_id}
                            prices={item.app_prices}
                            navigation={this.props.navigation}
                            styleOneRowPrice={{ flexDirection: 'column' }}
                            styleSpecialPrice={{ fontFamily: material.fontBold }}
                            stylePrice={{ fontFamily: material.fontBold }}
                            stylePriceLine={{ color: '#747474', fontSize: 13, textDecorationLine: 'line-through' }}
                        />}
                        <TouchableOpacity
                            style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => this.openProduct(item)}>
                            <Text style={{ fontSize: 16, color: '#E4531A', marginRight: 8 }}>{Identify.__('View More')}</Text>
                            <Image source={require('../../../icon/icon_next.png')} style={{ width: 20, height: 13, transform: Identify.isRtl() ? [{ rotate: '180deg' }] : undefined }} />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        })
    }

    render() {
        let data = this.props.homeProductlists[this.props.productlist_id];
        if (!this.isDataEmpty()) {
            let productItems = [];
            if (this.props.item.featured_product_id) {
                featuredProduct = data.products.find(item => {
                    if (item.entity_id == this.props.item.featured_product_id) {
                        return item;
                    }
                });
            }
            if (!featuredProduct) {
                featuredProduct = data.products[0];
            }
            productItems.push(featuredProduct);
            data.products.forEach(element => {
                if (element.entity_id != featuredProduct.entity_id) {
                    productItems.push(element);
                }
            });
            productItems.push({
                entity_id: 'view_all'
            });
            return (
                <View style={{ backgroundColor: '#E6E6E6', paddingHorizontal: 15, paddingVertical: 40 }}>
                    <Text style={{ fontSize: 20, fontFamily: material.fontBold, textAlign: 'center', marginBottom: 24, letterSpacing: 1.67 }}>{Identify.__(this.props.title)}</Text>
                    <View style={{ width: '100%', aspectRatio: 336 / 215 }}>
                        <Swiper
                            horizontal={true}
                            showsButtons
                            showsPagination={false}
                            nextButton={
                                <View style={[styles.swiperButton, { right: -18 }]}>
                                    <Image source={require('../../../icon/ic_arrow_right.png')} style={{ width: 15, height: 15, transform: Identify.isRtl() ? [{ rotate: '180deg' }] : undefined }} />
                                </View>
                            }
                            prevButton={
                                <View style={[styles.swiperButton, { left: -18 }]}>
                                    <Image source={require('../../../icon/ic_arrow_right.png')} style={{ width: 15, height: 15, transform: Identify.isRtl() ? undefined : [{ rotate: '180deg' }] }} />
                                </View>
                            }>
                            {this.renderProducts(productItems)}
                        </Swiper>
                    </View>
                </View>
            );
        } else {
            return null;
        }
    }
}
Item.defaultProps = {
    item: null
}

const styles = StyleSheet.create({
    swiperButton: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        backgroundColor: 'white',
        width: 32,
        height: 32,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    }
});

const mapStateToProps = (state) => {
    return {
        homeProductlists: state.redux_data.home_spot_data
    };
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Item);