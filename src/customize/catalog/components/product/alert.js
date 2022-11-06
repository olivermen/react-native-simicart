import React from 'react';
import { StyleSheet, View, Text } from 'react-native'
import Identify from '@helper/Identify';

const AlertMess = (props) => {

    let show = props.parent.state.showAlert
    let message = props.parent.state.alertMessage
    let error = props.parent.state.isError
    return (
        show ?
            (<View style={styles.container}>
                <View style={[styles.box, { backgroundColor: error ? '#FFE8E9' : '#D4F6D2', borderColor: error ? '#D51C17' : '#39A935' }]}>
                    <Text style={{ fontSize: 16, textAlign: 'center' }}>{Identify.__(message)}</Text>
                </View>
            </View>)
            : null
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 12,
        marginTop: 16,
        marginBottom: 20
    },
    box: {
        width: '100%',
        borderRadius: 8,
        borderWidth: 1,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default AlertMess