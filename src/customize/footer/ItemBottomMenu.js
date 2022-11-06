import React from 'react';
import { View, Image, TouchableHighlight, Platform } from 'react-native';
import NavigationManager from '@helper/NavigationManager';
import { Toast, Text, Badge } from 'native-base';
import Identify from '@helper/Identify'
import material from '@theme/variables/material';

export default class ItemBottomMenu extends React.Component {

    openPage() {
        route_name = this.props.data.route_name;
        if (route_name == this.props.current_screen) {
            return;
        }
        if (route_name === 'Search') {
            NavigationManager.openRootPage(this.props.navigation, "SearchProducts");
        } else if (route_name === 'Home') {
            NavigationManager.backToRootPage(this.props.navigation);
            // this.props.navigation.goBack(null);
        } else if (route_name === 'Deals') {
            NavigationManager.openRootPage(this.props.navigation, "Products", {
                categoryId: '401',
                categoryName: 'Deals'
            })
        } else {
            NavigationManager.openRootPage(this.props.navigation, route_name);
        }
    }

    renderQty() {
        let qtyStyle = { position: 'absolute', top: -5, right: Identify.isRtl() ? 5 : -5, height: 14, paddingBottom: 0, backgroundColor: '#D51C17', alignItems: 'center', justifyContent: 'center', borderRadius: 7, minWidth: 14 }
        let qty = (this.props.quoteitems && this.props.quoteitems.cart_total) ? (
            <TouchableHighlight style={qtyStyle}
                onPress={() => { NavigationManager.openPage(this.props.navigation, 'Cart', {}); }}>
                <Text style={{ fontSize: 9, color: 'white', fontFamily: material.fontBold, paddingTop: 2 }}>{this.props.quoteitems.cart_total}</Text>
            </TouchableHighlight>
        ) : null

        return (qty);
    }

    render() {
        let isActive = this.props.current_screen == this.props.data.route_name;
        if ((this.props.data.route_name === 'Search' && this.props.current_screen == 'SearchProducts') ||
            (this.props.data.route_name === 'Deals' && this.props.current_screen == 'Products')) {
            isActive = true;
        }
        return (
            <TouchableHighlight onPress={() => {
                // if (this.props.data.key != 'deals_bottom') {
                this.openPage();
                // }
            }}
                underlayColor="white"
                style={{ width: '100%', flex: 1, backgroundColor: 'white', height: 60, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Image style={[
                            { width: 20, height: 20 },
                            this.props.data.key == 'deals_bottom' ? {} : { tintColor: isActive ? '#E4531A' : '#000000' }
                        ]}
                            source={this.props.data.image}
                        />
                        <Text style={{ fontSize: 12, textAlign: 'center', marginTop: Identify.isRtl() ? 0 : 2, color: isActive ? '#E4531A' : '#747474', fontFamily: isActive ? material.fontBold : material.fontFamily }}>
                            {Identify.__(this.props.data.route_name)}
                        </Text>
                    </View>
                    {this.props.data.key == 'cart_bottom' ? this.renderQty() : null}
                </View>
            </TouchableHighlight>
        );
    }
}