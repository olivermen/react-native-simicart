import React from 'react';
import BaseInput from './BaseInput';
import { View, StyleSheet, Platform, Picker } from 'react-native';
import { Icon, Label, Item, Header, Title, Body, Left, Right, Button, Text } from 'native-base';
import Identify from '@helper/Identify';
import material from '../../../../../native-base-theme/variables/material';

export default class DropDownInput extends BaseInput {

    constructor(props) {
        super(props);
        this.toolbarHeight = material.toolbarHeight;
        this.paddingTop = Platform.OS === 'ios' ? 18 : 0;
        this.initData();
    }

    initData() {
        super.initData();
        this.dataSource = JSON.parse(JSON.stringify(this.props.dataSource));
        this.keyForSave = this.props.keyForSave;
        this.keyForDisplay = this.props.keyForDisplay;

        if (Platform.OS === 'android') {
            this.dataSource.unshift({
                value: '00',
                label: '-- ' + Identify.__('Please Select') + ' --'
            });
        }

    }

    onValueChange(value) {
        this.setState({ value: value });
        let validated = false;
        if (this.props.required && value || !this.props.required) {
            validated = true;
        }
        this.parent.updateFormData(this.inputKey, value, validated);
    }

    renderItems() {
        let items = [];

        let dataSource = this.dataSource;
        for (let index in dataSource) {
            let item = dataSource[index];
            items.push(
                <Picker.Item style={{ fontFamily: material.fontFamily }} key={Identify.makeid()} value={item[this.keyForSave].toString()}
                    label={Identify.__(item[this.keyForDisplay])}
                    color={material.textColor} />
            );
        }

        return items;
    }

    createInputLayout() {
        return (
            <View>
                {/* <Item error={this.state.error} success={this.state.success} picker style={styles.item} inlineLabel> */}
                <View style={styles.item}>
                    <Text>{this.inputTitle}</Text>
                    <Picker
                        renderHeader={backAction =>
                            <Header style={{
                                backgroundColor: Identify.theme.app_background,
                                elevation: 0,
                                height: this.toolbarHeight,
                                paddingTop: this.paddingTop
                            }}>
                                <Left>
                                    <Button transparent onPress={backAction}>
                                        <Icon name={"md-close"} style={{ color: Identify.theme.button_background }} />
                                    </Button>
                                </Left>
                                <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                                    <Title style={{ color: Identify.theme.content_color }}>{this.inputTitle}</Title>
                                </Body>
                                <Right />
                            </Header>}
                        mode="dropdown"
                        iosIcon={<Icon name="ios-arrow-down" />}
                        selectedValue={this.state.value}
                        onValueChange={(value) => { this.onValueChange(value) }}
                        itemTextStyle={{ color: material.textColor }}
                        textStyle={{ color: material.textColor }}>
                        {this.renderItems()}
                    </Picker>
                </View>
                {/* </Item> */}
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
        marginBottom: 20
    },
    placeholder: {
        fontSize: material.textSizeBigger,
        color: '#808080'
    },
    value: {
        fontSize: material.textSizeBigger,
        color: 'black'
    }
});