import React from 'react';
import { View } from 'react-native';
import ListQuoteItems from '../../../checkout/components/quoteitem/listOrder';

const OrderSummary = (props) => {

    let items = [];
    let orderItems = props.order.order_items;
    for (let index in orderItems) {
        let item = {
            ...orderItems[index]
        };
        item['qty'] = item.qty_ordered;
        items.push(item);
    }
    return (
        <View>
            <ListQuoteItems list={items} parent={this} />
        </View>
    );
}

export default OrderSummary;