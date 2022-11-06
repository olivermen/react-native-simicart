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
                <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#EDEDED', flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}>
                    <Icon name={paymentMethod.p_method_selected ? 'ios-checkmark-circle-outline' : 'ios-radio-button-off'} />
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
            </TouchableOpacity>
        );
    }

    renderPaymentItem(paymentMethod) {
        if (paymentMethod.show_type == '1') {
            return (this.renderCreditCard(paymentMethod));
        }
        let showContent = (paymentMethod.hasOwnProperty('content') && paymentMethod.content && paymentMethod.p_method_selected) ? true : false;
        return (
            <TouchableOpacity key={paymentMethod.payment_method} onPress={() => {
                this.onSelectPayment(paymentMethod)
            }}>
                <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#EDEDED', flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}>
                    <Icon name={paymentMethod.p_method_selected ? 'ios-checkmark-circle-outline' : 'ios-radio-button-off'} />
                    <View style={{ marginLeft: 10 }}>
                        <Text>{Identify.__(paymentMethod.title)}</Text>
                        {showContent && <Text style={{ fontSize: material.textSizeTiny }}>{paymentMethod.content}</Text>}
                    </View>
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
                this.renderPaymentItem(paymentMethod)
            );
        }
        return items;
    }

    renderPhoneLayout() {
        return (
            <View ref={ref => this.view = ref}>
                <Text style={{ fontFamily: material.fontBold, flex: 1, backgroundColor: material.sectionColor, paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10, textAlign: 'left' }}>{Identify.__(this.props.title)}</Text>
                {this.createItems()}
            </View>
        );
    }
}

export default PaymentMethod;
