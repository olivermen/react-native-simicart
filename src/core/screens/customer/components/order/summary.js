import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { Card, CardItem, Text } from 'native-base';
import Identify from '@helper/Identify';
import styles from './detailStyles';
import material from '@theme/variables/material';

const OrderSummary = (props) => {

    function renderOrderNumber() {
        return (
            <CardItem>
                <Text style={[styles.title, { fontFamily: material.fontBold }]}>{Identify.__('Order #')}</Text>
                <Text>{props.order.increment_id}</Text>
            </CardItem>
        );
    }

    function renderDate() {
        return (
            <CardItem>
                <Text style={[styles.title, { fontFamily: material.fontBold }]}>{Identify.__('Date')}</Text>
                <Text>{props.order.updated_at}</Text>
            </CardItem>
        );
    }

    function renderOrderTotal() {
        return (
            <CardItem>
                <Text style={[styles.title, { fontFamily: material.fontBold }]}>{Identify.__('Order Total')}</Text>
                <Text>{Identify.formatPriceWithCurrency(props.order.total.grand_total_incl_tax, props.order.total.currency_symbol)}</Text>
            </CardItem>
        );
    }

    return (
        <Card style={{ flex: 1 }} key={'base'}>
            {renderOrderNumber()}
            {renderDate()}
            {renderOrderTotal()}
        </Card>
    );
}

export default OrderSummary;