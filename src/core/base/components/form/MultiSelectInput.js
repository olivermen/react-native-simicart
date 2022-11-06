import React from 'react';
import BaseInput from './BaseInput';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, Label, Item, Text } from 'native-base';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';

export default class MultiSelectInput extends BaseInput {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            value: [],
            showSelections: false
        };
    }

    initData() {
        super.initData();
        this.dataSource = JSON.parse(JSON.stringify(this.props.dataSource));
        this.keyForSave = this.props.keyForSave;
        this.keyForDisplay = this.props.keyForDisplay;
    }

    onSelectValue(item, isSelected) {
        item.selected = !isSelected;
        let values = this.state.value;
        if (isSelected) {
            let indexValue = values.indexOf(item[this.keyForSave]);
            values.splice(indexValue, 1);
        } else {
            values.push(item[this.keyForSave]);
        }
        this.setState({ value: values });
        let validated = false;
        if (this.props.required && value || !this.props.required) {
            validated = true;
        }
        this.parent.updateFormData(this.inputKey, values, validated);
    }

    renderItems() {
        let items = [];

        let dataSource = this.dataSource;
        for (let index in dataSource) {
            let item = dataSource[index];
            let isSelected = item.selected;
            items.push(
                <TouchableOpacity
                    key={Identify.makeid()}
                    onPress={() => {
                        this.onSelectValue(item, isSelected);
                    }}>
                    <View style={{ flex: 1, flexDirection: 'row', height: 40, alignItems: 'center', borderBottomColor: '#EDEDED', borderBottomWidth: 0.5 }}>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ marginRight: 30, fontSize: 13 }}>{item[this.keyForDisplay]}</Text>
                        {isSelected == true && <Icon name="ios-checkmark-outline" style={{ position: 'absolute', right: 0 }} />}
                    </View>
                </TouchableOpacity>
            );
        }

        return items;
    }

    createLabels() {
        let label = '';
        this.dataSource.forEach(element => {
            if (this.state.value.indexOf(element.value) != -1) {
                label += element.label + ',';
            }
        });
        label = label.slice(0, -1);
        return label;
    }

    createInputLayout() {
        let text = this.createLabels();
        let items = this.renderItems();
        return (
            <View>
                <Item style={styles.item} inlineLabel onPress={() => {
                    this.setState((previousState) => {
                        return { showSelections: !previousState.showSelections }
                    })
                }}>
                    <Label>{this.inputTitle}</Label>
                    <View style={styles.boundView}>
                        <Text style={styles.value} numberOfLines={1} ellipsizeMode={'tail'}>
                            {text}
                        </Text>
                    </View>
                    <Icon name={this.state.showSelections ? 'ios-arrow-up' : 'ios-arrow-down'} />
                </Item>
                {this.state.showSelections && items}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    item: {
        marginLeft: 0,
        paddingLeft: 0,
        paddingBottom: 0,
        flex: 1,
        height: 40,
        marginTop: 30
    },
    placeholder: {
        flex: 1,
        fontSize: material.textSizeBigger,
        color: '#808080',
    },
    value: {
        flex: 1,
        fontSize: material.textSizeBigger,
        color: 'black',
        marginRight: 10,
        fontSize: 13
    },
    boundView: {
        flex: 1,
        flexDirection: 'row'
    }
});