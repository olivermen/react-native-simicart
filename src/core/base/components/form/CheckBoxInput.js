import React from 'react';
import BaseInput from './BaseInput';
import { Item, Input, Label, Icon, View, CheckBox, Text } from 'native-base';
import { TouchableOpacity } from 'react-native'
import Identify from '@helper/Identify';

export default class CheckBoxInput extends BaseInput {

    constructor(props) {
        super(props);
        this.state = {
            selected: false
        }
    }

    selectedCheckbox() {
        let status = '';
        if (!this.state.selected) {
            status = '1'
        }else{
            status = '0'
        }
        this.parent.updateFormData(this.inputKey, status, true);
        this.setState(previousState => ({ selected: !previousState.selected }));
    }

    createInputLayout() {
        return (
            <View style={{ marginTop: 10, marginBottom: 10 }}>
                <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}
                    onPress={() => this.selectedCheckbox()}>
                    <Text style={{fontSize:18, color:'gray' }}>{Identify.__(this.inputTitle)}</Text>
                    <CheckBox color={'gray'}
                        checked={this.state.selected}
                        style={{ width: 22, height: 22, marginRight: 15}}
                        onPress={() => this.selectedCheckbox()} />
                </TouchableOpacity>
            </View>
        );
    }

}