import React from 'react';
import BaseInput from '@base/components/form/BaseInput';
import { Item, Input, Label, Icon, View, CheckBox, Text } from 'native-base';
import { TouchableOpacity } from 'react-native'
import Identify from '@helper/Identify';
import material from '@theme/variables/material';

export default class CustomCheckBoxInput extends BaseInput {

    constructor(props) {
        super(props);
        this.state = {
            selected: false
        }
    }

    initData() {
        super.initData();
        this.inputTitle = this.props.inputTitle;
    }

    componentDidMount() {
        if (this.props.inputValue === '0') {
            this.setState({ selected: true });
        }
    }

    selectedCheckbox() {
        this.setState(previousState => ({ selected: !previousState.selected }), () => {
            let status = '';
            if (!this.state.selected) {
                status = '1'
            } else {
                status = '0'
            }
            this.parent.updateFormData(this.inputKey, status, true);
        });
    }

    createInputLayout() {
        const styleCheckBoxEmpty = {
            borderWidth: 1, borderColor: '#BABABA'
        }
        const styleCheckBoxSelected = {
            backgroundColor: Identify.theme.button_background
        }
        return (
            <View style={{ marginTop: 18 }}>
                <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => this.selectedCheckbox()}>
                    <View style={[{ width: 20, height: 20, borderRadius: 3, alignItems: 'center', justifyContent: 'center' }, this.state.selected ? styleCheckBoxSelected : styleCheckBoxEmpty]}>
                        {this.state.selected && <Icon name={"md-checkmark"} style={{ fontSize: 15, left: 0, color: 'white' }} />}
                    </View>
                    <Text style={{ fontSize: 16, marginLeft: 16 }}>{Identify.__(this.inputTitle)}</Text>
                </TouchableOpacity>
            </View>
        );
    }

}