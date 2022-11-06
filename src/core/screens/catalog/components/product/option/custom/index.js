import React from 'react';
import CustomAbstract from './CustomAbstract';
import { View } from 'react-native';

class Custom extends CustomAbstract {
    render(){
        return (
            <View>
                {this.renderOptions()}
            </View>
        );
    }
}
export default Custom;