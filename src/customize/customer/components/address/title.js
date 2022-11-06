import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Identify from '@helper/Identify';

const Title = (props) => {

    return (
        <>
            <Text style={styles.title}>{Identify.__('Address Book')}</Text>
            <Text style={styles.subTitle}>{Identify.__(props.subTitle)}</Text>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'left'
    },
    subTitle: {
        fontSize: 16,
        paddingTop: 10,
        paddingBottom: 30,
        textAlign: 'left'
    }
})

export default Title;