import React from 'react';
import { connect } from 'react-redux';
import SimiPageComponent from '@base/components/SimiPageComponent';
import { Container, Content, Button, Text, Toast, Icon } from 'native-base';
import { View, TouchableOpacity } from 'react-native';
import Identify from "@helper/Identify";
import SimiForm from '@base/components/form/SimiForm';
import DropDownInput from '@base/components/form/DropDownInput';
import FloatingInput from '@base/components/form/FloatingInput';
import CardType from '../components/checkout/CardTypeInput';
import { month } from '@helper/constants';
import variable from '@theme/variables/material';
import { onepage } from '@helper/constants';
import NewConnection from "@base/network/NewConnection";
import NavigationManager from '@helper/NavigationManager';
import AppStorage from '../../../helper/storage';
import { CardIOModule, CardIOUtilities } from 'react-native-awesome-card-io';
import material from "@theme/variables/material";
import CreditCardSubmit from '../components/checkout/CreditCardSubmit';

class CreditCardPage extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.yearSelections = this.initYears();
        this.payment = this.props.navigation.getParam('payment');
        this.billingAddressParams = this.props.navigation.getParam('billingAddress');
        this.shippingAddressParams = this.props.navigation.getParam('shippingAddress');
        this.data = Identify.getCreditCardData();
        this.initData = {};
        this.isRight = false;
    }

    scanCard() {
        CardIOModule
            .scanCard({
                hideCardIOLogo: true,
                suppressManualEntry: true,
                requireCardholderName: this.payment.is_show_name == '1',
                requireCVV: this.payment.useccv == '1'
            })
            .then(card => {
                // the scanned card
                this.payment.cc_types.forEach(element => {
                    if (element.cc_name === card.cardType.toString()) {
                        this.form.updateFormData('cc_type', element.cc_code, true);
                    }
                });
                this.cardType.setState({ showSelections: true });
                this.form.updateFormData('cc_number', card.cardNumber.toString(), true);
                this.form.updateFormData('cc_exp_year', card.expiryYear.toString(), true);
                this.form.updateFormData('cc_exp_month', card.expiryMonth.toString(), true);
                if (this.payment.useccv == '1') {
                    this.form.updateFormData('cc_cid', card.cvv.toString(), true);
                }
                if (this.payment.is_show_name == '1') {
                    this.form.updateFormData('cc_username', card.cardholderName.toString(), true);
                }
            })
            .catch(() => {
                // the user cancelled
                console.log('cancel')
            })
    }
    createFields() {
        let fields = [];

        if (this.payment.is_show_name == '1') {
            fields.push(
                this.renderField('text', 'cc_username', Identify.__('Name On Card'))
            );
        }

        fields.push(
            this.renderField('single_select', 'cc_type',
                Identify.__('Card Type'), this.payment.cc_types, 'cc_name', 'cc_code', 'cc_img')
        );

        fields.push(
            this.renderField('text', 'cc_number', Identify.__('Card Number'))
        );

        fields.push(
            this.renderField('dropdown', 'cc_exp_month',
                Identify.__('Exprired Month'), month, 'label', 'value')
        );

        fields.push(
            this.renderField('dropdown', 'cc_exp_year',
                Identify.__('Exprired Year'), this.yearSelections, 'label', 'value')
        );

        if (this.payment.useccv == '1') {
            fields.push(
                this.renderField('text', 'cc_cid', Identify.__('CVV'))
            );
        }

        return fields;
    }

    updateButtonStatus(status) {
        this.button.updateButtonStatus(status);
    }

    setData(data) {
        let dataToSave = {
            ...this.form.getFormData(),
            enableButton: undefined,
            showLoading: undefined
        };
        Identify.saveCreditCardData(dataToSave);
        AppStorage.saveData('credit_card', JSON.stringify(dataToSave)).then(() => {
            this.props.storeData('actions', [
                { type: 'showLoading', data: { type: 'none' } },
                { type: 'order_review_data', data: data }
            ]);
            Toast.show({
                text: Identify.__('Successfully Saved'),
                duration: 3000,
                type: 'success',
                textStyle: { fontFamily: material.fontFamily }
            });
            NavigationManager.backToPreviousPage(this.props.navigation);
        });
    }

    onClickButton() {
        this.props.storeData('showLoading', { type: 'dialog' });
        let addressParams = {};
        if (Identify.TRUE(Identify.getMerchantConfig().storeview.checkout.enable_address_params == '1')) {
            addressParams['b_address'] = this.billingAddressParams;
            addressParams['s_address'] = this.shippingAddressParams;
        }
        new NewConnection()
            .init(onepage, 'get_home_data', this, 'PUT')
            .addBodyData({
                p_method: {
                    ...this.form.getFormData(),
                    enableButton: undefined,
                    showLoading: undefined,
                    method: this.payment.payment_method
                },
                ...addressParams
            })
            .connect();
    }

    renderPhoneLayout() {
        return (
            <Container style={{ backgroundColor: variable.appBackground }}>
                <Content>
                    <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15, paddingTop: 30, paddingBottom: 70 }}>
                        <TouchableOpacity
                            onPress={this.scanCard.bind(this)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <Icon style={{ color: Identify.theme.button_background, fontSize: 19 }} name={'md-camera'} />
                            <Text style={{ marginLeft: 15, marginRight: 15, color: Identify.theme.button_background, fontFamily: variable.fontBold }}>{Identify.__('Scan your credit card')}</Text>
                        </TouchableOpacity>
                        <SimiForm fields={this.createFields()}
                            parent={this}
                            onRef={ref => (this.form = ref)}
                            initData={this.initData} />
                    </View>
                </Content>
                <CreditCardSubmit parent={this} onRef={ref => (this.button = ref)} />
            </Container>
        );
    }

    renderField = (inputType = 'text', inputKey, inputTitle, pickerData = [], pickerKeyDisplay = '', pickerKeySave = '', pickerKeyImage = '') => {
        let inputValue = undefined;
        if (this.data) {
            inputValue = this.data[inputKey];
            this.initData[inputKey] = inputValue;
        }

        switch (inputType) {
            case 'dropdown':
                return (
                    <DropDownInput
                        key={inputKey}
                        inputType={inputType}
                        inputKey={inputKey}
                        inputValue={inputValue}
                        inputTitle={inputTitle}
                        required={true}
                        parent={this}
                        keyForDisplay={pickerKeyDisplay}
                        keyForSave={pickerKeySave}
                        dataSource={pickerData}
                    />
                );
            case 'single_select':
                return (
                    <CardType
                        ref={ref => this.cardType = ref}
                        key={inputKey}
                        inputType={inputType}
                        inputKey={inputKey}
                        inputValue={inputValue}
                        inputTitle={inputTitle}
                        required={true}
                        parent={this}
                        keyForDisplay={pickerKeyDisplay}
                        keyForSave={pickerKeySave}
                        keyForImage={pickerKeyImage}
                        imageType={'local'}
                        dataSource={pickerData}
                    />
                );
            default:
                return (
                    <FloatingInput
                        key={inputKey}
                        inputType={inputType}
                        inputKey={inputKey}
                        inputValue={inputValue}
                        inputTitle={inputTitle}
                        required={true}
                        parent={this}
                        disabled={this.isEditProfile && inputKey === 'email' ? true : false} />
                );
        }
    };

    initYears() {
        let years = [];
        let now = new Date();
        let currentYear = now.getFullYear();
        for (let i = 0; i < 12; i++) {
            let y = (currentYear + i).toString()
            years.push({ value: y, label: y });
        }
        return years;
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(null, mapDispatchToProps)(CreditCardPage);