import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Identify from '@helper/Identify';
import material from '@theme/variables/material';

const Header = (props) => {

    if (props.parent.state.isShowValidate) {
        return (
            <View style={styles.container}>
                <View style={styles.box}>
                    <Text style={styles.title}>
                        {Identify.__(`Some products are not available in ${props.parent.store.name}. Go to `)}
                        <Text style={{ color: '#096BB3' }}>Shopping Cart </Text>
                        to update or change Store or select Home Delivery
                    </Text>
                </View>
            </View>
        )
    } else {
        return (
            <View style={styles.page}>
                <Text style={[styles.title, { fontSize: 20, fontFamily: material.fontBold }]}>{Identify.__('Checkout')}</Text>
                <View style={styles.line} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 12
    },
    title: {
        fontSize: 16,
        textAlign: 'center'
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#D8D8D8',
        marginTop: 10
    },
    container: {
        marginHorizontal: 12
    },
    box: {
        width: '100%',
        borderRadius: 8,
        borderWidth: 1,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#e4531a',
        backgroundColor: '#FFE699'
    }
})

export default Header