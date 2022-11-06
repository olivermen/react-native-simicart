import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import SimiForm from '@base/components/form/SimiForm';
import FloatingInput from '@base/components/form/FloatingInput';
import PickerInput from '../../../base/components/form/PickerInput';
import DateInput from '@base/components/form/DateInput';
import Identify from '@helper/Identify';
import CountryStateField from './countrystate';
import CustomBorderedInput from '../../../base/components/form/BorderedInput';
import CustomCheckBoxInput from '../../../base/components/form/CheckBoxInput';
import Title from './title'

export default class AddressForm extends SimiComponent {

    constructor(props) {
        super(props);
        this.initData = {};
        let json = Identify.getMerchantConfig();
        this.address_option = json.storeview.customer.address_option;
        this.account_option = json.storeview.customer.account_option;
        this.gender_value = json.storeview.customer.address_option.gender_value;
        this.custom_field_config = json.storeview.custom_field_config;
        this.mode = this.props.navigation ? this.props.navigation.getParam('mode') : this.props.mode;
        this.address = {};
        this.state = {};
        if (Object.keys(this.address).length > 0) {
            this.initData['entity_id'] = this.address.entity_id;
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
            this.renderField('phone', 'telephone', Identify.__('Mobile Number'), this.address_option.telephone_show)
        );
        // fields.push(
        //     this.renderField('select', 'governorate', Identify.__('Governorate'), 'req', this.getFieldOptions('governorate'), 'label', 'value')
        // );
        fields.push(
            this.renderField('select', 'area', Identify.__('Area'), 'req', this.getFieldOptions('area'), 'label', 'value')
        );
        fields.push(
            this.renderField('select', 'address_types', Identify.__('Address Type'), 'req', this.getFieldOptions('address_types'), 'label', 'value')
        );
        fields.push(
            this.renderField('text', 'block_number', Identify.__('Block'), 'req')
        );
        // fields.push(
        //     this.renderField('text', 'company', Identify.__('Company'), this.address_option.company_show)
        // );
        fields.push(
            this.renderField('text', 'street', Identify.__('Street'), 'opt')
        );
        fields.push(
            this.renderField('text', 'house_building_number', Identify.__('House/Building'), 'req')
        );
        fields.push(
            this.renderField('text', 'floor_no', Identify.__('Floor'), 'opt')
        );
        fields.push(
            this.renderField('text', 'apartment_number', Identify.__('Apartment'), 'opt')
        );
        fields.push(
            this.renderField('text', 'paci', Identify.__('PACI'), 'opt')
        );
        fields.push(
            this.renderField('text', 'alternative_phone_number', Identify.__('Alternative Phone Number'), 'opt')
        );
        fields.push(
            this.renderField('text', 'additional_info', Identify.__('Additional Info'), 'opt')
        );
        // fields.push(
        //     this.renderField('text', 'additional_email', Identify.__('Additional Email'), 'opt')
        // );
        // fields.push(
        //     this.renderField('text', 'street2', Identify.__('Street'), 'opt')
        // );
        // fields.push(
        //     this.renderField('text', 'vat_id', Identify.__('VAT Number'), this.address_option.taxvat_show)
        // );
        // fields.push(
        //     this.renderField('text', 'city', Identify.__('City'), this.address_option.city_show)
        // );
        if (this.address_option.country_id_show !== "" || this.address_option.region_id_show !== "") {
            fields.push(<CountryStateField key={'country_state'} inputKey={'country_state'} parent={this} address={this.address} required={false} address_option={this.address_option} />);
        }
        // fields.push(
        //     this.renderField('select', 'country_id', Identify.__('Country'), this.address_option.country_id_show || "req", this.allowed_countries, 'country_name', 'country_code')
        // );
        // if (this.allowed_states.length > 0) {
        //     fields.push(
        //         this.renderField('select', 'region_id', Identify.__('State'), "req", this.allowed_states, 'state_name', 'state_id')
        //     );
        // } else {
        //     fields.push(
        //         this.renderField('text', 'region', Identify.__('State'), "opt")
        //     );
        // }
        // fields.push(
        //     this.renderField('text', 'postcode', Identify.__('Post/Zip Code'), this.address_option.zipcode_show)
        // );
        // fields.push(
        //     this.renderField('text', 'fax', Identify.__('Fax'), this.address_option.fax_show)
        // );

        if (this.mode.includes('checkout')) {
            fields.push(
                this.renderField('datetime', 'dob', Identify.__('Date of Birth'), this.address_option.dob_show)
            );
            for (let index in this.gender_value) {
                let values = this.gender_value[index];
                values.strString = values.label;
            }
            fields.push(
                this.renderField('select', 'gender', Identify.__('Gender'), this.address_option.gender_show, this.gender_value, 'label', 'value')
            );
            fields.push(
                this.renderField('text', 'tax', Identify.__('Tax/VAT number'), this.account_option.taxvat_show == '1' ? 'opt' : '')
            );
            if (this.mode.includes('new_customer_add_new') || this.mode.includes('new_customer_edit_billing')) {
                fields.push(
                    this.renderField('password', 'customer_password', Identify.__('Password'), "req")
                );
                fields.push(
                    this.renderField('password', 'confirm_password', Identify.__('Confirm Password'), "req")
                );
            }
        }

        fields.push(
            this.renderField('checkbox', 'is_default_billing', Identify.__('Use as my default billing address'), 'opt')
        );
        fields.push(
            this.renderField('checkbox', 'is_default_shipping', Identify.__('Use as my default shipping address'), 'opt')
        );

        fields = fields.filter(function (element) {
            return element !== undefined;
        });

        if (this.address_option.hasOwnProperty('custom_fields')) {
            this.addCustomFields(fields);
        }

        return fields;
    }

