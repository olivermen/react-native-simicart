import React from 'react';
import SimiComponent from '../../../../base/components/SimiComponent';
import { Button, Text } from 'native-base';
import Identify from '../../../../helper/Identify';

const LoginButton = (props) => {

    function onClickLogin() {
         props.parent.startLogin();
    }
    
    return (
        <Button style={{ marginTop: 30, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}
            full
            disabled={! props.parent.state.enableSignIn}
            onPress={() => {  onClickLogin() }}>
            <Text> {Identify.__('Sign In')} </Text>
        </Button>
    );
}

export default LoginButton;