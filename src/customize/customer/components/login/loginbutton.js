import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';

const LoginButton = (props) => {

    function onClickLogin() {
        props.parent.startLogin();
    }

    return (
        <View>
            <Button style={{ height: 50, marginTop: 30, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}
                full
                onPress={() => {
                    if (props.parent.state.enableSignIn) {
                        onClickLogin();
                    }
                }}>
                <Text style={{ fontSize: 16, fontFamily: material.fontBold }}>{Identify.__('Sign In')} </Text>
            </Button>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginTop: 15
                }}
            >
                <View style={{ flexGrow: 1, height: '50%', borderBottomColor: '#C5CBD5', borderBottomWidth: 1 }} />
                <Text style={{ fontSize: 16, fontFamily: material.fontBold, marginHorizontal: 19 }}>{Identify.__('Or')}</Text>
                <View style={{ flexGrow: 1, height: '50%', borderBottomColor: '#C5CBD5', borderBottomWidth: 1 }} />
            </View>
        </View>
    );
}

export default LoginButton;