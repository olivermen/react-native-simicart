import React from 'react';
import { Text } from "native-base";
import Identify from '@helper/Identify';
import { StyleSheet } from 'react-native';

const ThankBody = (props) => {

    return (
        <Text style={styles.message}>{Identify.__('You have placed an order successfully')}</Text>
    );
}
const styles = StyleSheet.create({
    message: {
        marginTop: 30
    },
});

export default ThankBody
