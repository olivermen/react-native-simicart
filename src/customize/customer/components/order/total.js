import React from 'react';
import { View } from 'react-native';
import Total from '../../../checkout/components/totals';

const OrderTotal = (props) => {
    return (
        <View>
            <Total totals={props.order.total} currency_symbol={props.order.total.currency_symbol} />
        </View>
    );
}

export default OrderTotal;