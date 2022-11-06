import React from 'react'
import { Text } from 'native-base'
import { TouchableOpacity } from 'react-native'
import NavigationManager from "../../../../helper/NavigationManager";
import Identify from "../../../../helper/Identify";
import material from '../../../../../../native-base-theme/variables/material';
const ForgotPassIcon = (props) => {

    function onForgotPassWord(){
        NavigationManager.openPage( props.navigation, 'ForgotPassword')
    }
    
    return (
        <TouchableOpacity
            key={'forgot'}
            style={{
                marginTop: 25,
                justifyContent: 'center',
                alignItems: 'center'
            }}
            onPress={() => {  onForgotPassWord() }}>
            <Text
                style={{
                    fontFamily: material.fontBold,
                    textAlign: 'center',
                    fontSize: 16,
                    color: Identify.theme.button_background
                }}>
                {Identify.__('Forgot your password?')}
            </Text>
        </TouchableOpacity>
    )
}

export default ForgotPassIcon