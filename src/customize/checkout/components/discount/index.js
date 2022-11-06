import React from 'react';
import { Text, View } from 'react-native'
import Coupon from './coupon';
import Giftcode from './giftcode';

const Discount = (props) => {
    return (
        <View style={{ borderRadius: 16, backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#D8D8D8', paddingHorizontal: 20, paddingVertical: 30, marginTop: 30, marginHorizontal: 12 }}>
            <Coupon {...props} />
            <View style={{ width: '100%', height: 1, backgroundColor: '#D8D8D8', marginVertical: 20 }} />
            <Giftcode {...props} />
        </View>
    );
}

export default Discount;