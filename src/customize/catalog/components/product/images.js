import React from 'react';
import SimiComponent from "@base/components/SimiComponent";
import { Card, Text } from 'native-base';
import { TouchableOpacity, Image, View } from 'react-native';
import Swiper from 'react-native-swiper';
import NavigationManager from '@helper/NavigationManager';
import Device from '@helper/device';
import Events from '@helper/config/events';
import Identify from '@helper/Identify';
import md5 from 'md5';
import material from '@theme/variables/material';
import GiftCardAmazon from './giftcard/GiftCardAmazon';
import GiftCardLeftImage from './giftcard/GiftCardLeftImage';
import SimiCart from '@helper/simicart';

export default class ProductImagesComponent extends SimiComponent {
    constructor(props) {
        super(props)
        this.index = 0;
        this.state = {
            ... this.state,
            showSwiper: false,
            giftCardTemplate: 0,
            giftCardImage: 0,
            giftCustomImage: null,
            giftValue: this.props.product.app_prices.price,
            emailForm: {
                senderName: undefined,
                recipientName: undefined,
                recipientEmail: undefined,
                customMessage: undefined
            }
        }
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }
    }
    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined)
        }
    }

    componentWillMount() {
        setTimeout(() => { this.setState({ showSwiper: true }) }, 500);
    }

    changeGiftCardTemplate(template, image, customImage) {
        this.setState({
            giftCardTemplate: template,
            giftCardImage: image,
            customImage: customImage ? customImage : this.state.customImage
        });
    }

    updateEmailForm(emailFormData) {
        this.setState({
            emailForm: emailFormData
        });
    }

    tracking() {
        let params = {};
        params['event'] = 'product_action';
        params['action'] = 'showed_images_screen';
        params['product_name'] = this.props.product.name;
        params['product_id'] = this.props.product.entity_id;
        params['sku'] = this.props.product.sku;
        Events.dispatchEventAction(params, this);
    }

    onSelectImage(image) {
        NavigationManager.openPage(this.props.navigation, 'FullImage', {
            images: this.props.product.images,
            index: image
        });
    }

    renderImages() {
        let images = [];
        let data = JSON.parse(JSON.stringify(this.props.product.images));
        for (let i in data) {
            let image = data[i];
            image['simi_index'] = i;
            images.push(
                <TouchableOpacity
                    onPress={() => this.onSelectImage(i)}
                    key={image.position}
                    style={{ flex: 1 }}
                >
                    <Image resizeMode='contain' source={!image.url.includes('placeholder') ? { uri: image.url } : require('../../../icon/logo.png')}
                        style={{ width: '100%', height: '100%' }} />
                </TouchableOpacity>
            );
            i++;
        }
        return images;
    }

    renderZoom() {
        return (
            <TouchableOpacity
                onPress={() => { this.props.product ? this.onSelectImage(this.index + 1) : {} }}
                style={{
                    position: 'absolute',
                    zIndex: 99,
                    right: 10,
                    top: 10,
                    width: '7%',
                    height: '7%'
                }}
            >
                <Image style={{ width: '100%', height: '100%', aspectRatio: 1, tintColor: '#b4b4b4' }} source={require('@media/scale-symbol.png')} />
            </TouchableOpacity>
        )
    }

    renderSpecialPriceLabel() {
        let saleOff = null;
        let price = this.props.product.app_prices;
        if (price.has_special_price !== null && price.has_special_price === 1) {
            if (price.show_ex_in_price != null && price.show_ex_in_price == 1) {
                saleOff = 100 - (price.price_including_tax.price / price.regular_price) * 100;
                saleOff = saleOff.toFixed(0);
            } else {
                saleOff = 100 - (price.price / price.regular_price) * 100;
                saleOff = saleOff.toFixed(0);
            }
        }
        let showLabel = Identify.getMerchantConfig().storeview.catalog.frontend.show_discount_label_in_product;
        if (saleOff) {
            if (showLabel && showLabel !== '1') {
                return null;
            }
            return (
                <View
                    style={{
                        position: 'absolute',
                        zIndex: 99,
                        left: 10,
                        top: 10,
                        backgroundColor: 'white',
                        borderRadius: 4,
                        borderColor: '#f0f0f0',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 2,
                        padding: 5
                    }}
                >
                    <Text style={{ color: Identify.theme.button_background, fontFamily: material.fontBold, textAlign: 'center' }}>{saleOff + '% ' + Identify.__('OFF')}</Text>
                </View>
            )
        }
    }

    // componentDidMount() {
    //     setTimeout(() => {
    //         this.forceUpdate()
    //     }, 400);
    // }

    renderPhoneLayout() {
        if (this.props.product == null) {
            return (null);
        }
        if (this.props.product.type_id == 'giftvoucher' && this.props.product.gift_card_type == '2'
            && this.props.product.is_salable == '1' && this.props.product.giftcard_templates
            && this.props.product.giftcard_templates.length > 0) {
            const selectedTemplate = this.props.product.giftcard_templates[this.state.giftCardTemplate];
            const images = selectedTemplate.images.split(',');
            let selectedImage = '';
            if (this.state.giftCardImage == -1) {
                selectedImage = this.state.customImage.url;
            } else {
                selectedImage = SimiCart.merchant_url + 'pub/media/giftvoucher/template/images/' + images[this.state.giftCardImage];
            }
            if (selectedTemplate.design_pattern == 'amazon-giftcard-01') {
                return <GiftCardAmazon
                    selectedImage={selectedImage}
                    selectedTemplate={selectedTemplate}
                    giftValue={this.state.giftValue}
                    message={this.state.emailForm.customMessage}
                />
            } else if (selectedTemplate.design_pattern == 'left-image-giftcard-240x360px') {
                return <GiftCardLeftImage
                    selectedImage={selectedImage}
                    selectedTemplate={selectedTemplate}
                    giftValue={this.state.giftValue}
                    message={this.state.emailForm.customMessage}
                    from={this.state.emailForm.senderName}
                    to={this.state.emailForm.recipientName} />
            }
        }
        return (
            <View style={{ width: '100%', aspectRatio: 1 }}>
                {this.state.showSwiper ? <Swiper
                    onIndexChanged={(index) => {
                        this.index = index
                    }}
                    key={this.props.product.images.length}
                    horizontal={true}
                    renderPagination={(index, total, context) => {
                        return (
                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E4531A', borderRadius: 12, paddingVertical: 5, paddingHorizontal: 10, alignSelf: 'center' }}>
                                <Image source={require('../../../icon/icon-image.png')} style={{ width: 14, height: 11 }} />
                                <Text style={{ fontSize: 12, color: 'white', marginLeft: 10, paddingTop: 2 }}>{index + 1}/{total}</Text>
                            </View>
                        );
                    }}>
                    {this.renderImages()}
                </Swiper> : null}
            </View>
        );
    }
}
