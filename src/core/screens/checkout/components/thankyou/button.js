import React from 'react';
import Identify from '@helper/Identify';
import { Button, Text } from "native-base";
import { StyleSheet } from 'react-native';
import NavigationManager from '@helper/NavigationManager';

const ThankButton = (props) => {

    return (
        <Button full style={styles.button} onPress={() => {
            NavigationManager.backToRootPage(props.navigation);
        }}>
            <Text>{Identify.__('Continue Shopping')}</Text>
        </Button>
    );
}

const styles = StyleSheet.create({
    button: {
        marginTop: 30
    },
});

export default ThankButton;
