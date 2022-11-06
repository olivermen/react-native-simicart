import React from 'react';
import { View } from 'react-native';
import { Text } from 'native-base';

export default class ProfileLabel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { error, text } = this.props

        const container = {
            height: 50,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            marginTop: -10,
            marginBottom: 30,
        }

        return (
            <View style={[container, { backgroundColor: error ? '#FFE8E9' : '#D4F6D2', borderColor: error ? '#D51C17' : '#39A935' }]}>
                <Text style={{ fontSize: 16 }}>{text ? text : ''}</Text>
            </View>
        );
    }
}