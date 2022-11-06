import React from 'react';
import { TouchableOpacity, Image, View, Dimensions } from 'react-native';
import { Text, Button, Toast } from 'native-base';
import md5 from 'md5';
import { connect } from 'react-redux';
import Device from '@helper/device';
import Price from '../product/price';
import Identify from '@helper/Identify';
import AppStorage from '@helper/storage';
import Events from '@helper/config/events';
import { quoteitems } from '@helper/constants';
import material from '@theme/variables/material';
import RenderHtml from 'react-native-render-html';
import NewConnection from '@base/network/NewConnection';
import NavigationManager from '@helper/NavigationManager';
import SimiComponent from '@base/components/SimiComponent';
import styles from '../../../../core/screens/catalog/components/product/styles';

class VerticalProductItem extends SimiComponent {
    constructor(props) {
        super(props)
        this.storeConfig = Identify.getMerchantConfig().storeview.base;
    }

    renderSpecialPriceLabel() {
        let saleOff = null;
        let price = this.props.product.app_prices;
        if (price.has_special_price !== null && price.has_special_price === 1) {
            if (price.show_ex_in_price != null && price.show_ex_in_price == 1) {
                saleOff = 100 - (price.price_including_tax.price / price.regular_price) * 100;
                saleOff = saleOff.toFixed(0);
            } else {
                saleOff = 100 - (price.price / price.regular_price) * 100;
                saleOff = saleOff.toFixed(0);
            }
        }
        let showLabel = Identify.getMerchantConfig().storeview.catalog.frontend.show_discount_label_in_product;
        if (saleOff) {
            if (showLabel && showLabel !== '1') {
                return null;
            }
            return (
                <View
                    style={{
                        position: 'absolute',
                        zIndex: 99,
                        left: 10,
                        top: 10,
                        backgroundColor: 'white',
                        borderRadius: 4,
                        borderColor: '#f0f0f0',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 2,
                        padding: 5
                    }}
                >
                    <Text style={{ color: Identify.theme.button_background, fontFamily: material.fontBold, textAlign: 'center' }}>{saleOff + '% ' + Identify.__('OFF')}</Text>
                </View>
            )
        }
    }
    renderImage() {
        let source = (this.props.product.images && this.props.product.images.length && !this.props.product.images[0].url.includes('placeholder'))
            ? { uri: this.props.product.images[0].url }
            : require('../../../icon/logo.png');
        return (
            <View style={{ width: '100%', alignItems: 'center' }}>
                <Image resizeMode='contain' source={source} style={{ width: 103, height: 103 }} />
            </View>
        );
    }
    renderName() {
        return (
            <Text style={{ marginTop: this.props.showList ? 0 : 10, fontFamily: material.fontBold }} numberOfLines={this.props.showList ? undefined : 2}>{this.props.product.name}</Text>
        );
    }

    renderStockLabel() {
        if (Identify.TRUE(this.props.product.is_salable)) {
            return (
                <View style={{ paddingHorizontal: 10, alignSelf: this.props.showList ? undefined : 'baseline', paddingVertical: 5, borderRadius: 3, backgroundColor: '#39A935', marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 12, lineHeight: 15 }}>{Identify.__('In stock')}</Text>
                </View>
            );
        } else {
            return (
                <View style={{ paddingHorizontal: 10, alignSelf: this.props.showList ? undefined : 'baseline', paddingVertical: 5, borderRadius: 3, backgroundColor: '#696969', marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 12, lineHeight: 15 }}>{Identify.__('Out of stock')}</Text>
                </View>
            );
        }
    }

    renderShortDescription() {
        if (!this.props.product.short_description) {
            return null;
        }
        return (
            <>
                <View style={{ backgroundColor: '#F3F3F3', width: '100%', height: 1, marginTop: 10 }} />
                <RenderHtml
                    contentWidth={Dimensions.get('screen').width / 2 - 35}
                    tagsStyles={{ p: { textAlign: 'left' }, span: { textAlign: 'left' } }}
                    source={{ html: this.props.product.short_description }}
                    baseStyle={{ fontFamily: material.fontFamily, fontSize: 12, marginTop: 10 }} />
            </>
        );
    }

    checkTypeIdAndPrice() {
        if (this.props.product.type_id === 'configurable' && this.props.product.app_prices && this.props.product.app_prices.price == 0) {
            return false;
        }
        return true;
    }

