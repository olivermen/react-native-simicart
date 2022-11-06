import React from 'react';
import { View, TextInput } from 'react-native'
import { Text } from 'native-base';
import material from '@theme/variables/material';
import Identify from '@helper/Identify';
import Format from '../price/format';

const GiftValueRange = ({ product, updatePrices, updateGiftValue, showPopupError }) => {
    const { gift_value, gift_price, gift_price_type, app_prices, gift_from, gift_to } = product;

    const onSubmitValue = (text) => {
        const valueSubmit = parseFloat(text);
        if (valueSubmit <= parseFloat(gift_to) && valueSubmit >= parseFloat(gift_from)) {
            let priceValue = parseFloat(gift_price);
            if (gift_price_type == '3') {
                priceValue = priceValue * valueSubmit / 100;
            } else if (gift_price_type == '1') {
                priceValue = valueSubmit;
            }
            updatePrices({
                ...app_prices,
                price: priceValue
            })
            updateGiftValue(valueSubmit)
        } else {
            showPopupError(true)
        }
    }

    return (
        <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontFamily: material.fontBold, marginRight: 20 }}>{Identify.__('Enter Value')}</Text>
            <View>
                <TextInput
                    style={{
                        width: 153,
                        height: 50,
                        color: '#000000',
                        alignItems: 'center',
                        fontFamily: material.fontBold,
                        fontSize: 16,
                        backgroundColor: '#FAFAFA',
                        borderWidth: 1,
                        borderColor: '#D8D8D8',
                        borderRadius: 8,
                        paddingHorizontal: 10
                    }}
                    keyboardType="numeric"
                    returnKeyType="done"
                    onSubmitEditing={({ nativeEvent: { text, eventCount, target } }) => {
                        onSubmitValue(text);
                    }}
                    defaultValue={parseFloat(gift_from).toString()}
                    underlineColorAndroid="transparent" />
                <Text style={{ marginTop: 5 }}>
                    (<Format price={gift_from} type='noSeperator' />{' - '}
                    <Format price={gift_to} type='noSeperator' />)
                </Text>
            </View>
        </View>
    );

}

export default GiftValueRange;