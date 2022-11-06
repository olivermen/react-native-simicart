import React from 'react';
import { View } from 'react-native';
import { Text } from 'native-base';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import material from '@theme/variables/material';

const RegisterButton = (props) => {

    function onClickRegister() {
        NavigationManager.openPage(props.navigation, 'Customer', {
            isEditProfile: false
        });
    }

    return (
        <View style={{ borderTopWidth: 1, borderTopColor: '#C5CBD5', flexDirection: 'row', paddingTop: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontFamily: material.fontBold }}>{Identify.__('Don’t have an account')}?</Text>
            <Text style={{ fontSize: 16, color: '#096BB3', marginLeft: 10 }} onPress={onClickRegister}>{Identify.__('Create an account')}</Text>
        </View>
    );
}

export default RegisterButton;