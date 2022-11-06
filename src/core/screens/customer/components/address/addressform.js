import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import SimiForm from '@base/components/form/SimiForm';
import FloatingInput from '@base/components/form/FloatingInput';
import PickerInput from '@base/components/form/PickerInput';
import DateInput from '@base/components/form/DateInput';
import Identify from '@helper/Identify';
import CountryStateField from './countrystate';

export default class AddressForm extends SimiComponent {

    constructor(props) {
        super(props);
        this.initData = {};
        let json = Identify.getMerchantConfig();
        this.address_option = json.storeview.customer.address_option;
        this.account_option = json.storeview.customer.account_option;
        this.gender_value = json.storeview.customer.address_option.gender_value;
        this.mode = this.props.navigation.getParam('mode');
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
        if (this.mode.includes('checkout') && !this.mode.includes('exist_customer') && !this.mode.includes('new_customer_edit_shipping')) {
            fields.push(
                this.renderField('email', 'email', Identify.__('Email'), 'req')
            );
        }
        fields.push(
            this.renderField('text', 'company', Identify.__('Company'), this.address_option.company_show)
        );
        fields.push(
            this.renderField('text', 'street', Identify.__('Street'), this.address_option.street_show)
        );
        fields.push(
            this.renderField('text', 'vat_id', Identify.__('VAT Number'), this.address_option.taxvat_show)
        );
        fields.push(
            this.renderField('text', 'city', Identify.__('City'), this.address_option.city_show)
        );
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
        fields.push(
            this.renderField('text', 'postcode', Identify.__('Post/Zip Code'), this.address_option.zipcode_show)
        );
        fields.push(
            this.renderField('phone', 'telephone', Identify.__('Phone'), this.address_option.telephone_show)
        );
        fields.push(
            this.renderField('text', 'fax', Identify.__('Fax'), this.address_option.fax_show)
        );

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
                default:
                    return (
                        <FloatingInput
                            key={inputKey}
                            inputType={inputType}
                            inputKey={inputKey}
                            inputValue={inputValue}
                            inputTitle={inputTitle}
                            required={required}
                            parent={this} />
                    );
            }
        }
    };

    renderPhoneLayout() {
        this.address = this.props.parent.state.address;
        return (
            <SimiForm fields={this.createFields()}
                parent={this}
                onRef={ref => (this.form = ref)}
                initData={this.initData} />
        );
    }

    getAddressData() {
        return this.form.getFormData();
    }
}