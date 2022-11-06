import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { Text, Icon } from 'native-base';
import { View } from 'react-native'
import Identify from '@helper/Identify';
import material from '@theme/variables/material';
import NavigationManager from '@helper/NavigationManager';
import { address_book_mode } from '@helper/constants';

export default class EstimateShipping extends SimiComponent {

    constructor(props) {
        super(props);
        this.parent = this.props.parent;
    }

    openAddressBook() {
        NavigationManager.openPage(this.props.parent.props.navigation, 'AddressBook', {
            mode: address_book_mode.checkout.select
        });
    }

    renderPhoneLayout() {
        let data = this.parent.props.data;
        if (!data.hasOwnProperty('estimate_shipping') || !data.estimate_shipping.address || !data.estimate_shipping.shipping_method) {
            return (null);
        } else {
            let address = data.estimate_shipping.address;
            let shipping = data.estimate_shipping.shipping_method;

            return (
                <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 0.3, borderColor: '#c9c9c9' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name={'md-locate'} style={{ fontSize: 16 }} />
                        <Text style={{ fontSize: 16, fontFamily: material.fontBold, marginLeft: 10 }}>{Identify.__('SHIP TO')}</Text>
                        <Icon style={{ padding: 5, fontSize: 20, position: 'absolute', right: 0 }} name="md-settings" onPress={() => {
                            this.openAddressBook();
                        }} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 26, marginTop: 5 }}>
                        <Text ellipsizeMode='tail' numberOfLines={1}>{address.street}, {address.city}, {address.region}, {address.postcode}, {address.country_name}</Text>
                        <Text>{Identify.formatPrice(shipping.price)}  {shipping.carrier_title} {shipping.method_title ? '- ' + shipping.method_title : ''}</Text>
                    </View>
                </View>
            );
        }
    }

}