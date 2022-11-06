import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import SimiForm from '@base/components/form/SimiForm';
import BorderedInput from '@base/components/form/BorderedInput';
import AppStorage from '../../../../helper/storage';
import Identify from "../../../../helper/Identify";

export default class LoginForm extends SimiComponent {

    constructor(props) {
        super(props);
        this.state = {
            email: this.props.navigation.getParam('email'),
            password: this.props.navigation.getParam('password')
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }

        if (!this.props.navigation.getParam('email')) {
            AppStorage.getCustomerRemebermeLoginInfo().then((rememberInfo) => {
                if (rememberInfo && rememberInfo.email) {
                    this.fillLoginData(rememberInfo);
                    this.props.parent.setState({ rememberMeEnable: true, enableSignIn: true });
                }
            });
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

    fillLoginData(loginData) {
        this.setState(loginData);
        for (let key in loginData){
            this.form.updateFormData(key, loginData[key], true)
        }
    }
    
    createFields() {
        let fields = [];
        fields.push(this.createInput('email', 'email', Identify.__('Email'), 'email', 'person', this.state.email, true, true));
        fields.push(this.createInput('password', 'password', Identify.__('Password'), 'password', 'lock', this.state.password, true, false));
        return fields;
    }

    createInput(key, inputKey, inputTitle, inputType, iconName, inputValue, required, needWarning) {
        return(
            <BorderedInput key={key}
                           inputKey={inputKey}
                           inputTitle={inputTitle}
                           inputType={inputType}
                           iconName={iconName}
                           inputValue={inputValue}
                           required={required}
                           needWarning={needWarning}
                           extraIcon={undefined} />
        );
    }

    renderPhoneLayout() {
        return (
            <SimiForm fields={this.createFields()} initData={this.state} parent={this} onRef={ref => (this.form = ref)} />
        );
    }

    getLoginData() {
        return this.form.getFormData();
    }
}