import React from 'react';
import BaseInput from '@base/components/form/BaseInput';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Icon, Label, Item, Text } from 'native-base';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';

export default class CardTypeInput extends BaseInput {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            showSelections: false,
        };
        this.initData();
    }

    initData() {
        super.initData();
        this.dataSource = JSON.parse(JSON.stringify(this.props.dataSource));
        this.keyForSave = this.props.keyForSave;
        this.keyForDisplay = this.props.keyForDisplay;
        this.keyForImage = this.props.keyForImage;
    }

    onSelectValue(item) {
        console.log(item)
        this.dataSource.forEach(element => {
            if (element[this.keyForSave] == item[this.keyForSave]) {
                element.selected = true;
            } else {
                element.selected = false;
            }
        });
        this.setState({ value: item[this.keyForSave] });
        let validated = true;
        this.parent.updateFormData(this.inputKey, item[this.keyForSave], validated);
    }

    createImageSource(item) {
        let source = null;
        switch (item.cc_code) {
            case 'AE':
                source = require('@media/ic_card_american_express.png');
                break;
            case 'VI':
                source = require('@media/ic_card_visa.png');
                break;
            case 'MC':
                source = require('@media/ic_card_mastercard.png');
                break;
            case 'DI':
                source = require('@media/ic_card_discover.png');
                break;
            case 'JCB':
                source = require('@media/ic_card_jcb.png');
                break;
            default:
                break;
        }
        return source;
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
                        if (!isSelected) {
                            this.onSelectValue(item);
                        }
                    }}>
                    <View style={{ flex: 1, flexDirection: 'row', height: 40, alignItems: 'center', borderBottomColor: '#EDEDED', borderBottomWidth: 0.5 }}>
                        {this.keyForImage ? <Image source={this.createImageSource(item)} style={{ width: 25, height: 25, resizeMode: 'contain', marginRight: 10 }} /> : null}
                        <Text
                            numberOfLines={1}
                            ellipsizeMode={'tail'}
                            style={{ marginRight: 30, fontSize: 13 }}>{item[this.keyForDisplay]}</Text>
                        {isSelected == true && <Icon name="md-checkmark" style={{ position: 'absolute', right: 0, fontSize: 18 }} />}
                    </View>
                </TouchableOpacity>
            );
        }

        return items;
    }

    createLabels() {
        let label = '';
        this.dataSource.forEach(element => {
            if (this.state.value == element[this.keyForSave]) {
                label = element[this.keyForDisplay];
                if (!element.selected || element.selected == false) {
                    element.selected = true
                }
                return;
            }
        });
        return label;
    }

    createInputLayout() {
        let text = this.createLabels();
        let items = this.renderItems();
        return (
            <View style={{ marginBottom: 20 }}>
                <Item style={styles.item} inlineLabel onPress={() => {
                    this.setState((previousState) => {
                        return { showSelections: !previousState.showSelections }
                    })
                }}>
                    <Label style={{ color: material.textColor }}>{this.inputTitle}</Label>
                    <View style={styles.boundView}>
                        <Text style={styles.value} numberOfLines={1} ellipsizeMode={'tail'}>
                            {text}
                        </Text>
                    </View>
                    <Icon name={this.state.showSelections ? 'md-arrow-dropup' : 'md-arrow-dropdown'} />
                </Item>
                {this.state.showSelections && items}
            </View>
        );
    }

    render() {
        return (
            <View>
                {this.createInputLayout()}
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