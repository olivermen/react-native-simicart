import React from 'react';
import SimiComponent from '../../../../base/components/SimiComponent';
import { View } from 'react-native';
import { Icon } from 'native-base';
import styles from './styles';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';

const VerticalProductsBottom = (props) => {


    if (!props.parent.state.showBottom) {
        return (null);
    }
    let showList = props.parent.state.showList;
    let data = props.parent.state.data;
    let showFilter = false;
    let filterSelected = false;
    if (data.layers) {
        if ((data.layers.layer_filter && data.layers.layer_filter.length > 0) || (data.layers.layer_state && data.layers.layer_state.length > 0)) {
            showFilter = true;
            if (data.layers.layer_state && data.layers.layer_state.length > 0) {
                if (data.layers.layer_state.length == 1) {
                    if (data.layers.layer_state[0].attribute == 'cat') {
                        filterSelected = false;
                    } else {
                        filterSelected = true;
                    }
                } else {
                    filterSelected = true;
                }
            } else {
                filterSelected = false;
            }
        }
    }
    let showSort = false;
    if (data.orders && data.orders.length > 0) {
        showSort = true;
    }
    return (
        <View style={styles.bottom}>
            <Icon name={(showList) ? 'md-grid' : 'md-list'} style={styles.icon} onPress={() => { props.parent.changeStyle() }} />
            {showFilter && <Icon name='ios-funnel' style={[styles.icon, { color: filterSelected ? 'red' : material.iconColor }]} onPress={() => { props.parent.openFilter() }} />}
            {showSort && <Icon name='md-swap' style={[styles.icon, { transform: [{ rotate: '90deg' }] }]} onPress={() => { props.parent.openSort() }} />}
        </View>
    );

}

export default VerticalProductsBottom;