    addCustomFields(fields) {
        this.address_option.custom_fields.forEach(element => {
            if (element.type == 'single_option') {
                fields.splice(parseInt(element.position) - 1, 0,
                    this.renderField('select', element.code, Identify.__(element.title), element.required, element.option_array, 'label', 'value')
                );
            } else {
                fields.splice(parseInt(element.position) - 1, 0,
                    this.renderField('text', element.code, Identify.__(element.title), element.required)
                );
            }
        });
    }

    renderField = (inputType = 'text', inputKey, inputTitle, show = 'req', pickerData = [], pickerKeyDisplay = '', pickerKeySave = '') => {
        if (show !== "") {
            let required = false;
            if (show === 'req') {
                required = true;
            }

            let inputValue = undefined;
            if (this.address.hasOwnProperty(inputKey)) {
                inputValue = this.address[inputKey];
                if (inputKey === 'is_default_billing' || inputKey === 'is_default_shipping') {
                    if (inputValue) {
                        inputValue = '0'
                    } else inputValue = '1'
                }
                if (inputValue == 'NA') {
                    inputValue = null;
                }
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
                            showLabel
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
                            showLabel />
                    );
            }
        }
    };

    getFieldOptions = (code) => {
        let options = [];
        try {
            const fields = this.custom_field_config;
            fields.forEach(field => {
                if (field.code == code) {
                    options = field.options;
                    return;
                }
            });
            // if(options.length > 0 && options[0].label == " " && (code == 'area' || code == 'address_types')) {
            //     options[0].label = Identify.__('Please choose an option');
            // }
        } catch (err) {
            return options;
        }
        return options;
    }

    renderPhoneLayout() {
        this.address = this.props.parent.state.address
        return (
            <>
                <Title subTitle='Edit Address' />
                <SimiForm
                    key="simi_form"
                    fields={this.createFields()}
                    parent={this}
                    onRef={ref => (this.form = ref)}
                    initData={this.initData}
                />
            </>
        );
    }

    getAddressData() {
        let formData = this.form.getFormData();
        if (!formData.street) {
            formData['street'] = 'NA';
        }
        return formData;
    }
}