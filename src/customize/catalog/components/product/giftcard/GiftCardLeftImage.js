import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native'
import { Text, Toast } from 'native-base';
import material from '@theme/variables/material';
import Identify from '@helper/Identify';
import SimiCart from '@helper/simicart';
import Format from '../price/format';

const GiftCardLeftImage = ({ selectedImage, selectedTemplate, from = '', to = '', message = '', giftValue }) => {

    let expiredDate = new Date();
    expiredDate.setFullYear(expiredDate.getFullYear() + 1);

    return (
        <View style={{ margin: 12 }}>
            <View style={{ width: '100%', borderWidth: 1, borderColor: '#D8D8D8', flexDirection: 'row' }}>
                <Image
                    source={{ uri: selectedImage }}
                    style={{ width: '37%', aspectRatio: 1 }}
                    resizeMode="contain" />
                <View style={{ width: '62%', paddingHorizontal: 10 }}>
                    <Image
                        source={require('../../../../header/DesktopLogoEn.png')}
                        style={{ width: '100%', height: 40, margin: 10 }}
                        resizeMode="contain" />
                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <Text style={{ fontFamily: material.fontBold, color: selectedTemplate.text_color ?? 'black' }}>{Identify.__('From')}:</Text>
                        <Text style={{ color: selectedTemplate.style_color ?? 'black', marginLeft: 10 }}>{from}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text style={{ fontFamily: material.fontBold, color: selectedTemplate.text_color ?? 'black' }}>{Identify.__('To')}:</Text>
                        <Text style={{ color: selectedTemplate.style_color ?? 'black', marginLeft: 10 }}>{to}</Text>
                    </View>
                    <View style={{ borderWidth: 1, borderColor: 'rgb(204, 204, 204)', borderRadius: 5, marginTop: 10, padding: 10, height: 75 }}>
                        <Text style={{ color: selectedTemplate.text_color ?? 'black' }}>{message}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 10 }}>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Format style={{ color: selectedTemplate.style_color ?? 'black', fontSize: 18, fontFamily: material.fontBold }} price={giftValue} />
                        </View>
                        <View style={{ flex: 2, alignItems: 'flex-end' }}>
                            <Text style={{ color: selectedTemplate.style_color ?? 'black' }}>GIFT-XXXX-XXXX</Text>
                            <Image source={{ uri: SimiCart.merchant_url + 'pub/media/giftvoucher/template/barcode/default.png', marginTop: 5 }} style={{ width: '70%', height: 50 }} />
                            <Text style={{ color: selectedTemplate.text_color ?? 'black', marginTop: 5 }}>{expiredDate.toLocaleDateString("en-US")}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

}

export default GiftCardLeftImage;