import React from 'react';
import { Icon, Badge, Text } from 'native-base';
import { StyleSheet, Platform, TouchableHighlight, View, TouchableOpacity, Image } from 'react-native';
import NavigationManager from '@helper/NavigationManager';
import Device from '@helper/device';
import { products_mode } from "@helper/constants";
import Events from '@helper/config/events';
import md5 from 'md5';
import Identify from '@helper/Identify';
import material from '../../../native-base-theme/variables/material';

const RightHeader = (props) => {

    function renderQty() {
        let qtyStyle = { position: 'absolute', right: -3, top: 2, height: 20, backgroundColor: '#D51C17', alignItems: 'center', justifyContent: 'center', borderRadius: 10, minWidth: 20 }
        let qty = props.parent.props.data.cart_total ? (
            <TouchableHighlight style={qtyStyle}
                onPress={() => { NavigationManager.openPage(props.navigation, 'Cart', {}); }}>
                <Text style={{ fontSize: 12, color: 'white', fontFamily: material.fontBold, paddingTop: 2 }}>{props.parent.props.data.cart_total}</Text>
            </TouchableHighlight>
        ) : null;
        return (qty);
    }

    function renderCart() {
        return (
            <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => {
                    NavigationManager.openPage(props.navigation, 'Cart', {});
                }}>
                <Image
                    source={require('../icon/ic_cart_header.png')}
                    style={{ width: 20, height: 20 }} />
                {renderQty()}
            </TouchableOpacity>
        );
    }

    function renderSearch() {
        return (
            <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => {
                    openSearchPage();
                }}>
                <Image
                    source={require('../icon/icon-search.png')}
                    style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
        );
    }


    // if (props.parent.props.show_right == false) {
    //     return (
    //         <View style={{ width: 30, height: 40 }} />
    //     );
    // }
    // let plugins = dispatchEventAddItems();
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* {plugins} */}
            {renderSearch()}
            {props.parent.props.showCart && renderCart()}
        </View>
    )

    function openSearchPage() {
        if (props.navigation.getParam("query")) {
            NavigationManager.backToPreviousPage(props.navigation);
        } else {
            // let mode = props.navigation.getParam("mode");
            // if (mode && mode === products_mode.spot) {
                routeName = 'SearchProducts';
                // params = {
                //     mode: mode,
                // };
            // } else {
            //     routeName = 'SearchProducts';
            //     params = {
            //         categoryId: props.navigation.getParam("categoryId"),
            //         categoryName: props.navigation.getParam("categoryName"),
            //     };
            // }
            NavigationManager.openRootPage(props.navigation, routeName);
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
