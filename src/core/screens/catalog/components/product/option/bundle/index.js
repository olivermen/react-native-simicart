import React from 'react';
import BundleAbstract from './BundleAbstract';
import { View } from 'react-native';

class Bundle extends BundleAbstract {
    render(){
        return (
            <View>
                {this.renderOptions()}
            </View>
        )
    }
}
export default Bundle;