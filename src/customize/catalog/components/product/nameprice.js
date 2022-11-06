import React from 'react';
import SimiComponent from "@base/components/SimiComponent";
import { Text } from 'native-base';
import { Image, View, TextInput, StyleSheet, Dimensions } from 'react-native'
import Price from './price';
import Identify from '../../../../core/helper/Identify';
import { TouchableOpacity } from 'react-native';
import NavigationManager from '@helper/NavigationManager';
import material from '../../../../../native-base-theme/variables/material';
import RenderHtml from 'react-native-render-html';
import GiftValueDropdown from './giftcard/GiftValueDropdown';
import GiftValueRange from './giftcard/GiftValueRange';
import GiftCardTemplate from './giftcard/template';
import { products } from '@helper/constants';
import NewConnection from '@base/network/NewConnection';
import ClicknCollect from './ClicknCollect'

export default class ProductNamePriceComponent extends SimiComponent {

    constructor(props) {
        super(props);
        this.state = {
            qty: 1,
            selectedTemplate: 0,
            selectedImage: 0,
            giftCustomImage: null
        }
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }
    }
    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined)
        }
    }

    getCheckoutQty() {
        return this.state.qty;
    }

    checkTypeIdAndPrice() {
        if (this.props.product.type_id === 'configurable' && this.props.product.app_prices && this.props.product.app_prices.price == 0) {
            return false;
        }
        return true;
    }

    uploadGiftImage(data) {
        new NewConnection()
            .init(products, 'upload_gift_image', this, 'POST')
            .addBodyData(data)
            .connect();
    }

    setData(data, requestId) {
        if (data && data.url) {
            this.props.parent.changeGiftCardTemplate(this.props.parent.giftCardTemplate.template, -1, data);
            this.setState({ giftCustomImage: data, selectedImage: -1 });
        }
    }

    renderPrice() {
        if (this.props.product.type_id !== 'grouped' && this.checkTypeIdAndPrice()) {
            return (
                <Price
                    product={this.props.product}
                    type={this.props.product.type_id}
                    prices={this.props.product.app_prices}
                    tierPrice={this.props.product.app_tier_prices}
                    onRef={ref => (this.prices = ref)}
                    navigation={this.props.navigation}
                    styleOneRowPrice={{ flexDirection: 'column' }}
                    styleSpecialPrice={{ fontFamily: material.fontBold, fontSize: 20 }}
                    stylePrice={{ fontFamily: material.fontBold, fontSize: 20 }}
                    stylePriceLine={{ color: '#747474', fontSize: 16, textDecorationLine: 'line-through' }}
                />
            )
        }
    }

    renderStockLabel() {
        if (this.props.product.is_salable == '1') {
            return (
                <View style={{ paddingHorizontal: 10, alignSelf: this.props.showList ? undefined : 'baseline', paddingVertical: 5, borderRadius: 3, backgroundColor: '#39A935', marginTop: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 14, lineHeight: 15 }}>{Identify.__('In stock')}</Text>
                </View>
            );
        } else {
            return (
                <View style={{ paddingHorizontal: 10, alignSelf: this.props.showList ? undefined : 'baseline', paddingVertical: 5, borderRadius: 3, backgroundColor: '#696969', marginTop: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 14, lineHeight: 15 }}>{Identify.__('Out of stock')}</Text>
                </View>
            );
        }
    }

    changeQty(state) {
        if (!this.props.parent.state.reRender) {
            return;
        }
        let qty = this.state.qty;
        if (isNaN(qty) || !Number.isInteger(parseInt(qty))) {
            return;
        }
        qty = parseInt(qty);
        if (state === 'minus') {
            if (qty > 1) {
                qty -= 1;
            }
        } else {
            qty += 1;
        }
        this.props.parent.updateQty(qty)
        this.setState({ qty });
    }

    renderGiftCardValue() {
        if (this.props.product.type_id == 'giftvoucher') {
            if (this.props.product.gift_type == '3') {
                return <GiftValueDropdown
                    product={this.props.product}
                    updatePrices={this.updatePrices.bind(this)}
                    updateGiftValue={(value) => this.props.parent.updateGiftValue(value)} />
            } else if (this.props.product.gift_type == '2') {
                return (
                    <GiftValueRange
                        product={this.props.product}
                        updatePrices={this.updatePrices.bind(this)}
                        updateGiftValue={(value) => this.props.parent.updateGiftValue(value)}
                        showPopupError={this.props.parent.showPopupError}
                    />)
            }
        }
        return null;
    }

    renderPhoneLayout() {
        if (this.props.product == null) {
            return (null);
        }
        this.brand_view_product = Identify.getMerchantConfig().storeview.manufacturer.brand_view_product;
        return (
            <View style={{ marginTop: 20, paddingHorizontal: 12 }}>
                <Text style={{ textAlign: 'left', fontSize: 24, fontFamily: material.fontBold }}>{this.props.product.name}</Text>
                <Text style={{ textAlign: 'left', color: '#747474', marginTop: 8 }}>{Identify.__('SKU')}: {this.props.product.sku}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 }}>
                    {this.renderPrice()}
                    {this.props.product.brand_model &&
                        <TouchableOpacity onPress={() => {
                            NavigationManager.openPage(this.props.navigation, 'Products', {
                                manufacturer_option_id: this.props.product.brand_model.option_id,
                                manufacturer_name: this.props.product.brand_model.name,
                                manufacturer_image: this.props.product.brand_model.image
                            })
                        }}>
                            <Image
                                source={{ uri: this.props.product.brand_model.image }} style={{ width: 120, height: 40 }} resizeMode="contain" />
                        </TouchableOpacity>}
                </View>
                {this.renderStockLabel()}

                {this.props.product.type_id !== 'virtual' && Identify.getMerchantConfig().storeview.base.click_collect_enable === 1
                    ? < ClicknCollect product={this.props.product} />
                    : null}

                {this.props.product.short_description && <View style={{ borderTopWidth: 1, borderColor: '#D8D8D8', marginTop: 15, paddingVertical: 15 }}>
                    <RenderHtml
                        contentWidth={Dimensions.get('screen').width - 24}
                        tagsStyles={{ p: { textAlign: 'left' }, span: { textAlign: 'left' } }}
                        source={{ html: this.props.product.short_description }}
                        baseStyle={{ fontFamily: material.fontFamily }} />
                </View>}
                {this.renderGiftCardValue()}
                {<GiftCardTemplate
                    product={this.props.product}
                    updateImages={(template, image) => {
                        this.setState({
                            selectedTemplate: template,
                            selectedImage: image
                        })
                        this.props.parent.changeGiftCardTemplate(template, image);
                    }}
                    updateEmailFormData={(formData) => {
                        this.props.parent.updateEmailForm(formData);
                    }}
                    updateNotiForm={(formData) => {
                        this.props.parent.updateNotiForm(formData);
                    }}
                    uploadGiftImage={this.uploadGiftImage.bind(this)}
                    giftCustomImage={this.state.giftCustomImage}
                    selectedTemplate={this.state.selectedTemplate}
                    selectedImage={this.state.selectedImage} />}
                <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontFamily: material.fontBold }}>{Identify.__('Quantity')}</Text>
                    <View style={{ flexDirection: Identify.isRtl() ? 'row-reverse' : 'row', marginLeft: 20, width: 153, height: 50, backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#D8D8D8', borderRadius: 8 }}>
                        <TouchableOpacity style={Identify.isRtl() ? styles.plusStyle : styles.minusStyle} onPress={() => this.changeQty('minus')}>
                            <Image style={{ height: 14, width: 14, tintColor: this.state.qty == 1 ? '#B3B3B3' : '#000000' }} source={require('../../../icon/icon-minus.png')} />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            returnKeyType="done"
                            onChangeText={(text) => {
                                // let qty = text;
                                // if (!text || text.length < 1) {
                                //   qty = 1;
                                // }
                                this.setState({
                                    qty: text
                                })
                            }}
                            defaultValue={this.state.qty.toString()}
                            underlineColorAndroid="transparent" />
                        <TouchableOpacity style={Identify.isRtl() ? styles.minusStyle : styles.plusStyle} onPress={() => this.changeQty('plus')}>
                            <Image style={{ height: 14, width: 14, tintColor: '#000000' }} source={require('../../../icon/icon-plus.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    updatePrices(newPrices) {
        if (this.prices) {
            this.prices.updatePrices(newPrices);
        }
    }
}

const styles = StyleSheet.create({
    input: {
        width: 63,
        height: 50,
        color: '#000000',
        alignItems: 'center',
        textAlign: 'center',
        fontFamily: material.fontBold,
        fontSize: 16
    },
    minusStyle: {
        height: 50,
        width: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },
    plusStyle: {
        height: 50,
        width: 45,
        alignItems: 'center',
        justifyContent: 'center'
    }
});