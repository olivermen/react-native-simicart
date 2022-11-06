import React from 'react';
import SimiComponent from "@base/components/SimiComponent";
import { Image, TouchableOpacity, View } from 'react-native';
import { Text, Button } from 'native-base';
import Price from '../product/price';
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify';
import styles from './styles';
import { scale, verticalScale } from 'react-native-size-matters';
import Events from '@helper/config/events';
import md5 from 'md5';
import material from '@theme/variables/material';

const HorizontalItem = (props) => {

    const item = props.item;

    function openProduct() {
        NavigationManager.openPage(props.navigation, 'ProductDetail', {
            productId: item.entity_id,
            objData: item
        });
    }

    function renderSpecialPriceLabel() {
        let saleOff = null;
        let price = props.item.app_prices;
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
    function renderImage() {
        let source = (item.images && item.images.length > 0) ? { uri: item.images[0].url } : require('@media/logo.png');
        return (
            <View style={{ width: '100%', alignItems: 'center' }}>
                <Image resizeMode='contain' source={source} style={{ width: 103, height: 103 }} />
            </View>
        );
    }

    const renderBrand = () => {
        if (!item.brand_model) {
            return null;
        }
        return (
            <Image
                source={{ uri: item.brand_model.image }}
                style={{ width: 75, height: 25, marginTop: 5 }}
                resizeMode="contain" />
        );
    }

    const renderStockLabel = () => {
        if (Identify.TRUE(item.is_salable)) {
            return (
                <View style={{ paddingHorizontal: 10, alignSelf: 'baseline', paddingVertical: 4, borderRadius: 3, backgroundColor: '#39A935', marginVertical: 8, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 10 }}>{Identify.__('In stock')}</Text>
                </View>
            );
        } else {
            return (
                <View style={{ paddingHorizontal: 10, alignSelf: 'baseline', paddingVertical: 4, borderRadius: 3, backgroundColor: '#696969', marginVertical: 8, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 10 }}>{Identify.__('Out of stock')}</Text>
                </View>
            );
        }
    }

    function checkTypeIdAndPrice() {
        if (item.type_id === 'configurable' && item.app_prices && item.app_prices.price == 0) {
            return false;
        }
        return true;
    }

    function renderContent() {
        return (
            <View style={{ flex: 1, alignItems: 'flex-start', marginTop: 5 }}>
                <Text
                    numberOfLines={2}
                    ellipsizeMode={'tail'}
                    style={{ fontFamily: material.fontBold, fontSize: 12 }}>
                    {item.name}
                </Text>
                {renderStockLabel()}
                {checkTypeIdAndPrice(item) && <Price
                    type={item.type_id}
                    prices={item.app_prices}
                    navigation={props.navigation}
                    styleOneRowPrice={{ flexDirection: 'column' }}
                    styleSpecialPrice={{ fontFamily: material.fontBold, fontSize: 16 }}
                    stylePrice={{ fontFamily: material.fontBold, fontSize: 16 }}
                    stylePriceLine={{ color: '#747474', fontSize: 16, textDecorationLine: 'line-through' }}
                />}
            </View>
        );
    }

    return (
        <TouchableOpacity
            onPress={() => { openProduct() }}
            style={{ borderWidth: 1, borderColor: '#FFC0A7', borderRadius: 8, padding: 8, paddingBottom: 15, width: 176, marginRight: 15, backgroundColor: 'white' }}
        >
            {renderImage()}
            {renderBrand()}
            {renderContent()}
            <Button
                full
                disabled={!Identify.TRUE(item.is_salable)}
                onPress={() => props.onAddToCart(item)}
                style={{ flex: 1, height: 40, borderRadius: 10, marginTop: 12 }}>
                <Text style={{ color: Identify.theme.button_text_color, fontFamily: material.fontBold, fontSize: 15 }}>{Identify.__("Add to cart")}</Text>
            </Button>
        </TouchableOpacity>
    )

}
export default HorizontalItem