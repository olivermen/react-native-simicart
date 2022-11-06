import React from 'react';
import BaseInput from '@base/components/form/BaseInput';
import { Item, Icon, Input, Text } from 'native-base';
import { View } from 'react-native'
import NavigationManager from "@helper/NavigationManager";
import Identify from '@helper/Identify';

export default class CustomBorderedInput extends BaseInput {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            showPassword: false,
            scorePass: Identify.__('No password')
        };
    }

    initData() {
        super.initData();
        this.iconName = this.props.iconName;
        this.inputTitle = this.props.inputTitle;
    }

    addWarningIcon = () => {
        if (this.state.success === true) {
            return (<Icon name={'ios-checkmark-circle'} />)
        } else if (this.state.error === true) {
            return (<Icon name={'ios-close-circle'} />)
        }
        return null;
    }

    checkStrengthPass = (text) => {
        if (this.props.enablePasswordStrength) {
            const score = this.scorePassword(text)
            let strength = '';
            switch (true) {
                case score >= 65:
                    strength = Identify.__("Strong");
                    break;
                case score > 50:
                    strength = Identify.__("Good");
                    break;
                case (score >= 30):
                    strength = Identify.__("Medium");
                    break;
                case (score === 0):
                    strength = Identify.__("No password");
                    break;
                default:
                    strength = Identify.__("Weak");
                    break;
            }
            this.setState({ scorePass: strength });
        }
    }

    onInputValueChange(text) {
        this.state.value = text;
        let validateResult = this.validateInputValue(text);
        this.parent.updateFormData(this.inputKey, text, validateResult);
        if (this.props.required === true) {
            if (validateResult === true) {
                this.setState({ success: true, error: false });
            } else {
                this.setState({ success: false, error: true });
            }
        }
    }

    renderExtraIcon() {
        return this.props.extraIcon
    }

    createInputLayout() {
        return (
            <View style={{ marginTop: 20 }}>
                <View style={{ flexDirection: 'row' }}>
                    {this.props.showLabel &&
                        <Text style={{ flex: 1, marginBottom: 5 }}>
                            {this.inputTitle} <Text style={{ color: '#ED1C24' }}>{this.props.required ? '*' : ''}</Text>
                        </Text>}
                    {this.props.inputKey == 'password' &&
                        <Text
                            style={{ flex: 1, textAlign: 'right', color: '#096BB3', marginBottom: 5 }}
                            onPress={() => this.setState({ showPassword: !this.state.showPassword })}>
                            {Identify.__('Show password')}
                        </Text>}
                </View>
                <Item regular error={this.state.error} success={this.state.success} disabled={this.disabled} style={{ borderRadius: 4, borderColor: '#C5CBD5' }}>
                    {this.iconName && <Icon active name={this.iconName} style={{ fontSize: 24 }} />}
                    <Input
                        ref={(input) => { this.props.parent.listRefs[this.inputKey] = input }}
                        onSubmitEditing={() => { this.submitEditing() }}
                        returnKeyType={"done"}
                        placeholder={this.props.showLabel ? null : this.inputTitle}
                        keyboardType={this.keyboardType}
                        autoCapitalize='none'
                        clearButtonMode="while-editing"
                        secureTextEntry={(this.inputType === 'password' && !this.state.showPassword) ? true : false}
                        onChangeText={(text) => {
                            this.onInputValueChange(text);
                            this.checkStrengthPass(text)
                        }}
                        defaultValue={this.props.inputValue}
                        style={{ textAlign: Identify.isRtl() ? 'right' : 'left', paddingLeft: 16 }}
                        placeholderTextColor="#000000"
                    />
                    {this.props.hasOwnProperty('extraIcon') && this.renderExtraIcon()}
                    {this.props.needWarning && this.addWarningIcon()}
                </Item>
                {this.props.enablePasswordStrength && <Text style={{ paddingHorizontal: 10, paddingVertical: 3, fontSize: 12, backgroundColor: '#D8D8D8' }}>{Identify.__("Password Strength")}: {this.state.scorePass}</Text>}
            </View>
        );
    }

    isPasswordComplexEnough = (str = '') => {
        const count = {
            lower: 0,
            upper: 0,
            digit: 0,
            special: 0
        };
    
        for (const char of str) {
            if (/[a-z]/.test(char)) count.lower++;
            else if (/[A-Z]/.test(char)) count.upper++;
            else if (/\d/.test(char)) count.digit++;
            else if (/\S/.test(char)) count.special++;
        }
    
        return Object.values(count).filter(Boolean).length >= 3;
    };

    scorePassword = pass => {
        let score = 0;
        if (!pass)
            return score;
    
        // award every unique letter until 5 repetitions
        const letters = {};
        for (let i = 0; i < pass.length; i++) {
            if (i <= 8) {
                letters[pass[i]] = (letters[pass[i]] || 0) + 1;
                score += 5.0 / letters[pass[i]];
            }
        }
    
        // bonus points for mixing it up
        const variations = {
            digits: /\d/.test(pass),
            lower: /[a-z]/.test(pass),
            upper: /[A-Z]/.test(pass),
            nonWords: /\W/.test(pass),
        }
    
        let variationCount = 0;
        for (const check in variations) {
            variationCount += (variations[check] === true) ? 1 : 0;
        }
        score += (variationCount - 1) * 10;
    
        if(parseInt(score, 10) > 50) {
            if(!this.isPasswordComplexEnough(pass)){
                score = 50
            }
        }
    
        return parseInt(score, 10);
    }

}