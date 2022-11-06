import React from 'react'
import { Text } from 'native-base'
import { TouchableOpacity } from 'react-native'
import NavigationManager from "@helper/NavigationManager";
import Identify from "@helper/Identify";

const ForgotPassIcon = (props) => {

    function onForgotPassWord(){
        NavigationManager.openPage( props.navigation, 'ForgotPassword')
    }
    
    return (
        <TouchableOpacity
            key={'forgot'}
            style={{
                marginTop: 15
            }}
            onPress={() => {  onForgotPassWord() }}>
            <Text
                style={{
                    color: '#096BB3'
                }}>
                {Identify.__('Forgot Password')} ?
            </Text>
        </TouchableOpacity>
    )
}

export default ForgotPassIcon