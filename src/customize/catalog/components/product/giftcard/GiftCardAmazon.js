import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native'
import { Text, Toast } from 'native-base';
import material from '@theme/variables/material';
import Identify from '@helper/Identify';
import SimiCart from '@helper/simicart';
import Format from '../price/format';

const GiftCardAmazon = ({ selectedImage, selectedTemplate, message, giftValue }) => {

    let expiredDate = new Date();
    expiredDate.setFullYear(expiredDate.getFullYear() + 1);

    return (
        <View style={{ margin: 12 }}>
            <View style={{ width: '100%', borderWidth: 1, borderColor: '#D8D8D8' }}>
                <Image
                    source={require('../../../../header/DesktopLogoEn.png')}
                    style={{ width: '100%', height: 50, margin: 10 }}
                    resizeMode="contain" />
                <Image
                    source={{ uri: selectedImage }}
                    style={{ width: '100%', aspectRatio: 1 }} />
                {message && <Text style={{ color: selectedTemplate.text_color ?? 'black', fontSize: 18, marginTop: 20, paddingHorizontal: 10 }}>{message}</Text>}
                <View style={{ flexDirection: 'row', paddingVertical: 30, paddingHorizontal: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Format style={{ color: selectedTemplate.style_color ?? 'black', fontSize: 18, fontFamily: material.fontBold }} price={giftValue} />
                        <Text style={{ color: selectedTemplate.style_color ?? 'black', fontSize: 18 }}>GIFT-XXXX-XXXX</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Image source={{ uri: SimiCart.merchant_url + 'pub/media/giftvoucher/template/barcode/default.png' }} style={{ width: '70%', height: 50 }} />
                        <Text style={{ color: selectedTemplate.text_color ?? 'black', marginTop: 10 }}>{expiredDate.toLocaleDateString("en-US")}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

}

export default GiftCardAmazon;