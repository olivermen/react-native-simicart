import React, { useState } from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { Image, View, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Icon, Text } from 'native-base';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';

const FilterItem = ({ filter, selectedFilters, clickedFilter }) => {

    const styleCheckBoxEmpty = {
        borderWidth: 1, borderColor: '#BABABA'
    }
    const styleCheckBoxSelected = {
        backgroundColor: Identify.theme.button_background
    }

    const singleSelect = filter.attribute == 'price' || filter.attribute == 'category_id';

    let isSelected = false;
    let selectedItem = null;
    if (selectedFilters && selectedFilters.length > 0) {
        selectedItem = selectedFilters.find(item => item.attribute == filter.attribute);
        if (selectedItem) {
            isSelected = true;
        }
    }

    const [showOption, setShowOption] = useState(isSelected);
    const [filteredData, setFilteredData] = useState(selectedItem);

    const isValueSelected = (value) => {
        if (filteredData) {
            return singleSelect ? filteredData.value == value : filteredData.value.find(item => item == value);
        }
        return false;
    }

    const sortArray = (array) => {
        array && array.sort((a, b) => {
            return a.label.localeCompare(b.label)
        })
        return array
    }

    const selections = sortArray(filter.filter).map(item => {
        const valueSelected = isValueSelected(item.value);
        return (
            <TouchableOpacity
                key={item.value}
                style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}
                onPress={() => {
                    let newFilteredData = filteredData ? JSON.parse(JSON.stringify(filteredData)) : { attribute: filter.attribute, value: singleSelect ? null : [] };
                    if (newFilteredData.value && valueSelected) {
                        if (singleSelect) {
                            newFilteredData['value'] = '';
                        } else {
                            let index = newFilteredData['value'].indexOf(parseInt(item.value))
                            if (index === -1) return;
                            else newFilteredData['value'].splice(index, 1);
                        }
                    } else {
                        if (singleSelect) {
                            newFilteredData.value = item.value;
                        } else {
                            newFilteredData.value.push(parseInt(item.value));
                        }
                    }
                    setFilteredData(newFilteredData);
                    clickedFilter(newFilteredData);
                }}>
                <View style={[{ width: 16, height: 16, borderRadius: 3, alignItems: 'center', justifyContent: 'center' }, valueSelected ? styleCheckBoxSelected : styleCheckBoxEmpty]}>
                    {valueSelected && <Icon name={"md-checkmark"} style={{ fontSize: 12, left: 0, color: 'white' }} />}
                </View>
                <Text style={{ fontSize: 12, fontFamily: material.fontBold, marginLeft: 20, paddingTop: 2 }}>{item.label}</Text>
            </TouchableOpacity>
        );
    });

    return (
        <>
            <TouchableOpacity
                style={{ padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                onPress={() => setShowOption(!showOption)}>
                <Text style={{ fontSize: 12, fontFamily: material.fontBold }}>{Identify.__(filter.title)}</Text>
                <Icon
                    style={{ fontSize: 18, color: 'black' }}
                    name={showOption ? "ios-arrow-up" : "ios-arrow-down"} />
            </TouchableOpacity>
            {showOption && selections}
        </>
    );
}

export default FilterItem;