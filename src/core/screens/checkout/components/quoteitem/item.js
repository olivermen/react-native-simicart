import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { ListItem, Body, Right, Button, Icon, View, Text, Input } from 'native-base';
import Identify from '@helper/Identify';
import { StyleSheet, TextInput, Image, Alert, TouchableOpacity } from 'react-native';
import material from '@theme/variables/material';
import NavigationManager from '@helper/NavigationManager';
import QuoteItemView from './quote';
import OutStockLabel from '../../../catalog/components/product/outStockLabel';

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

    function renderQtyBox() {
        let qtyBox = (
            <TextInput style={styles.qtyBox}
                placeholderTextColor="#000"
                value={parseInt(props.data.qty.toString()).toString()}
                editable={false}
                underlineColorAndroid="transparent" />
        );
        if (props.parent.from && props.parent.from == 'cart' && (!props.data.product.is_salable || (props.data.product.is_salable && Identify.TRUE(props.data.product.is_salable)))) {
            qtyBox = (
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
                        props.parent.qtySubmit(e, props.data.item_id, props.data.qty)
                    }}
                    underlineColorAndroid="transparent" />
            );
        }
        return qtyBox;
    }

    function renderMoveItem() {
        let remove_item = null;
        if (props.parent.from && props.parent.from == 'cart') {
            remove_item = (
                <Button style={{ position: 'absolute', top: 5, right: 5 }} transparent
                    onPress={() => { showDeleteItemPopup(props.data) }}>
                    <Icon style={{ textAlign: 'right', marginLeft: 0, marginRight: 0 }} name="ios-trash" />
                </Button>
            );
        }
        return remove_item;
    }
    function onItemSelect() {
        let route = 'ProductDetail';
        if (props.data.product_type === 'simigiftvoucher') {
            route = 'ProductGiftCardDetail'
        }
        NavigationManager.openPage(props.parent.props.navigation,
            route, {
            productId: props.data.product_id,
        })
    }
    function renderImageItem() {
        if (props.parent.is_go_detail) {
            return (
                <TouchableOpacity onPress={() => {
                    onItemSelect()
                }}>
                    <Image style={[styles.viewImage, { borderWidth: 0.5, borderColor: material.imageBorderColor }]} source={{ uri: props.data.image }} resizeMode='contain' />
                    {renderOutStock()}
                </TouchableOpacity>
            )
        }
        if (typeof props.data.image === 'string') {
            return (
                <Image style={styles.viewImage} source={{ uri: props.data.image }} resizeMode='contain' />
            )
        } else {
            return (null)
        }
    }

    function renderOutStock() {
        if (props.data.product.hasOwnProperty('is_salable') && !Identify.TRUE(props.data.product.is_salable)) {
            return <OutStockLabel fontSize={12} />
        }
    }

    function renderItemContent() {
        return (
            <View style={{ marginLeft: 20, flex: 2 }}>
                <Text style={[styles.spaceLine, { fontFamily: material.fontBold }]}>{props.data.name}</Text>
                <QuoteItemView item={props.data} style={styles.itemStyle} />
                <View style={styles.viewFlexQty}>
                    <Text style={{ marginTop: 5, marginRight: 15 }}>{Identify.__('Quantity')}</Text>
                    {renderQtyBox()}
                </View>
            </View>
        );
    }

    return (
        <ListItem
            style={{
                marginRight: 15,
                marginLeft: 15,
                paddingRight: 0
            }}
        >
            <Body style={styles.viewFlexBody}>
                <View style={{ paddingTop: 5 }}>
                    {renderImageItem()}
                </View>
                {renderItemContent()}
            </Body>
            <Right />
            {renderMoveItem()}
        </ListItem>
    );
}

const styles = StyleSheet.create({
    qtyBox: { borderStyle: 'solid', width: 55, height: 35, fontSize: 13, borderColor: '#000', alignItems: 'center', borderWidth: 1, borderRadius: 4, textAlign: 'center', color: 'black' },
    spaceLine: { fontFamily: material.fontBold, marginBottom: 5, textAlign: 'left' },
    itemStyle: { marginBottom: 5, fontSize: material.textSizeSmall },
    viewFlexBody: { flex: 3, flexDirection: 'row' },
    viewFlexQty: { flex: 1, flexDirection: 'row', marginTop: 10 },
    viewImage: { borderColor: '#dedede', height: 110, width: 110, borderWidth: 1 },
    viewFlexCoupon: { flex: 3, flexDirection: 'row', marginTop: 20, marginLeft: 15, marginRight: 10 },
});

export default QuoteItem