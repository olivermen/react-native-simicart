import React from 'react';
import material from '../../../../../native-base-theme/variables/material';
import { Item, Text, Label, View } from 'native-base';
import { StyleSheet, DatePickerIOS, DatePickerAndroid, Platform } from 'react-native';
import Identify from "@helper/Identify";
import BaseInput from './BaseInput';

export default class DateInput extends BaseInput {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            showDatePicker: false
        };
    }

    updateNewDate(newDate) {
        let day = newDate.getDate();
        day = day < 10 ? '0' + day : day;
        let month = newDate.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        let year = newDate.getFullYear();
        let date = month + '/' + day + '/' + year;
        this.setState({ value: date });
        this.state.value = date;
        this.parent.updateFormData(this.inputKey, date, true);
    }

    async showPickerAndroid() {
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
              date: new Date()
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                let date = new Date(year, month, day);
                this.updateNewDate(date);
            }
          } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
          }
    }

    renderPickerIOS() {
        if (this.state.showDatePicker) {
            let currentDate = new Date();
            if (this.state.value !== '') {
                currentDate = new Date(this.state.value);
            }
            return (
                <View>
                    <DatePickerIOS
                        mode='date'
                        initialDate={currentDate}
                        date={currentDate}
                        minimumDate={new Date(1900, 0, 1)}
                        onDateChange={(newDate) => this.updateNewDate(newDate)} />
                    <Item />
                </View>
            )
        } else {
            return (<View />)
        }
    }

    updateDatePicker() {
        if(Platform.OS === 'ios') {
            this.setState((previousState) => {
                return { showDatePicker: !previousState.showDatePicker };
            });
        } else {
            this.showPickerAndroid();
        }
    }

    renderShowText() {
        if (this.state.value === '') {
            return (
                <Text style={styles.placeholder}
                    onPress={() => {
                        this.updateDatePicker();
                    }}>
                    {Identify.__('Select date')}
                </Text>
            )
        } else {
            return (
                <Text style={styles.value}
                    onPress={() => {
                        this.updateDatePicker();
                    }}>
                    {this.state.value}
                </Text>
            )
        }
    }

    createInputLayout() {
        return (
            <View>
                <Item error={this.state.error} success={this.state.success} picker style={styles.item} inlineLabel>
                    <Label>{this.inputTitle}</Label>
                    {this.renderShowText()}
                </Item>
                {this.renderPickerIOS()}
            </View>
        )
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
        fontSize: material.textSizeBigger,
        color: '#808080'
    },
    value: {
        fontSize: material.textSizeBigger,
        color: 'black'
    }
});
