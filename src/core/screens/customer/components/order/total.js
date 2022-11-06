import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { Card } from 'native-base';
import Total from '../../../checkout/components/totals';

const OrderTotal = (props) => {
    return (
        <Card style={{ flex: 1 }} key={'total'}>
            <Total totals={props.order.total} currency_symbol={props.order.total.currency_symbol} />
        </Card>
    );
}

export default OrderTotal;