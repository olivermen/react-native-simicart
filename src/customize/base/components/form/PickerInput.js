import React from 'react';
import BaseInput from '@base/components/form/BaseInput';
import { Item, Icon, Text, Label } from 'native-base';
import { StyleSheet, Modal, View } from 'react-native';
import FloatingInput from '@base/components/form/FloatingInput';
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
        this.iconName = this.props.iconName;
        this.inputTitle = this.props.inputTitle;
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
        let text = Identify.__('Please select option');
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
                        if (this.props.disable) {
                            return;
                        }
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
                <View style={{ marginTop: 20 }}>
                    {this.props.showLabel &&
                        <Text style={{ flex: 1, marginBottom: 5 }}>
                            {this.inputTitle} <Text style={{ color: '#ED1C24' }}>{this.props.required ? '*' : ''}</Text>
                        </Text>}
                    <Item
                        error={this.state.error}
                        success={this.state.success}
                        style={[styles.item, { opacity: this.props.disable ? 0.5 : 1 }]}
                        inlineLabel>
                        {this.renderShowText()}
                        <Icon style={{ color: material.textColor }} name={Identify.isRtl() ? 'ios-arrow-back' : "ios-arrow-forward"} />
                    </Item>
                </View>
            );
        }
    }

}

const styles = StyleSheet.create({
    item: {
        marginLeft: 0,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 0,
        flex: 1,
        height: 50,
        borderRadius: 5,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderColor: '#C5CBD5'
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