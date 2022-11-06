import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { Image, View, TouchableOpacity } from 'react-native';
import { Icon, Text } from 'native-base';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';

const ActionBar = (props) => {

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
        <View style={{ height: 55, width: '100%', backgroundColor: '#E4531A', flexDirection: 'row' }}>
            <TouchableOpacity style={{ width: 55, height: 55, alignItems: 'center', justifyContent: 'center' }} onPress={() => props.parent.changeStyle()}>
                <Image source={showList ? require('../../../footer/icon/icon-list.png') : require('../../../icon/grid.png')} style={{ width: 20, height: 20, tintColor: '#FFFFFF' }} />
            </TouchableOpacity>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, borderLeftWidth: 1, borderColor: 'white' }}
                    onPress={() => props.parent.setState({ showSort: !props.parent.showSort })}>
                    <Text style={{ color: 'white', fontFamily: material.fontBold }}>{Identify.__('Sort by')}</Text>
                    <Icon
                        style={{ fontSize: 18, color: 'white' }}
                        name={props.parent.state.showSort ? "ios-arrow-up" : "ios-arrow-down"} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, borderLeftWidth: 1, borderColor: 'white' }}
                    onPress={() => props.parent.setState({ showFilter: !props.parent.showFilter })}>
                    <Image source={require('../../../icon/icon-filter.png')} style={{ width: 20, height: 20 }} />
                    <Text style={{ marginLeft: 10, color: 'white', fontFamily: material.fontBold }}>{Identify.__('Filter')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}

export default ActionBar;