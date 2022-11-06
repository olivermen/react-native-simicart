import React from 'react';
import BaseInput from './BaseInput';
import { Item, Icon, Text, Label } from 'native-base';
import { StyleSheet, Modal, View } from 'react-native';
import FloatingInput from './FloatingInput';
import AdvanceList from '@base/components/advancelist';
import material from '@theme/variables/material';
import Identify from '@helper/Identify';

export default class PickerInput extends BaseInput {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            modalVisible: false
        };
    }

    initData() {
        super.initData();
        this.enableEdit = this.props.enableEdit;
        this.dataSource = this.props.dataSource;
        this.keyForSave = this.props.keyForSave;
        this.keyForDisplay = this.props.keyForDisplay;
    }

    showSelectOptions() {
        this.setState({
            modalVisible: true
        })
    }

    showModal() {
        this.setState({
            modalVisible: false
        })
    }

    handleSelected(type, key, item) {
        this.state.value = item[this.keyForSave];
        this.setState({
            modalVisible: false
        });
        this.parent.updateFormData(this.inputKey, item[this.keyForSave], true);
    }

    generateDataSource() {
        let dataSource = this.dataSource;
        for (let index in dataSource) {
            let item = dataSource[index];
            item['searchStr'] = item[this.keyForDisplay];
            dataSource[index] = item;
        }
        return dataSource;
    }

    renderShowText() {
        let textStyle = styles.placeholder;
        let text = Identify.__('Select ' + this.inputTitle);
        if (this.state.value !== '') {
            textStyle = styles.value;
            let key = this.state.value;
            for (let index in this.dataSource) {
                let item = this.dataSource[index];
                if (item[this.keyForSave] == key) {
                    text = item[this.keyForDisplay];
                    break;
                }
            }
        }
        return (
            <View style={styles.boundView}>
                <Text style={textStyle}
                    onPress={() => {
                        this.showSelectOptions();
                    }}>
                    {Identify.__(text)}
                </Text>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        console.log('Modal has been closed.');
                    }}>
                    <AdvanceList
                        parent={this}
                        data={this.generateDataSource()}
                        title={this.inputTitle}
                    />
                </Modal>
            </View>
        )
    }

    createInputLayout() {
        if (this.enableEdit) {
            return (
                <FloatingInput inputKey={this.inputKey}
                    inputTitle={this.inputTitle}
                    inputType={this.inputType}
                    parent={this.parent}
                    inputValue={this.state.value} />
            );
        } else {
            return (
                <Item error={this.state.error} success={this.state.success} style={[styles.item]} inlineLabel>
                    <Text style={{ color: material.textColor, paddingRight: 10 }}>{this.inputTitle}</Text>
                    {this.renderShowText()}
                    <Icon style={{ color: material.textColor }} name={Identify.isRtl() ? 'ios-arrow-back' : "ios-arrow-forward"} />
                </Item>
            );
        }
    }

}

const styles = StyleSheet.create({
    item: {
        marginLeft: 0,
        paddingLeft: 0,
        paddingBottom: 0,
        flex: 1,
        height: 40,
        marginBottom: 10
    },
    placeholder: {
        flex: 1,
    },
    value: {
        flex: 1,
    },
    boundView: {
        flex: 1,
        flexDirection: 'row'
    }
});