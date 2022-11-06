import React from 'react';
import GroupAbstract from './GroupAbstract';
import { View } from 'react-native';

class Group extends GroupAbstract {
    render(){
        return (
            <View>
                {this.renderOptions()}
            </View>
        )
    }
}
export default Group;