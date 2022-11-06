import React from 'react';
import BaseInput from './BaseInput';
import { Item, Input, Label, Icon, View, Text } from 'native-base';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';

export default class FloatingInput extends BaseInput {

    constructor(props) {
        super(props);
    }

    addWarningIcon = () => {
        if (this.state.success === true) {
            return (<Icon style={{ fontSize: 22 }} name={'ios-checkmark-circle'} />)
        } else if (this.state.error === true) {
            return (<Icon style={{ fontSize: 22 }} name={'ios-close-circle'} />)
        }
        return null;
    }

    onInputValueChange(text) {
        this.state.value = text;
        let validateResult = this.validateInputValue(text);
        if (this.props.required === true || this.inputType === 'password' || this.inputType === 'email') {
            if (validateResult === true) {
                this.setState({ success: true, error: false });
            } else {
                this.setState({ success: false, error: true });
            }
        } else {
            this.setState({ success: true, error: false });
        }
        this.parent.updateFormData(this.inputKey, text, validateResult);
    }

    renderExtraIcon() {
        return (
            <View style={{ justifyContent: 'flex-end', alignItems: 'baseline', paddingLeft: 3, paddingRight: 3 }}>
                {this.props.extraIcon}
            </View>
        )
    }

    createInputLayout() {
        return (
            <View style={{ flexDirection: 'column', marginBottom: 10 }}>
                <Text style={{ alignSelf: 'flex-start' }}>{this.inputTitle}</Text>
                <Item error={this.state.error}
                    success={this.state.success}
                    disabled={this.disabled}
                    style={{ flexGrow: 1, flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>
                    <Input
                        ref={(input) => { this.props.parent.listRefs[this.inputKey] = input }}
                        onSubmitEditing={() => { this.submitEditing() }}
                        returnKeyType={"done"}
                        disabled={this.disabled}
                        keyboardType={this.keyboardType}
                        defaultValue={this.state.value}
                        clearButtonMode={'while-editing'}
                        secureTextEntry={this.inputType === 'password' ? true : false}
                        onChangeText={(text) => {
                            this.onInputValueChange(text);
                        }}
                        style={[this.disabled ? { color: 'gray', textAlign: Identify.isRtl() ? 'right' : 'left' } : { textAlign: Identify.isRtl() ? 'right' : 'left' }, { width: '100%', height: null, paddingTop: 5, paddingBottom: 5, paddingLeft: 0 }]}
                        autoCapitalize='none'
                    />
                    {this.addWarningIcon()}
                </Item>
                {this.props.hasOwnProperty('extraIcon') && this.renderExtraIcon()}
            </View>
        );
    }

}