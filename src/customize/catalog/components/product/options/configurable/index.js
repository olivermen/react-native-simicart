import React from 'react';
import { View } from 'native-base';
import ConfigurableAbstract from './ConfigurableAbstract';

class Configurable extends ConfigurableAbstract {
    render() {
        return (
            <View style={{ zIndex: 999, elevation: 999 }}>
                {this.renderOptions()}
            </View>
        );
    }
}
export default Configurable;
