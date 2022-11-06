import React, { useState } from 'react';
import { Image, View, TextInput, StyleSheet, Dimensions } from 'react-native'
import { Text, Picker, Header, Left, Button, Icon, Title, Body, Right } from 'native-base';
import material from '@theme/variables/material';
import Identify from '@helper/Identify';

const GiftValueDropdown = ({ product, updatePrices, updateGiftValue }) => {

    const { gift_value, gift_dropdown, gift_price, gift_price_type, app_prices, gift_from } = product;
    const [value, setValue] = useState(parseFloat(gift_value ?? gift_from));

    const giftValueArray = gift_dropdown.split(',');

    if (giftValueArray.length == 0) {
        return null;
    }

    const onSelectValue = (selectedValue) => {
        let priceValue = parseFloat(gift_price);
        if (gift_price_type == '3') {
            priceValue = priceValue * selectedValue/100;
        } else if(gift_price_type == '1') {
            priceValue = selectedValue;
        }
        setValue(selectedValue);
        updatePrices({
            ...app_prices,
            price: priceValue
        })
        updateGiftValue(selectedValue)
    }

    const giftValueOptions = giftValueArray.map(itemValue => {
        return (
            <Picker.Item
                style={{ fontFamily: material.fontFamily }}
                key={itemValue}
                value={parseFloat(itemValue)}
                label={itemValue}
                color={material.textColor} />
        );
    })

    return (
        <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontFamily: material.fontBold, marginRight: 20 }}>{Identify.__('Select Value')}</Text>
            <Picker
                renderHeader={backAction =>
                    <Header style={{
                        backgroundColor: Identify.theme.app_background,
                        elevation: 0,
                        height: this.toolbarHeight,
                        paddingTop: this.paddingTop
                    }}>
                        <Left>
                            <Button transparent onPress={backAction}>
                                <Icon name={"md-close"} style={{ color: Identify.theme.textColor }} />
                            </Button>
                        </Left>
                        <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                            <Title style={{ color: Identify.theme.textColor }}>{Identify.__('Select a gift value')}</Title>
                        </Body>
                        <Right />
                    </Header>}
                mode="dropdown"
                iosIcon={<Icon name="ios-arrow-down" style={{ color: material.textColor }} />}
                selectedValue={value}
                onValueChange={onSelectValue}
                style={{ width: 123, height: 50, backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#D8D8D8', borderRadius: 8 }}
                itemTextStyle={{ color: material.textColor, fontFamily: material.fontFamily }}
                textStyle={{ color: material.textColor, fontFamily: material.fontBold, textAlign: 'center' }}>
                {giftValueOptions}
            </Picker>
        </View>
    );

}

export default GiftValueDropdown;