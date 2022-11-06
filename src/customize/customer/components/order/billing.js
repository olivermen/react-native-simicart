import React from 'react';
import { View, Text, StyleSheet } from 'react-native'
import Identify from '@helper/Identify';

const OrderBilling = (props) => {

    const custom_field_config = Identify.getMerchantConfig().storeview.custom_field_config;

    renderText = (text) => {
        if (text === 'Pay by Card (K-net, Visa, Master Card)') {
            return 'Pay by Card'
        } else return text
    }

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

    let address = props.order.billing_address;
    let couponCode = Identify.__('None');
    if (props.order.coupon_code !== undefined && props.order.coupon_code !== null && props.order.coupon_code !== '') {
        couponCode = props.order.coupon_code;
    }
    return (
        <>
            <View style={{ alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 16, fontWeight: '500', paddingBottom: 15, paddingTop: 20 }}>{Identify.__('Billing Address')}</Text>
                <>
                    {this.renderName(address)}
                    {this.renderBlockBuildingNumber(address)}
                    {this.renderPhone(address)}
                </>
            </View>
            <View style={styles.container}>
                <Text style={{ fontWeight: '500', paddingRight: 8 }}>{Identify.__('Payment Method:')}</Text>
                <Text>{Identify.__(this.renderText(props.order.payment_method))}</Text>
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

export default OrderBilling;