import React from 'react';
import { Text, Icon } from 'native-base';
import { TouchableOpacity, View, findNodeHandle } from 'react-native';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';
import SimiComponent from '@base/components/SimiComponent';
import Events from '@helper/config/events';
import NavigationManager from '@helper/NavigationManager';

class PaymentMethod extends SimiComponent {

    constructor(props) {
        super(props);
        this.selectedPayment = null;
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    scrollToPayment() {
        this.view.measureLayout(
            findNodeHandle(this.props.parent.scrollViewRef),
            (x, y) => {
                this.props.parent.scrollViewRef.scrollTo({ x: 0, y: y, animated: true });
            }
        );
    }

    tracking() {
        let data = {};
        data['event'] = 'checkout_action';
        data['action'] = 'saved_payment_method';
        Events.dispatchEventAction(data, this);
    }

    onSelectPayment(paymentMethod, data) {
        this.tracking();
        this.props.parent.onSaveMethod({
            p_method: {
                ...data,
                method: paymentMethod.payment_method
            }
        });
    }

    openCreditCardPage(paymentMethod) {
        NavigationManager.openPage(this.props.navigation, 'CreditCard', {
            payment: paymentMethod,
            billingAddress: this.props.parent.billingAddressParams,
            shippingAddress: this.props.parent.shippingAddressParams
        });
    }

    renderSelectIcon(selected) {
        if (selected) {
            return (
                <View style={{
                    width: 24,
                    height: 24,
                    borderWidth: 1,
                    borderColor: '#E4531A',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View style={{ width: 14, height: 14, backgroundColor: '#E4531A', borderRadius: 7 }} />
                </View>
            );
        }
        return (
            <View style={{
                width: 24,
                height: 24,
                borderWidth: 1,
                borderColor: '#BABABA',
                backgroundColor: '#FAFAFA',
                borderRadius: 12,
            }} />
        );
    }

    getFieldLabel(code, value) {
        let label = null;
        const custom_field_config = Identify.getMerchantConfig().storeview.custom_field_config;
        try {
            custom_field_config.forEach(field => {
                if (field.code == code) {
                    const options = field.options;
                    options.forEach(element => {
                        if (element.value == value) {
                            label = element.label;
                        }
                    });
                }
            });
        } catch (err) {
            return label;
        }
        return label;
    }

    renderAddress() {
        let billingAddress = this.props.parent.props.data.order.billing_address;
        if (!billingAddress) {
            return null;
        }
        return (
            <View style={{ width: '100%', backgroundColor: '#FAFAFA', borderRadius: 8, borderWidth: 1, borderColor: '#D8D8D8', paddingHorizontal: 15, paddingVertical: 20, marginTop: 15 }}>
                <Text>{billingAddress.firstname} {billingAddress.lastname}</Text>
                <Text>{billingAddress.email}</Text>
                <Text>{billingAddress.block_number}, {billingAddress.house_building_number}, {this.getFieldLabel('address_types', billingAddress.address_types)}, {this.getFieldLabel('area', billingAddress.area)}</Text>
                <Text>{billingAddress.telephone}</Text>
            </View>
        );
    }

    renderCreditCard(paymentMethod) {
        let creditCardNumber = null;
        if (Identify.getCreditCardData()) {
            let savedNumber = Identify.getCreditCardData().cc_number;
            creditCardNumber = savedNumber.substr(savedNumber.length - 4);
            creditCardNumber = '**** ' + creditCardNumber;
        }
        return (
            <TouchableOpacity key={paymentMethod.payment_method} onPress={() => {
                if (Identify.getCreditCardData()) {
                    this.onSelectPayment(paymentMethod, Identify.getCreditCardData())
                } else {
                    this.openCreditCardPage(paymentMethod)
                }
            }}>
                <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#D8D8D8', flex: 1, paddingVertical: 15 }}>
                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                        {this.renderSelectIcon(paymentMethod.p_method_selected)}
                        <View style={{ marginLeft: 10, marginRight: 30 }}>
                            <Text>{Identify.__(paymentMethod.title)}</Text>
                            {creditCardNumber && <Text style={{ fontSize: material.textSizeTiny }}>{creditCardNumber}</Text>}
                        </View>
                        <Icon
                            name='md-create'
                            style={{ fontSize: 20, position: 'absolute', right: 0, marginRight: 10, padding: 5 }}
                            onPress={() => {
                                this.openCreditCardPage(paymentMethod)
                            }} />
                    </View>
                    {paymentMethod.p_method_selected && this.renderAddress()}
                </View>
            </TouchableOpacity>
        );
    }

    renderPaymentItem(paymentMethod, isLastItem) {
        if (paymentMethod.show_type == '1') {
            return (this.renderCreditCard(paymentMethod));
        }
        let showContent = (paymentMethod.hasOwnProperty('content') && paymentMethod.content && paymentMethod.p_method_selected) ? true : false;
        return (
            <TouchableOpacity key={paymentMethod.payment_method} onPress={() => {
                this.onSelectPayment(paymentMethod)
            }}>
                <View style={{ borderBottomWidth: isLastItem ? 0 : 0.5, borderBottomColor: '#D8D8D8', flex: 1, paddingVertical: 15 }}>
                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                        {this.renderSelectIcon(paymentMethod.p_method_selected)}
                        <View style={{ marginLeft: 10 }}>
                            <Text>{Identify.__(paymentMethod.title)}</Text>
                        </View>
                    </View>
                    {paymentMethod.p_method_selected && this.renderAddress()}
                </View>
            </TouchableOpacity>
        )
    }

    createItems() {
        let items = [];
        let data = this.props.parent.props.data.order.payment
        for (let i in data) {
            let paymentMethod = data[i];
            if (paymentMethod.p_method_selected) {
                this.props.parent.selectedPayment = paymentMethod;
            }
            items.push(
                this.renderPaymentItem(paymentMethod, i == data.length - 1)
            );
        }
        return items;
    }

    renderPhoneLayout() {
        return (
            <View ref={ref => this.view = ref} style={{ marginHorizontal: 12 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 16 }}>
                    <Text style={{ fontSize: 18, color: 'white', backgroundColor: 'black', width: 32, height: 32, textAlign: 'center', fontFamily: material.fontBold, paddingTop: 6, borderRadius: 16 }}>{Identify.__('3')}</Text>
                    <Text style={{ fontFamily: material.fontBold, flex: 1, textAlign: 'left', fontSize: 18, marginLeft: 20 }}>{Identify.__('Payment Method')}</Text>
                </View>
                <View style={{ borderWidth: 1, borderRadius: 8, borderColor: '#D8D8D8', paddingHorizontal: 15, paddingVertical: 5 }}>
                    {this.createItems()}
                </View>
            </View >
        );
    }
}

export default PaymentMethod;
