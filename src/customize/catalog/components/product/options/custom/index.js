import React from 'react';
import { View } from 'react-native';
import { Text } from 'native-base';
import Identify from "@helper/Identify";
import CustomAbstract from './CustomAbstract';
import material from '@theme/variables/material';

class Custom extends CustomAbstract {

    render() {
        return (
            <View>
                <Text style={{ fontSize: 16, fontFamily: material.fontBold, marginBottom: 20 }}>{Identify.__('Select an warranty plan')}:</Text>
                {this.renderOptions()}
            </View>
        );
    }
}
export default Custom;