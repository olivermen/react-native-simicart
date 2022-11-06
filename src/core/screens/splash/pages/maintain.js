import React from 'react';
import { Image, StyleSheet, BackHandler, Alert } from 'react-native';
import { View, Text } from 'native-base';
import Identify from '@helper/Identify';
import SimiPageComponent from '../../../base/components/SimiPageComponent';

export default class Maintain extends SimiPageComponent {

    handleBackAndroid = () => {
        Alert.alert(
            Identify.__('Warning'),
            Identify.__('Are you sure you want to exit app?'),
            [
                {
                    text: Identify.__('Cancel'), onPress: () => {
                        style: 'cancel'
                    }
                },
                {
                    text: Identify.__('OK'), onPress: () => {
                        BackHandler.exitApp()
                    }
                },
            ],
            { cancelable: true }
        )
        return true;
    }

    render() {
        return (
            <View style={styles.parent}>
                <Image
                    style={styles.image}
                    source={require('@media/ic_barrier.png')}
                />
                <Text style={styles.title}>{Identify.__('Down for maintenance').toUpperCase()}</Text>
                <Text style={styles.content}>{Identify.__('Sorry, the app is down for maintenance. Please check back later')}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    parent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
    },
    image: {
        width: 200,
        height: 200
    },
    title: {
        textAlign: 'center',
        color: 'red',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20
    },
    content: {
        textAlign: 'center',
        fontSize: 20,
        marginTop: 20,
    }
})