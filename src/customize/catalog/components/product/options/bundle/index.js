import React from 'react';
import { View } from 'react-native';
import BundleAbstract from './BundleAbstract';

class Bundle extends BundleAbstract {

    componentDidMount() {
        this.props.onRef(this)
        setTimeout(() => {
            this.updatePrices()
        }, 100)
    }

    setCustomOptionPrice = (price) => {
        this.customPrice = price
    }

    render() {
        return (
            <View>
                {this.renderOptions()}
            </View>
        )
    }
}

export default Bundle;