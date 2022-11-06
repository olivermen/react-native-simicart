import React from 'react';
import DownloadableAbstract from './DownloadableAbstract';
import { View } from 'react-native';
import CustomOptions from '../custom/index';

class Downloadable extends DownloadableAbstract {
    render(){
        return (
            <View>
                {this.renderOptions()}
                <CustomOptions app_options={this.data}
                    parent={this}
                    product_id={this.props.product_id}
                    prices={this.props.prices}
                    onRef={ref => (this.customOption = ref)}/>
            </View>
        );
    }
}
export default Downloadable;
