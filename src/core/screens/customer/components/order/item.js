import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { TouchableOpacity } from 'react-native';
import { Card, CardItem, Text } from 'native-base';
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify';
import styles from './listStyles';
import material from '@theme/variables/material';

const OrderBilling = (props) => {
    const openOrderHistoryDetail = () => {
        NavigationManager.openPage(props.navigation, 'OrderHistoryDetail', {
            orderId: props.order.entity_id,
            order: props.order
        });
    }

    const renderShipTo = (shipping) => {
        let shipTo = '';
        if (shipping.prefix !== undefined && shipping.prefix !== '' && shipping.prefix !== null) {
            shipTo += shipping.prefix;
        }

        if (shipping.firstname !== undefined && shipping.firstname !== '' && shipping.firstname !== null) {
            shipTo += ' ' + shipping.firstname;
        }

        if (shipping.lastname !== undefined && shipping.lastname !== '' && shipping.lastname !== null) {
            shipTo += ' ' + shipping.lastname;
        }

        if (shipping.suffix !== undefined && shipping.suffix !== '' && shipping.suffix !== null) {
            shipTo += ' ' + shipping.suffix;
        }

        return shipTo;
    }

    function renderOrderNumber() {
        return (
            <CardItem listItemPadding={0}>
                <Text style={[styles.title, { fontFamily: material.fontBold }]}>{Identify.__('Order #')}</Text>
                <Text>{props.order.increment_id}</Text>
            </CardItem>
        );
    }

    function renderDate() {
        return (
            <CardItem listItemPadding={0}>
                <Text style={[styles.title, { fontFamily: material.fontBold }]}>{Identify.__('Date')}</Text>
                <Text>{props.order.updated_at}</Text>
            </CardItem>
        );
    }

    function renderShipping() {
        return (
            <CardItem listItemPadding={0}>
                <Text style={[styles.title, { fontFamily: material.fontBold }]}>{Identify.__('Ship To')}</Text>
                <Text>{renderShipTo(props.order.shipping_address)}</Text>
            </CardItem>
        );
    }

    function renderOrderTotal() {
        return (
            <CardItem listItemPadding={0}>
                <Text style={[styles.title, { fontFamily: material.fontBold }]}>{Identify.__('Order Total')}</Text>
                <Text>{Identify.formatPriceWithCurrency(props.order.total.grand_total_incl_tax, props.order.total.currency_symbol)}</Text>
            </CardItem>
        );
    }

    function renderStatus() {
        return (
            <CardItem listItemPadding={0}>
                <Text style={[styles.title, { fontFamily: material.fontBold }]}>{Identify.__('Status')}</Text>
                <Text>{Identify.__(props.order.status)}</Text>
            </CardItem>
        );
    }

    function renderItem() {
        return (
            <Card style={{ flex: 1 }} key={props.order.entity_id}>
                {renderOrderNumber()}
                {renderDate()}
                {renderShipping()}
                {renderOrderTotal()}
                {renderStatus()}
            </Card>
        );
    }

    return (
        <TouchableOpacity style={{ flex: 1 }}
            onPress={() => {
                openOrderHistoryDetail();
            }}>
            {renderItem()}
        </TouchableOpacity>
    );
}

export default OrderBilling;