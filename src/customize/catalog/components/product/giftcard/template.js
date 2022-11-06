import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native'
import { Icon, Text, Toast } from 'native-base';
import material from '@theme/variables/material';
import Identify from '@helper/Identify';
import SimiCart from '../../../../../core/helper/simicart';
import { launchImageLibrary } from 'react-native-image-picker';
import EmailFriend from './EmailFriend';
import ImgToBase64 from 'react-native-image-base64';
import RNFS from 'react-native-fs'

const options = {
    mediaType: 'photo',
    includeBase64: true,
    maxWidth: 600,
    maxHeight: 365
};

const GiftCardTemplate = ({ product, updateImages, updateEmailFormData, updateNotiForm, uploadGiftImage, giftCustomImage, selectedTemplate, selectedImage }) => {

    const { giftcard_templates, gift_card_type, is_salable } = product;

    if (!giftcard_templates || giftcard_templates.length == 0 || is_salable == '0' || gift_card_type == '1') {
        return null;
    }

    const showUpLoad = () => {
        launchImageLibrary(options, (response) => {
            if (response && response.assets && response.assets.length > 0) {
                const image = response.assets[0];
                uploadGiftImage({
                    base64_encoded_data: image.base64,
                    name: image.fileName,
                    type: image.type
                });
            }
        });
    }

    const renderImages = () => {
        const template = giftcard_templates[selectedTemplate];
        const images = template.images.split(',');
        return images.map((image, index) => {
            return (
                <View
                    key={index}
                    style={{ width: '33%', paddingRight: 10 }}>
                    <TouchableOpacity
                        style={{ width: '100%', height: 72, padding: 3, borderWidth: 1, borderColor: (index == selectedImage) ? '#E4531A' : 'white', marginTop: 10 }}
                        onPress={() => {
                            updateImages(selectedTemplate, index);
                        }}>
                        <Image
                            source={{ uri: SimiCart.merchant_url + 'pub/media/giftvoucher/template/images/' + image }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain" />
                    </TouchableOpacity>
                </View>
            );
        })
    }

    const template = giftcard_templates.map((item, index) => {
        return (
            <TouchableOpacity
                key={item.giftcard_template_id}
                style={{ alignItems: 'center', justifyContent: 'center', padding: 10, borderWidth: 1, borderColor: index == selectedTemplate ? '#E4531A' : '#D8D8D8', marginRight: 10, marginTop: 10 }}
                onPress={() => {
                    if (index != selectedTemplate) {
                        updateImages(index, 0);
                    }
                }}>
                <Text>{Identify.__(item.template_name)}</Text>
            </TouchableOpacity>
        );
    });

    return (
        <View style={{ marginTop: 15 }}>
            <Text style={{ fontSize: 16, fontFamily: material.fontBold }}>{Identify.__('Select a template')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                {template}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                {renderImages()}
            </View>
            <Text style={{ fontSize: 16, marginTop: 15 }}><Text style={{ fontSize: 16, fontFamily: material.fontBold }}>{Identify.__('Or upload your photo')}</Text> {Identify.__('Recommended size: 600x365 Support gif, jpg, png files. Max file supported: 500 KB)')}</Text>
            <View style={{ flexDirection: 'row' }}>
                {giftCustomImage && <TouchableOpacity
                    style={{ width: 72, height: 72, padding: 3, borderWidth: 1, borderColor: (selectedImage == -1) ? '#E4531A' : 'white', marginRight: 10 }}
                    onPress={() => {
                        updateImages(selectedTemplate, -1);
                    }}>
                    <Image
                        source={{ uri: giftCustomImage.url }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="contain" />
                </TouchableOpacity>}
                <TouchableOpacity
                    style={{ borderWidth: 1, borderColor: '#D8D8D8', marginTop: 5, width: 72, height: 72, alignItems: 'center', justifyContent: 'center' }}
                    onPress={showUpLoad}>
                    <Icon name="md-images" style={{ fontSize: 40 }} />
                </TouchableOpacity>
            </View>
            <EmailFriend
                submitEmailFormData={(formData) => {
                    updateEmailFormData(formData);
                }}
                submitNotiFormData={(formData) => {
                    updateNotiForm(formData);
                }} />
        </View>
    );

}

export default GiftCardTemplate;