import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { connect } from 'react-redux';
import { TouchableOpacity, Image, View } from 'react-native';
import { Card, CardItem, Text, Button, Toast } from 'native-base';
import NavigationManager from '@helper/NavigationManager';
import Price from '../../components/product/price';
import styles from './styles';
import Identify from '@helper/Identify';
import Events from '@helper/config/events';
import md5 from 'md5';
import NewConnection from '@base/network/NewConnection';
import { quoteitems } from '@helper/constants';
import OutStockLabel from '../product/outStockLabel';
import material from '@theme/variables/material';
import AppStorage from '@helper/storage';

class VerticalProductItem extends SimiComponent {
    constructor(props) {
        super(props)
        this.storeConfig = Identify.getMerchantConfig().storeview.base;
    }

    renderOutStock() {
        if (this.props.product.is_salable == '0') {
            return <OutStockLabel />
        }
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
        let source = (this.props.product.images && this.props.product.images.length > 0) ? { uri: this.props.product.images[0].url } : require('@media/logo.png');
        return (
            <CardItem cardBody>
                <View style={styles.image}>
                    {this.renderSpecialPriceLabel()}
                    <Image resizeMode='contain' source={source} style={styles.image} />
                    {this.renderOutStock()}
                    {this.dispatchContent()}
                </View>
            </CardItem>
        );
    }
    renderName() {
        return (
            <CardItem style={{ paddingLeft: this.props.showList ? 10 : 5 }}>
                <Text style={[styles.name, { fontFamily: material.fontBold }]} numberOfLines={this.props.showList ? undefined : 2}>{this.props.product.name}</Text>
            </CardItem>
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
                <View style={{ flexGrow: 6 }}>
                    <Price
                        type={this.props.product.type_id}
                        prices={this.props.product.app_prices}
                        tierPrice={this.props.product.app_tier_prices}
                        styleDiscount={{ fontSize: 1, fontWeight: '100' }}
                        navigation={this.props.navigation}
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
    renderItem() {
        return (
            <Card style={{ flex: 1 }}>
                {this.renderImage()}
                {this.renderName()}
                <View style={{ flexDirection: this.props.showList ? 'row' : 'column', paddingLeft: this.props.showList ? 10 : 5, paddingRight: this.props.showList ? 10 : 5, paddingBottom: this.props.showList ? 10 : 5 }}>
                    {this.renderPrice()}
                    {this.renderAddBtn()}
                </View>
            </Card>
        );
    }

    openProductDetail() {
        NavigationManager.openPage(this.props.navigation, this.props.layout, {
            productId: this.props.product.entity_id,
            objData: this.props.product,
        });
    }

    renderPhoneLayout() {
        return (
            <TouchableOpacity style={this.props.itemStyle}
                onPress={() => { this.openProductDetail() }}>
                {this.renderItem()}
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
