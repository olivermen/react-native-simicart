import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import SimiForm from '@base/components/form/SimiForm';
import FloatingInput from '@base/components/form/FloatingInput';
import PickerInput from '@base/components/form/PickerInput';
import DateInput from '@base/components/form/DateInput';
import DropDownInput from '@base/components/form/DropDownInput';
import CheckboxInput from '@base/components/form/CheckBoxInput'
import Identify from '@helper/Identify';
import { Text } from 'native-base';
import { View } from 'react-native';
import material from '@theme/variables/material';
import CustomBorderedInput from '../../../base/components/form/BorderedInput';
import CustomCheckBoxInput from '../../../base/components/form/CheckBoxInput';

export default class CustomerForm extends SimiComponent {

    constructor(props) {
        super(props);
        this.isEditProfile = this.props.navigation.getParam('isEditProfile');
        this.data = this.props.parent.props.data;
        this.initData = {};
        let json = Identify.getMerchantConfig();
        this.address_option = json.storeview.customer.address_option;
        this.account_option = json.storeview.customer.account_option;
        this.gender_value = json.storeview.customer.address_option.gender_value;

        this.social_login = false;
        if (this.data && this.data.social_login === true) {
            this.social_login = true;
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

    updateButtonStatus(status) {
        this.props.parent.updateButtonStatus(status);
    }

    createFields() {
        let fields = [];

        fields.push(
            this.renderField('text', 'prefix', Identify.__('Prefix'), this.address_option.prefix_show)
        );
        fields.push(
            this.renderField('text', 'firstname', Identify.__('First Name'), 'req')
        );
        fields.push(
            this.renderField('text', 'lastname', Identify.__('Last Name'), 'req')
        );
        fields.push(
            this.renderField('text', 'suffix', Identify.__('Suffix'), this.address_option.suffix_show)
        );
        fields.push(
            this.renderField('email', 'email', Identify.__('Email'), 'req')
        );
        fields.push(
            this.renderField('phone', 'mobilenumber', Identify.__('Mobile Number'), 'req')
        );
        fields.push(
            this.renderField('datetime', 'dob', Identify.__('Date of Birth'), this.address_option.dob_show)
        );
        let genderValues = this.address_option.gender_value;
        for (let index in genderValues) {
            let values = genderValues[index];
            values.strString = values.label;
        }
        fields.push(
            this.renderField('dropdown', 'gender', Identify.__('Gender'), this.address_option.gender_show, genderValues, 'label', 'value')
        );
        fields.push(
            this.renderField('text', 'taxvat', Identify.__('Tax/VAT number'), this.address_option.taxvat_show)
        );

        if (!this.social_login) {
            let labelPassword = Identify.__('Password');
            if (this.isEditProfile) {
                labelPassword = Identify.__('Current Password');
            }
            fields.push(
                this.renderField('password', 'password', labelPassword, this.isEditProfile ? 'opt' : 'req')
            );
            if (this.isEditProfile) {
                fields.push(
                    this.renderField('password', 'new_password', Identify.__('New Password'), this.isEditProfile ? 'opt' : 'req')
                );
            }
            fields.push(
                this.renderField('password', 'com_password', Identify.__('Confirm Password'), this.isEditProfile ? 'opt' : 'req')
            );
        }

        // if (this.account_option.show_newsletter === '1') {
        if (!this.isEditProfile) {
            fields.push(
                this.renderField('checkbox', 'news_letter', Identify.__('Subscribe to news and updates'), 'opt')
            );
        }
        // }

        fields = fields.filter(function (element) {
            return element !== undefined;
        });

        return fields;
    }

    renderField = (inputType = 'text', inputKey, inputTitle, show = 'req', pickerData = [], pickerKeyDisplay = '', pickerKeySave = '') => {
        if (show !== "") {
            let required = false;
            if (show === 'req') {
                required = true;
            }

            let inputValue = undefined;
            if (this.data) {
                inputValue = this.data[inputKey];
                this.initData[inputKey] = inputValue;
            }

            switch (inputType) {
                case 'select':
                    return (
                        <PickerInput
                            key={inputKey}
                            inputType={inputType}
                            inputKey={inputKey}
                            inputValue={inputValue}
                            inputTitle={inputTitle}
                            required={required}
                            parent={this}
                            keyForDisplay={pickerKeyDisplay}
                            keyForSave={pickerKeySave}
                            dataSource={pickerData}
                        />
                    );
                case 'dropdown':
                    return (
                        <DropDownInput
                            key={inputKey}
                            inputType={inputType}
                            inputKey={inputKey}
                            inputValue={inputValue}
                            inputTitle={inputTitle}
                            required={required}
                            parent={this}
                            keyForDisplay={pickerKeyDisplay}
                            keyForSave={pickerKeySave}
                            dataSource={pickerData}
                        />
                    );
                case 'datetime':
                    return (
                        <DateInput key={inputKey}
                            inputType={inputType}
                            inputKey={inputKey}
                            inputValue={inputValue}
                            inputTitle={inputTitle}
                            required={required}
                            parent={this} />
                    );
                case 'checkbox':
                    return (
                        <CustomCheckBoxInput
                            key={inputKey}
                            inputType={inputType}
                            inputKey={inputKey}
                            inputValue={inputValue}
                            inputTitle={inputTitle}
                            required={required}
                            parent={this}
                        />
                    )
                default:
                    return (
                        <CustomBorderedInput
                            key={inputKey}
                            inputType={inputType}
                            inputKey={inputKey}
                            inputValue={inputValue}
                            inputTitle={inputTitle}
                            required={required}
                            parent={this}
                            disabled={this.isEditProfile && inputKey === 'email' ? true : false}
                            showLabel
                            enablePasswordStrength={inputKey == 'password'} />
                    );
            }
        }
    };

    renderPhoneLayout() {
        return (
            <View>
                <Text style={{ marginVertical: 10, fontSize: 20, fontFamily: material.fontBold, textAlign: 'center' }}>{Identify.__('Create an Account')}</Text>
                <Text style={{ color: '#747474', textAlign: 'center', paddingHorizontal: 10, marginBottom: 15 }}>{Identify.__('Check out faster, use multiple addresses, track orders and more by creating an account!')}</Text>
                <SimiForm fields={this.createFields()}
                    parent={this}
                    onRef={ref => (this.form = ref)}
                    initData={this.initData} />
            </View>
        );
    }

    getCustomerData() {
        return this.form.getFormData();
    }
}