    renderPrice() {
        if (this.checkTypeIdAndPrice()) {
            return (
                <View style={{ flexGrow: 6, marginTop: 10 }}>
                    <Price
                        type={this.props.product.type_id}
                        prices={this.props.product.app_prices}
                        tierPrice={this.props.product.app_tier_prices}
                        styleDiscount={{ fontSize: 1, fontWeight: '100' }}
                        navigation={this.props.navigation}
                        styleOneRowPrice={{ flexDirection: 'column' }}
                        styleSpecialPrice={{ fontFamily: material.fontBold }}
                        stylePrice={{ fontFamily: material.fontBold }}
                        stylePriceLine={{ color: '#747474', fontSize: 13, textDecorationLine: 'line-through' }}
                    />
                </View>
            );
        }
    }
    renderAddBtn() {
        if (this.props.showList) {
            let showButton = true;
            if (this.storeConfig && this.storeConfig.hasOwnProperty('is_show_price_for_guest') &&
                this.storeConfig.is_show_price_for_guest == '0' && !Identify.getCustomerData()) {
                showButton = false;
            }
            if (this.props.product.is_salable != '1' || !showButton) {
                return (null);
            }
            return (
                <Button
                    style={{ flexGrow: 1, justifyContent: 'center' }}
                    onPress={() => { this.onAddToCart() }}
                >
                    <Text style={{ fontSize: 14, textAlign: 'center', fontFamily: material.fontBold }}>{Identify.__('Add To Cart')}</Text>
                </Button>
            )
        }
    }

    onAddToCart() {
        if (this.props.product.required_options == '1' || this.props.product.type_id != 'simple') {
            NavigationManager.openPage(this.props.navigation, 'ProductDetail', {
                productId: this.props.product.entity_id
            })
        } else {
            let params = {};
            params['product'] = this.props.product.entity_id;
            params['qty'] = 1;

            this.props.storeData('showLoading', { type: 'dialog' });

            newConnection = new NewConnection();
            newConnection.init(quoteitems, 'add_to_cart', this, 'POST');
            newConnection.addBodyData(params);
            newConnection.connect();
        }
    }
    setData(data) {
        if (!Identify.TRUE(data.is_can_checkout)) {
            data['reload_data'] = true;
        }

        this.props.storeData('actions', [
            { type: 'showLoading', data: { type: 'none' } },
            { type: 'quoteitems', data: data }
        ]);
        if (data.quote_id && data.quote_id != '') {
            AppStorage.saveData('quote_id', data.quote_id);
        }
        if (data.message && data.message.length > 0) {
            Toast.show({
                text: Identify.__(data.message[0]),
                textStyle: { color: "yellow", fontFamily: material.fontFamily },
                duration: 3000
            });
        }
    }
    handleWhenRequestFail() {
        this.props.storeData('showLoading', { type: 'none' });
    }

    openProductDetail() {
        NavigationManager.openPage(this.props.navigation, this.props.layout, {
            productId: this.props.product.entity_id,
            objData: this.props.product,
        });
    }

    renderPhoneLayout() {
        const isEven = this.props.index % 2 == 0;
        if (this.props.showList) {
            return (
                <TouchableOpacity style={this.props.itemStyle}
                    onPress={() => { this.openProductDetail() }}
                    style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#FFC0A7',
                        borderRadius: 16,
                        padding: 15,
                        marginBottom: 16,
                        flexDirection: 'row',
                        marginRight: Device.isTablet() ? (isEven ? 10 : 0) : 0
                    }}>
                    <View style={{ width: 103, alignItems: 'center' }}>
                        {this.renderImage()}
                        {this.renderStockLabel()}
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        {this.renderName()}
                        {this.renderPrice()}
                        {this.renderShortDescription()}
                    </View>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity style={this.props.itemStyle}
                onPress={() => { this.openProductDetail() }}
                style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: '#FFC0A7',
                    borderRadius: 16,
                    padding: 8,
                    marginBottom: 30,
                    marginRight: Device.isTablet() ? 0 : (isEven ? 5 : 0),
                    marginLeft: Device.isTablet() ? 10 : (isEven ? 0 : 5),
                    flexDirection: this.props.showList ? 'row' : 'column',
                    margin: this.props.showList ? 0 : undefined,
                }}>
                {this.renderImage()}
                {this.renderName()}
                {this.renderStockLabel()}
                {this.renderPrice()}
                {this.renderShortDescription()}
            </TouchableOpacity>
        );
    }

    dispatchContent() {
        let items = [];
        if (Events.events.add_labels) {
            for (let i = 0; i < Events.events.add_labels.length; i++) {
                let node = Events.events.add_labels[i];
                if (node.active === true) {
                    let key = md5("add_labels" + i);
                    let price = this.props.product.app_prices;
                    let hasSpecial = price.has_special_price !== null && price.has_special_price === 1;
                    let Content = node.content;
                    items.push(<Content key={key} hasSpecial={hasSpecial} type={this.props.showList ? '2' : '3'} product={this.props.product} />)
                }
            }
        }
        return items;
    }
}

const mapStateToProps = (state) => {
    return {
        customer_data: state.redux_data.customer_data,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerticalProductItem);
