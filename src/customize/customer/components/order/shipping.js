import React from 'react';
import { View, Text, StyleSheet } from 'react-native'
import Identify from '@helper/Identify';
import material from '@theme/variables/material';

const OrderShipping = (props) => {

    const custom_field_config = Identify.getMerchantConfig().storeview.custom_field_config;

    renderName = (addressItem) => {
        let name = '';
        if (addressItem.prefix !== undefined && addressItem.prefix !== null && addressItem.prefix !== '') {
            name += addressItem.prefix + ' ';
        }

        if (addressItem.firstname !== undefined && addressItem.firstname !== null && addressItem.firstname !== '') {
            name += addressItem.firstname + ' ';
        }

        if (addressItem.lastname !== undefined && addressItem.lastname !== null && addressItem.lastname !== '') {
            name += addressItem.lastname + ' ';
        }

        if (addressItem.suffix !== undefined && addressItem.suffix !== null && addressItem.suffix !== '') {
            name += addressItem.suffix;
        }

        if (name !== '') {
            return <Text style={{ fontSize: 14, paddingBottom: 6, textAlign: 'left' }}>{name}</Text>
        }
    }

    renderPhone = (addressItem) => {
        let telephone = '';
        if (addressItem.telephone !== undefined && addressItem.telephone !== null && addressItem.telephone !== '') {
            telephone = addressItem.telephone;
        }
        if (telephone !== '') {
            return <Text style={{ fontSize: 14, textAlign: 'left' }}>{telephone}</Text>
        }
    }

    renderBlockBuildingNumber = (addressItem) => {
        let info = '';
        if (addressItem.house_building_number !== undefined && addressItem.house_building_number !== null && addressItem.house_building_number !== '') {
            info += addressItem.house_building_number;
        }
        if (addressItem.block_number !== undefined && addressItem.block_number !== null && addressItem.block_number !== '') {
            info += ', ' + addressItem.block_number;
        }
        if (addressItem.address_types !== undefined && addressItem.address_types !== null && addressItem.address_types !== '' && getFieldLabel('address_types', addressItem.address_types)) {
            info += ', ' + getFieldLabel('address_types', addressItem.address_types);
        }
        if (addressItem.area !== undefined && addressItem.area !== null && addressItem.area !== '' && getFieldLabel('area', addressItem.area)) {
            info += ', ' + getFieldLabel('area', addressItem.area);
        }
        if (info !== '') {
            return <Text style={{ fontSize: 14, paddingBottom: 6, textAlign: 'left' }}>{info}</Text>
        }
    }

    function getFieldLabel(code, value) {
        let label = null;
        try {
            custom_field_config.forEach(field => {
                if (field.code == code) {
                    const options = field.options;
                    options.forEach(element => {
                        if (element.value == value) {
                            label = element.label;
                        }
                    });
                }
            });
        } catch (err) {
            return label;
        }
        return label;
    }

    let address = props.order.shipping_address;
    return (
        <>
            <View style={{ alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 20, fontWeight: '500', paddingBottom: 15 }}>
                    {Identify.__('Order Information')}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '500', paddingBottom: 15 }}>{Identify.__('Shipping Address')}</Text>
                <>
                    {this.renderName(address)}
                    {this.renderBlockBuildingNumber(address)}
                    {this.renderPhone(address)}
                </>
            </View>
            <View style={styles.container}>
                <Text style={{ fontWeight: '500', paddingRight: 8 }}>{Identify.__('Shipping Method:')}</Text>
                <Text>{Identify.__(props.order.shipping_method !== 'Click & Collect - Click & Collect' ? props.order.shipping_method : 'Click & Collect')}</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 45,
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D8D8D8',
        paddingLeft: 16,
        marginTop: 15
    }
})

export default OrderShipping;