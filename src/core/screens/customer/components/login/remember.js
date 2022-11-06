import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { TouchableOpacity } from 'react-native';
import { CheckBox, Text, Icon } from 'native-base';
import Identify from '../../../../helper/Identify';

const RememberEmailPass = (props) => {

    function onCheckRemember() {
        props.parent.setState((previousState) => {
            return { rememberMeEnable: !previousState.rememberMeEnable };
        });
    }

    return (
        <TouchableOpacity
            style={{ flex: 1, marginTop: 25, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
            onPress={() => { onCheckRemember() }}>
            <Icon name={props.parent.state.rememberMeEnable ? "ios-checkmark-circle" : "ios-radio-button-off"}
                style={{ fontSize: 25, left: 0 }}
            />
            <Text style={{ marginLeft: 10 }}>{Identify.__('Remember me')}</Text>
        </TouchableOpacity>

    );
}

export default RememberEmailPass;