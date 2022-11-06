import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';
import Title from './title'
import Identify from '@helper/Identify';

const AddNewAddress = (props) => {

    const onClickAddNew = () => {
        props.parent.addNewAddress()
    }

    return (
        <View style={props.addresses.length ? { paddingHorizontal: 12 } : styles.container}>
            {props.addresses.length ? null : <Title subTitle='0 addresses' />}
            <TouchableOpacity onPress={onClickAddNew} style={styles.card}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#E4531A' }}>{Identify.__('Add New Address')}</Text>
                <Image source={require('../../../icon/icon-add.png')} style={styles.icon} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        paddingBottom: 30,
        paddingHorizontal: 12
    },
    card: {
        height: 50,
        paddingLeft: 20,
        paddingRight: 16,
        borderWidth: 1,
        borderColor: '#E4531A',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    icon: {
        width: 24,
        height: 24
    }
})

export default AddNewAddress;