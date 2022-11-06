import React, { useMemo } from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { Image, View, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Icon, Text } from 'native-base';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';
import FilterItem from './filterItem';

const FilterPopup = (props) => {

    const data = props.parent.state.data.layers;

    if (!data) {
        return null;
    }

    const filtered = data.layer_state && data.layer_state.length > 0;

    let filterData = {};
    if (filtered) {
        data.layer_state.forEach(element => {
            filterData[element.attribute] = element.value;
        });
    }

    const applyFilter = () => {
        let params = {};
        Object.keys(filterData).forEach(key => {
            if (filterData[key]) {
                params['filter[layer][' + key + ']'] = Array.isArray(filterData[key]) ? '[' + filterData[key].toString() + ']' : filterData[key];
            }
        })
        props.parent.onFilterAction(params);
    }

    const clearFilter = () => {
        props.parent.onFilterAction(null);
    }

    const filterItems = data.layer_filter.map(item => {
        return (
            <FilterItem
                key={item.attribute}
                filter={item}
                selectedFilters={data.layer_state}
                clickedFilter={(newFilteredData) => {
                    filterData[newFilteredData.attribute] = newFilteredData.value;
                }} />
        );
    })

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.parent.state.showFilter}
            onRequestClose={() => {
                console.log('Modal has been closed.');
            }}>
            <TouchableOpacity
                activeOpacity={1}
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
                onPress={() => props.parent.setState({ showFilter: false })}>
                <View style={{ flex: 1, backgroundColor: 'white', marginTop: 134, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                    <View style={{ width: '100%', padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#E4531A' }}>
                        <Text style={{ fontSize: 16, fontFamily: material.fontBold }}>{Identify.__('Filter Product')}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{ height: 35, backgroundColor: '#E4531A', borderRadius: 5, paddingHorizontal: 30, justifyContent: 'center' }}
                                onPress={applyFilter}>
                                <Text style={{ color: 'white', fontFamily: material.fontBold }}>{Identify.__('Apply')}</Text>
                            </TouchableOpacity>
                            {filtered && <TouchableOpacity
                                style={{ height: 35, paddingHorizontal: 10, justifyContent: 'center', marginLeft: 10 }}
                                onPress={clearFilter}>
                                <Text style={{ color: '#E4531A', fontFamily: material.fontBold }}>{Identify.__('Clear')}</Text>
                            </TouchableOpacity>}
                        </View>
                    </View>
                    <ScrollView>
                        {filterItems}
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
    );

}

export default FilterPopup;