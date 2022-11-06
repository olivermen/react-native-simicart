import React from 'react';
import ConfigurableAbstract from './ConfigurableAbstract';
import { View, Radio } from 'native-base';
import CustomOptions from '../custom/index';

class Configurable extends ConfigurableAbstract {
    render(){
        return (
            <View>
              {this.renderOptions()}            
            </View>
        );
    }
}
export default Configurable;
