import React from 'react';
import {
    ScrollView, NativeModules, Platform, KeyboardAvoidingView,
    Animated, Keyboard, Modal, Text, TouchableOpacity, Image
} from 'react-native';
import { Container, Content, View, Toast } from "native-base";
import md5 from 'md5';
import { connect } from 'react-redux';
import Identify from '@helper/Identify';
import Layout from '@helper/config/layout';
import { products } from '@helper/constants';
import variable from '@theme/variables/material';
import material from '@theme/variables/material';
import NewConnection from '@base/network/NewConnection';
import SimiPageComponent from '@base/components/SimiPageComponent';
import Timezones from '../../components/product/giftcard/timezones.json';
import styles from '@screens/catalog/pages/product/styles';

const nativeMethod = Platform.OS === 'ios' ? null : NativeModules.NativeMethodModule;

class Product extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.product = null;
        this.productId = -1;
        this.useDiffLayoutForHorizontal = true;
        this.useTabletLayout = true;
        this.isBack = this.props.navigation.state.params.hasOwnProperty("showBack") ? this.props.navigation.getParam("showBack") : true;
        this.objData = this.props.navigation.state.params.hasOwnProperty('objData') ? this.props.navigation.getParam('objData') : null;
        this.state = {
            ...this.state,
            active: false,
            reRender: false,
            showAlert: false,
            alertMessage: '',
            isError: false,
            showPopup: false,
            qty: 1
        };
        this.paddingInput = new Animated.Value(0);
        this.headerProps = {
            showCart: true
        };
        this.emailFormData = {
            enable: false,
            senderName: undefined,
            recipientName: undefined,
            recipientEmail: undefined,
            customMessage: undefined
        }
        this.notiFormData = {
            enable: false,
            dayToSend: null,
            timezone: Timezones[0].tzCode
        }
        this.giftCardTemplate = {
            template: 0,
            image: 0,
            customImage: false
        }
        this.giftCardAmount = undefined;
    }

    updateQty(qty){
        this.addToCart.updateQty(qty)
    }

    componentWillMount() {
        if (Platform.OS === 'ios') {
            this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
            this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
        }
        if (!this.checkExistData() && !this.objData) {
            this.showLoading('full');
        }
    }

    componentDidMount() {
        super.componentDidMount();
        if (!this.product) {
            new NewConnection()
                .init(products + '/' + this.productId, 'get_product_data', this)
                .connect();
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (Platform.OS === 'ios') {
            this.keyboardWillShowSub.remove();
            this.keyboardWillHideSub.remove();
        }
        if (nativeMethod && this.product && this.product.name) {
            nativeMethod.endLog(this.product.name, this.product.simi_seo_url);
        }
    }

    setData(data) {
        this.product = data.product;
        this.dataTracking = {
            product: data.product
        }
        if (nativeMethod) {
            nativeMethod.startLog(this.product.name, this.product.simi_seo_url);
        }
        this.state.reRender = true;
        let productData = {};
        productData[data.product.entity_id] = data.product;
        this.showLoading('none', false);
        this.props.storeData('add_product_details_data', productData);
    }

    checkExistData() {
        this.productId = this.props.navigation.getParam("productId");
        let data = this.props.data;
        if (data && data.hasOwnProperty(this.productId)) {
            this.product = data[this.productId];
            this.state.reRender = true;
            return true;
        }
        return false;
    }

    createRef(id) {
        switch (id) {
            case 'default_name_price':
                return ref => (this.namePrices = ref);
            case 'default_option':
                return ref => (this.options = ref);
            case 'default_add_to_cart':
                return ref => (this.addToCart = ref);
            case 'default_image_slider':
                return ref => (this.images = ref);
            default:
                return undefined;
        }
    }

    handleAlert = (mess, err = false) => {
        this.setState({
            showAlert: true, alertMessage: mess, isError: err
        }, () => {
            setTimeout(() => {
                this.setState({ showAlert: false, alertMessage: '', isError: false })
            }, 3000)
        })
    }

    showPopupError = (status) => {
        this.setState({ showPopup: status })
    }

    addMorePropsToComponent(element) {
        return {
            product: this.product ? this.product : this.objData,
            onRef: this.createRef(element.id),
            navigation: this.props.navigation,
            is_loaded: this.product ? true : false
        };
    }

    keyboardWillShow = (event) => {
        Animated.timing(this.paddingInput, {
            duration: event.duration,
            toValue: 80,
        }).start();
    };

    keyboardWillHide = (event) => {
        Animated.timing(this.paddingInput, {
            duration: event.duration,
            toValue: 0,
        }).start();
    };

    renderPopupRangeError = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.showPopup}
                style={{ flex: 1 }}
            >
                <View activeOpacity={1} style={{ flex: 1, justifyContent: 'center', backgroundColor: '#00000033' }}>
                    <View style={{ margin: 20, backgroundColor: "#fff", borderRadius: 15, padding: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{Identify.__("Attention")}</Text>
                            <TouchableOpacity style={styles.close} onPress={() => this.showPopupError(false)}>
                                <Image source={require('../../../../customize/icon/icon-close.png')} style={{ width: 18, height: 18 }} />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ color: 'gray', paddingTop: 10 }}>{Identify.__("Please choose the value correctly!")}</Text>
                        <TouchableOpacity
                            style={{ width: '34%', height: 45, borderRadius: 8, backgroundColor: '#E4531A', alignItems: 'center', justifyContent: 'center', marginTop: 30, alignSelf: 'flex-end' }}
                            onPress={() => this.showPopupError(false)}
                        >
                            <Text style={{ fontSize: 16, color: '#fff', fontWeight: '500' }}>{Identify.__("OK")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    renderPhoneLayout() {
        if (this.product || this.objData) {
            let containerLayout = this.renderLayoutFromConfig('product_layout', 'container');
            if (Platform.OS === 'ios') {
                containerLayout = (
                    <Animated.View style={{ marginBottom: this.paddingInput }}>
                        {containerLayout}
                    </Animated.View>
                );
            }
            let phoneLayout = (
                <Container style={{ backgroundColor: variable.appBackground }}>
                    <Content>
                        <View style={styles.scroll}>
                            {this.renderLayoutFromConfig('product_layout', 'content')}
                        </View>
                    </Content>
                    {containerLayout}
                    {this.renderPopupRangeError()}
                </Container>
            );
            if (Platform.OS === 'ios') {
                phoneLayout = (
                    <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
                        {phoneLayout}
                    </KeyboardAvoidingView>
                );
            }
            return (phoneLayout)
        }
        return null;
    }

    renderTabletLayout() {
        return (
            <Container>
                {this.renderPhoneLayout()}
            </Container>
        );
    }

    renderTabletHorizontalLayoutFromConfig() {
        let containerLeftcomponents = [];
        let containerRightcomponents = [];
        let contentLeftcomponents = [];
        let contentRightcomponents = [];

        let containerKey = 'container';
        while (true) {
            let containers = Layout.layout.product_layout[containerKey];
            for (let i = 0; i < containers.length; i++) {
                let element = containers[i];
                if (element.active == true) {
                    let key = md5('product_layout' + i);
                    let Content = element.content;
                    let position = element.position;
                    let props = {
                        parent: this,
                        navigation: this.props.navigation,
                        key: key,
                        ...element.data,
                        ...this.addMorePropsToComponent(element)
                    };
                    if (containerKey === 'container') {
                        if (position === 'left') {
                            containerLeftcomponents.push(<Content {...props} />);
                        } else if (position === 'right') {
                            containerRightcomponents.push(<Content {...props} />);
                        }
                    } else if (containerKey === 'content') {
                        if (position === 'left') {
                            contentLeftcomponents.push(<Content {...props} />);
                        } else if (position === 'right') {
                            contentRightcomponents.push(<Content {...props} />);
                        }
                    }
                }
            };
            if (containerKey === 'container') {
                containerKey = 'content';
            } else {
                break;
            }
        }

        return [containerLeftcomponents, containerRightcomponents, contentLeftcomponents, contentRightcomponents];
    }

    renderTabletHorizontalLayout() {
        if (this.product || this.objData) {
            [containerLeftcomponents, containerRightcomponents, contentLeftcomponents, contentRightcomponents] = this.renderTabletHorizontalLayoutFromConfig();
            return (
                <Container style={{ backgroundColor: variable.appBackground }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 5, paddingBottom: 10 }}>
                            {contentLeftcomponents}
                        </View>
                        <View style={{ flex: 4, paddingBottom: 60 }}>
                            <ScrollView style={styles.scroll}>
                                {contentRightcomponents}
                            </ScrollView>
                            {containerRightcomponents}
                        </View>
                    </View>
                </Container>
            );
        } else {
            return null;
        }
    }

    getOptionParams() {
        if (this.product.type_id == 'giftvoucher') {
            const { gift_value, gift_from, giftcard_templates } = this.product;
            let params = {};
            if (!this.giftCardAmount) {
                params['amount'] = parseFloat(gift_value ?? gift_from);
            } else {
                params['amount'] = this.giftCardAmount;
            }
            if (giftcard_templates && giftcard_templates.length > 0) {
                const selectedTemplate = giftcard_templates[this.giftCardTemplate.template];
                const images = selectedTemplate.images.split(',');
                const useCustomImage = this.giftCardTemplate.image == -1 && this.giftCardTemplate.customImage;
                params['giftcard_template_id'] = selectedTemplate.giftcard_template_id;
                params['giftcard_template_image'] = useCustomImage ? this.giftCardTemplate.customImage.image_name : images[this.giftCardTemplate.image];
                if (useCustomImage) {
                    params['giftcard_use_custom_image'] = '1';
                }
            }
            if (this.emailFormData.enable) {
                if (!this.emailFormData.recipientName || !this.emailFormData.recipientEmail) {
                    Toast.show({
                        text: Identify.__('Please fill all required fields'),
                        type: 'danger',
                        textStyle: { fontFamily: material.fontFamily },
                        duration: 3000
                    });
                    return null;
                }
                if (!Identify.validateEmail(this.emailFormData.recipientEmail)) {
                    Toast.show({
                        text: Identify.__('Recipient email is not valid'),
                        type: 'danger',
                        textStyle: { fontFamily: material.fontFamily },
                        duration: 3000
                    });
                    return null;
                }
                params['send_friend'] = this.emailFormData.enable ? '1' : '0';
                params['customer_name'] = this.emailFormData.senderName;
                params['recipient_name'] = this.emailFormData.recipientName;
                params['recipient_email'] = this.emailFormData.recipientEmail;
                params['message'] = this.emailFormData.customMessage;
            }
            if (this.notiFormData.enable) {
                if (!this.notiFormData.dayToSend) {
                    Toast.show({
                        text: Identify.__('Please fill all required fields'),
                        type: 'danger',
                        textStyle: { fontFamily: material.fontFamily },
                        duration: 3000
                    });
                    return null;
                }
                params['notify_success'] = this.notiFormData.enable ? '1' : '0';
                params['day_to_send'] = this.notiFormData.dayToSend;
                params['timezone_to_send'] = this.notiFormData.timezone;
            }
            return params;
        } else if (this.options) {
            return this.options.getParams();
        }
        return null;
    }

    updatePrices(newPrices) {
        this.namePrices.updatePrices(newPrices);
        this.addToCart.updatePrices(newPrices);
    }

    getCheckoutQty() {
        return this.namePrices.getCheckoutQty();
    }

    changeGiftCardTemplate(template, image, customImage) {
        this.images.changeGiftCardTemplate(template, image, customImage);
        this.giftCardTemplate = {
            template: template,
            image: image
        }
        if (customImage) {
            this.giftCardTemplate['customImage'] = customImage;
        }
    }

    updateEmailForm(emailFormData) {
        this.images.updateEmailForm(emailFormData);
        this.emailFormData = emailFormData;
    }

    updateNotiForm(notiFormData) {
        this.notiFormData = notiFormData;
    }

    updateGiftValue(value) {
        this.giftCardAmount = value;
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.product_details_data, storeview: state.redux_data.merchant_configs.storeview.base };
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
