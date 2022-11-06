import React from 'react';
import SimiComponent from '../../../../base/components/SimiComponent';
import { Button, Text, View } from 'native-base';
import Identify from '../../../../helper/Identify';
import NavigationManager from '../../../../helper/NavigationManager';
import material from '../../../../../../native-base-theme/variables/material';

const RegisterButton = (props) => {

    function onClickRegister() {
        NavigationManager.openPage( props.navigation, 'Customer', {
            isEditProfile: false
        });
    }

    return (
        <View>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginTop: 30
                }}
            >
                <View style={{ flexGrow: 1, height: '50%', borderBottomColor: '#7e7e7e', borderBottomWidth: 1 }} />
                <Text style={{ fontSize: 18, fontFamily: material.fontBold, marginLeft: 7, marginRight: 7, color: '#7e7e7e' }}>{Identify.__('Or').toUpperCase()}</Text>
                <View style={{ flexGrow: 1, height: '50%', borderBottomColor: '#7e7e7e', borderBottomWidth: 1 }} />
            </View>
            <Button style={{ marginTop: 30, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                transparent
                dark
                full
                bordered
                onPress={() => {  onClickRegister() }}>
                <Text> {Identify.__('Create an Account')} </Text>
            </Button>
        </View>
    );
}

export default RegisterButton;