import React from 'react';
import { connect } from 'react-redux';
import NewConnection from '@base/network/NewConnection';
import { products } from '@helper/constants';
import { Container, Content, View } from "native-base";
import { ScrollView, NativeModules, Platform, KeyboardAvoidingView, Animated, Keyboard } from 'react-native';
import SimiPageComponent from '@base/components/SimiPageComponent';
import styles from './styles';
import md5 from 'md5';
import Layout from '@helper/config/layout';
import variable from '@theme/variables/material';

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
            reRender: false
        };
        this.paddingInput = new Animated.Value(0);
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
            default:
                return undefined;
        }
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
        if (this.options) {
            return this.options.getParams();
        }
        return null;
    }

    updatePrices(newPrices) {
        this.namePrices.updatePrices(newPrices);
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
