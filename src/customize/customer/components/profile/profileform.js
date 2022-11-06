import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import SimiForm from '@base/components/form/SimiForm';
import Identify from '@helper/Identify';
import { View, Text } from 'react-native';
import { RadioButton, RadioGroup } from 'react-native-flexi-radio-button';
import CustomBorderedInput from '../../../base/components/form/BorderedInput';

export default class ProfileForm extends SimiComponent {

    constructor(props) {
        super(props);
        this.isEditProfile = this.props.navigation.getParam('isEditProfile');
        this.data = this.props.parent.props.data;
        this.initData = {};
        this.state = {
            selected: this.props.parent.mode
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

    onSelect(value) {
        this.setState({ selected: value });
    }

    customRadioGroup() {
        let items = []
        let dataSource = [
            { label: Identify.__('Change email') },
            { label: Identify.__('Change password') }
        ]
        for (let index in dataSource) {
            let item = dataSource[index];
            items.push(
                <RadioButton
                    key={Identify.makeid()}
                    value={index}
                    color='#E4531A'
                >
                    <Text>{item.label}</Text>
                </RadioButton>
            );
        }

        return (
            <RadioGroup
                color='#E4531A'
                key={Identify.makeid()}
                ref={(radio) => this.Radio = radio}
                style={{
                    paddingTop: 16,
                    position: 'relative',
                    left: -10
                }}
                selectedIndex={this.state.selected}
                onSelect={(index, value) => this.onSelect(index, value)}
            >
                {items}
            </RadioGroup>
        );
    }

    createFields() {
        const { selected } = this.state
        let fields = [];

        fields.push(
            this.renderField('text', 'firstname', Identify.__('First Name'), 'req')
        );
        fields.push(
            this.renderField('text', 'lastname', Identify.__('Last Name'), 'req')
        );
        fields.push(
            this.renderField('radio', '', Identify.__('Change'), 'opt')
        );

        if (selected === 0) {
            fields.push(
                this.renderField('title', 'title_email', Identify.__('Change Email'), 'req')
            );
            fields.push(
                this.renderField('email', 'email', Identify.__('Email'), 'req')
            );
            fields.push(
                this.renderField('password', 'password', Identify.__('Current Password'), 'req')
            );
        } else if (selected === 1) {
            fields.push(
                this.renderField('title', 'title_pass', Identify.__('Change Password'), 'req')
            );
            fields.push(
                this.renderField('password', 'password', Identify.__('Current Password'), 'req')
            );
            fields.push(
                this.renderField('password', 'new_password', Identify.__('New Password'), 'req')
            );
            fields.push(
                this.renderField('password', 'com_password', Identify.__('Confirm New Password'), 'req')
            );
        }

        fields = fields.filter(function (element) {
            return element !== undefined;
        });

        return fields;
    }

    renderField = (inputType = 'text', inputKey, inputTitle, show = 'req') => {
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
                case 'radio':
                    return (
                        this.customRadioGroup()
                    )
                case 'title':
                    return (
                        <Text style={{ fontSize: 16, paddingTop: 30, fontWeight: '500', textAlign: 'left' }}>{inputTitle}</Text>
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
                            showLabel
                            enablePasswordStrength={inputKey === 'new_password'}
                        />
                    );
            }
        }
    }

    renderPhoneLayout() {
        return (
            <View>
                <Text style={{ fontSize: 20, fontWeight: '600', textAlign: 'left' }}>{Identify.__('Account Information')}</Text>
                <Text style={{ fontSize: 16, fontWeight: '500', paddingTop: 10, paddingBottom: 20, textAlign: 'left' }}>{Identify.__('Edit account information')}</Text>
                <SimiForm
                    fields={this.createFields()}
                    parent={this}
                    onRef={ref => (this.form = ref)}
                    initData={this.initData}
                />
            </View>
        );
    }

    getProfileData() {
        return this.form.getFormData();
    }
}