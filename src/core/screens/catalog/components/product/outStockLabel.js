import React from 'react'
import { Text } from 'native-base'
import { StyleSheet } from 'react-native'
import Identify from "../../../../helper/Identify";
import Events from '@helper/config/events';
import md5 from 'md5';

const styles = StyleSheet.create({
    outOfStock: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'red',
        color: 'white',
        padding: 5,
        fontWeight: "bold"
    }
})

const OutStockLabel = (props) => {
    if (Events.events.out_stock_label.length > 0) {
        let item = []
        for (let i = 0; i < Events.events.out_stock_label.length; i++) {
            let label = Events.events.out_stock_label[i];
            if (label.active === true) {
                let key = md5("out_stock_custom" + i);
                let Content = label.content;
                item.push(<Content key={key} />)
            }
        }
        return item;
    } else return <Text style={[styles.outOfStock, Identify.isRtl() ? { left: 0 } : { right: 0 }, props.fontSize ? {fontSize: props.fontSize} : {}]}>{Identify.__('Out of stock')}</Text>
}

export default OutStockLabel;