import React from 'react';
import { StyleSheet, TextInput, Image, Alert, TouchableOpacity } from 'react-native';
import { Icon, View, Text } from 'native-base';
import QuoteItemView from './quote';
import Identify from '@helper/Identify';
import SimiCart from '@helper/simicart';
import material from '@theme/variables/material';
import NavigationManager from '@helper/NavigationManager';

const QuoteItem = (props) => {

    function showDeleteItemPopup() {
        Alert.alert(
            Identify.__('Warning'),
            Identify.__('Are you sure you want to delete this product?'),
            [
                { text: Identify.__('Cancel'), onPress: () => { style: 'cancel' } },
                {
                    text: Identify.__('OK'), onPress: () => {
                        props.parent.updateCart(props.data.item_id, 0)
                    }
                },
            ],
            { cancelable: true }
        );
    }

    function changeQty(qty) {
        if (qty > 0) {
            props.parent.updateCart(props.data.item_id, qty)
        }
    }

    function renderQtyBox() {
        let qtyBox = null;
        if (props.parent.from && props.parent.from == 'cart' && (!props.data.product.is_salable || (props.data.product.is_salable && Identify.TRUE(props.data.product.is_salable)))) {
            const canDecreseQty = parseInt(props.data.qty) > 1;
            qtyBox = (
                <View style={styles.viewFlexQty}>
                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { showDeleteItemPopup(props.data) }}>
                        <Image source={require('../../../icon/icon-remove.png')} style={{ width: 19, height: 20 }} />
                        <Text style={{ fontSize: 16, color: '#E4531A', marginLeft: 10 }}>{Identify.__('Remove')}</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1, marginRight: 15, flexDirection: 'row', borderWidth: 1, borderRadius: 8, borderColor: '#D8D8D8', backgroundColor: '#FAFAFA', height: 50 }}>
                        <TouchableOpacity
                            style={{ width: 45, height: 50, alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => {
                                if (canDecreseQty) {
                                    changeQty(parseInt(props.data.qty) - 1)
                                }
                            }}>
                            <Icon name='md-remove' style={{ color: canDecreseQty ? 'black' : '#747474', fontSize: 20 }} />
                        </TouchableOpacity>
                        <TextInput style={styles.qtyBox}
                            placeholderTextColor="#000000"
                            defaultValue={parseInt(props.data.qty.toString()).toString()}
                            keyboardType="numeric"
                            returnKeyType="done"
                            onSubmitEditing={(e) => {
                                let qty = e.nativeEvent.text;
                                if (isNaN(qty)) {
                                    Alert.alert(
                                        Identify.__('Error'),
                                        Identify.__('Quantity is not valid')
                                    );
                                    return;
                                }
                                changeQty(parseInt(qty))
                            }}
                            underlineColorAndroid="transparent" />
                        <TouchableOpacity
                            style={{ width: 45, height: 50, alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => changeQty(parseInt(props.data.qty) + 1)}>
                            <Image source={require('../../../icon/icon-plus.png')} style={{ width: 13, height: 21 }} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        return qtyBox;
    }

    function onItemSelect() {
        let route = 'ProductDetail';
        if (props.data.product_type === 'simigiftvoucher') {
            route = 'ProductGiftCardDetail'
        }
        NavigationManager.openPage(props.parent.props.navigation, route, {
            productId: props.data.product_id
        })
    }

    function renderImageItem() {
        let imageUrl = props.data.image;
        if (props.data.product_type == 'giftvoucher') {
            const giftcard_options = props.data.product.giftcard_options;
            if (giftcard_options) {
                if (giftcard_options.giftcard_use_custom_image && giftcard_options.giftcard_use_custom_image == '1') {
                    imageUrl = SimiCart.merchant_url + 'pub/media/tmp/giftvoucher/images/' + giftcard_options.giftcard_template_image;
                } else {
                    imageUrl = SimiCart.merchant_url + 'pub/media/giftvoucher/template/images/' + giftcard_options.giftcard_template_image;
                }
            }
        }
        if (props.parent.is_go_detail) {
            return (
                <TouchableOpacity onPress={() => { onItemSelect() }}>
                    <Image style={styles.viewImage} source={{ uri: imageUrl }} resizeMode='contain' />
                </TouchableOpacity>
            )
        }
        if (typeof props.data.image === 'string') {
            return (
                <Image style={styles.viewImage} source={{ uri: imageUrl }} resizeMode='contain' />
            )
        } else {
            return (null)
        }
    }

    function renderItemContent() {
        return (
            <View style={{ marginLeft: 10, flex: 1 }}>
                <View style={{ flexDirection: 'row-reverse' }}>
                    {(!props.parent.from || props.parent.from != 'cart') && <Text style={{ fontFamily: material.fontBold, color: '#E4531A', marginLeft: 5 }}>x {parseInt(props.data.qty.toString()).toString()}</Text>}
                    <Text style={styles.spaceLine}>{props.data.name}</Text>
                </View>
                <QuoteItemView item={props.data} style={styles.itemStyle} />
                {renderQtyBox()}
            </View>
        );
    }

    return (
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#D8D8D8', paddingVertical: 20, flexDirection: 'row' }}>
            {renderImageItem()}
            {renderItemContent()}
        </View>
    );
}

const styles = StyleSheet.create({
    qtyBox: { flexGrow: 1, height: 50, borderWidth: 0, backgroundColor: 'transparent', fontSize: 16, alignItems: 'center', textAlign: 'center', color: 'black' },
    spaceLine: { textAlign: 'left', flex: 1 },
    itemStyle: { marginBottom: 5, fontSize: material.textSizeSmall },
    viewFlexBody: { flex: 3, flexDirection: 'row' },
    viewFlexQty: { flex: 1, flexDirection: 'row', marginTop: 10, flexDirection: 'row-reverse', alignItems: 'center' },
    viewImage: { height: 78, width: 78 },
    viewFlexCoupon: { flex: 3, flexDirection: 'row', marginTop: 20, marginLeft: 15, marginRight: 10 },
});

export default QuoteItem