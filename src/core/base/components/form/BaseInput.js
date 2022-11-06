import React from 'react';
import { View, Keyboard } from 'react-native';
import Identify from "@helper/Identify";
import SimiContext from '@base/components/SimiContext'

export default class BaseInput extends React.Component {

    constructor(props) {
        super(props);
        this.keyboardType = 'default';
        this.state = {
            success: false,
            error: false,
            value: ''
        };
    }

    createInputLayout() {
        return null;
    }

    submitEditing() {
        let indexRef = Object.keys(this.props.parent.listRefs).indexOf(this.inputKey);
        let nextRefContent = Object.values(this.props.parent.listRefs)[indexRef + 1];

        if (indexRef + 1 === Object.keys(this.props.parent.listRefs).length) {
            Keyboard.dismiss();
        } else {
            nextRefContent._root.focus();
        }
    }

    initData() {
        this.inputKey = this.props.inputKey;
        this.inputTitle = this.props.inputTitle;
        if (this.props.required === true) {
            this.inputTitle = this.inputTitle + ' *';
        } else {
            this.inputTitle = this.inputTitle + ' (' + Identify.__('optional') + ')'
        }
        this.inputType = this.props.inputType;
        this.disabled = this.props.disabled;
        this.parent = this.props.parent;
        if (this.props.inputValue !== undefined && this.state.value == '') {
            this.state.value = this.props.inputValue;
        }
        if (this.inputType === 'email') {
            this.keyboardType = 'email-address';
        } else if (this.inputType === 'phone') {
            this.keyboardType = 'phone-pad';
        }
    }

    render() {
        this.initData();
        return (
            <View>
                {this.createInputLayout()}
            </View>
        );
    }

    validateInputValue = (text) => {
        if (this.inputType === 'email') {
            return this.validateEmail(text);
        } else if (this.inputType === 'password') {
            return this.validatePassword(text);
        } else if (this.props.required === true) {
            if (text.trim().length > 0)
                return true;
            else
                return false;
        }
        return true;
    }

    validateEmail = (email) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,100})+$/;
        if (reg.test(email) === false)
            return false;
        else
            return true;
    }

    validatePassword = (password) => {
        if (password.length >= 6) {
            return true;
        }
        return false;
    }

}