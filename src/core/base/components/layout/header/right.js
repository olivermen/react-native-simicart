import React from 'react';
import { Icon, Badge, Text } from 'native-base';
import variable from "@theme/variables/material";
import { StyleSheet, Platform, TouchableHighlight, View } from 'react-native';
import NavigationManager from '@helper/NavigationManager';
import Device from '@helper/device';
import { products_mode } from "@helper/constants";
import Events from '@helper/config/events';
import md5 from 'md5';
import Identify from '@helper/Identify';

const RightHeader = (props) => {

    function renderQty() {
        let qtyStyle = { position: 'absolute', right: -5, top: 0, height: 20, paddingBottom: 2 }
        let textQtyStyle = Platform.OS === "ios" ? { fontSize: 7, lineHeight: 0 } : { fontSize: 8 };
        let qty = props.parent.props.data.cart_total ? (
            <TouchableHighlight style={qtyStyle}
                onPress={() => { NavigationManager.openPage(props.navigation, 'Cart', {}); }}>
                <Badge style={{ height: 20, alignItems: "center", justifyContent: 'center' }}>
                    <Text style={textQtyStyle}>{props.parent.props.data.cart_total}</Text>
                </Badge>
            </TouchableHighlight>
        ) : null;
        return (qty);
    }

    function renderCart() {
        return (
            <Icon name="cart"
                style={{ color: variable.toolbarBtnColor, fontSize: 23, padding: 7, paddingLeft: 10, paddingRight: 10, transform: [{ scaleX: Identify.isRtl() ? -1 : 1 }] }}
                onPress={() => {
                    NavigationManager.openPage(props.navigation, 'Cart', {});
                }} />
        );
    }

    function renderSearch() {
        let search = props.parent.props.showSearch ? <Icon name='search'
            style={{ fontSize: 23, color: variable.toolbarBtnColor, marginRight: Device.isTablet() ? 5 : 0, padding: 7, paddingLeft: 10, paddingRight: 10 }}
            onPress={() => {
                openSearchPage();
            }} /> : null;
        return (search);
    }


    if (props.parent.props.show_right == false) {
        return (
            <View style={{ width: 30, height: 40 }} />
        );
    }
    let plugins = dispatchEventAddItems();
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {plugins}
            {renderSearch()}
            {renderCart()}
            {renderQty()}
        </View>
    )

    function openSearchPage() {
        if (props.navigation.getParam("query")) {
            NavigationManager.backToPreviousPage(props.navigation);
        } else {
            let mode = props.navigation.getParam("mode");
            if (mode && mode === products_mode.spot) {
                routeName = 'SearchProducts';
                params = {
                    mode: mode,
                };
            } else {
                routeName = 'SearchProducts';
                params = {
                    categoryId: props.navigation.getParam("categoryId"),
                    categoryName: props.navigation.getParam("categoryName"),
                };
            }
            NavigationManager.openPage(props.navigation, routeName, params);
        }
    }

    function dispatchEventAddItems() {
        let events = Events.events.header_items_right;

        let items = [];
        if (events) {
            for (let i = 0; i < events.length; i++) {
                let item = events[i];
                if (item.active == true) {
                    let key = md5("header_right" + i);
                    let Content = item.content;
                    items.push(<Content obj={this} navigation={props.navigation} key={key} />);
                }
            }
        }
        return items;
    }
}

export const styles = StyleSheet.create({
    bothLeftRight: {
        zIndex: 999,
    },
    qty: {
        position: 'absolute', right: -8, top: 3, height: 20, marginBottom: 2
    }
});
export default RightHeader;
