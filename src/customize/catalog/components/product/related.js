import React, { useState } from 'react';
import { Text } from 'native-base';
import { View } from 'react-native';
import material from '../../../../../native-base-theme/variables/material';
import Identify from '@helper/Identify';
import HorizontalProducts from '../horizontalProducts';

const RelatedProducts = (props) => {
    const [length, setLength] = useState(0)

    const setProductLength = (number) => {
        setLength(number)
    }

    const setItems = (num) => {
        if (num === 0) {
            return ''
        } else if (num === 1) {
            return Identify.__('1 item')
        } else {
            return num + " " + Identify.__('items')
        }
    }

    return (
        <View style={{ backgroundColor: '#FAFAFA', paddingTop: 30, paddingLeft: 12, paddingBottom: 15, marginTop: 30, zIndex: -1 }}>
            <Text style={{ fontSize: 18, fontFamily: material.fontBold, marginBottom: 20 }}>
                {Identify.__('You may also like ')}
                <Text style={{ fontSize: 16, paddingBottom: 2 }}>{Identify.__(`(${setItems(length)})`)}</Text>
            </Text>
            <HorizontalProducts {...props} setProductLength={setProductLength} />
        </View>
    );
}

export default RelatedProducts;

