import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify';
import styles from './listStyles';

const OrderBilling = (props) => {

    const openOrderHistoryDetail = () => {
        NavigationManager.openPage(props.navigation, 'OrderHistoryDetail', {
            orderId: props.order.entity_id,
            order: props.order
        });
    }

    const convertDate = (data) => {
        let date = new Date(data.slice(0, 10));
        return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear()
    }

    function renderOrderNumber() {
        return (
            <View style={styles.flex}>
                <View style={styles.dot} />
                <Text style={styles.txtOrderNum}>{props.order.increment_id}</Text>
            </View>
        );
    }

    return (
        <View style={styles.card} key={props.order.entity_id}>
            <View style={styles.row1}>
                {renderOrderNumber()}
                <Text>{Identify.__(props.order.status)}</Text>
            </View>
            <Text style={{ color: '#747474', paddingBottom: 6 }}>{convertDate(props.order.updated_at)}</Text>
            <View style={[styles.flex, { justifyContent: 'flex-start' }]}>
                <Text>{Identify.__('Total')}:</Text>
                <Text style={{ fontWeight: '500', paddingLeft: 6 }}>{Identify.formatPriceWithCurrency(props.order.total.grand_total_incl_tax, props.order.total.currency_symbol)}</Text>
            </View>
            <TouchableOpacity style={styles.btnViewOrder} onPress={() => { openOrderHistoryDetail() }}>
                <Text style={styles.txtViewOrder} >{Identify.__('View order')}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default OrderBilling;