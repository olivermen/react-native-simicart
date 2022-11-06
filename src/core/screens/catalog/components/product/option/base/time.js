import React from 'react';
import Abstract from './Abstract';
import { DatePickerIOS, TimePickerAndroid, Platform, View, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';

class Time extends Abstract {

    constructor(props) {
        super(props);
        this.state = { chosenTime: new Date() };

        this.setDate = this.setDate.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        this.parent.updatePrices();
    }

    setDate(newDate) {
        this.setState({chosenTime: newDate});
        this.parent.updatePrices();
    }

    getValues() {
        if(this.state.chosenTime == undefined) {
            return '';
        }
        return this.convertTime();
    }

    convertTime = () => {
        let h = this.state.chosenTime.getHours();
        h = h < 10 ? '0' + h : h.toString();
        let m = this.state.chosenTime.getMinutes();
        m = m < 10 ? '0' + m : m.toString();
        return {
            hour: h,
            minute: m
        }
    };

    renderIOS() {
        return (
            <DatePickerIOS
                mode='time'
                date={this.state.chosenTime ? this.state.chosenTime : new Date()}
                onDateChange={this.setDate} />
        );
    }

    renderAndroid() {
        let timeObject = this.convertTime();
        let timeText = timeObject['hour'] + ':' + timeObject['minute'];
        return (
            <TouchableOpacity onPress={async () => {
                try {
                    const { action, hour, minute } = await TimePickerAndroid.open({
                        hour: 12,
                        minute: 0,
                        is24Hour: true,
                    });
                    if (action !== TimePickerAndroid.dismissedAction) {
                        let date = new Date();
                        date.setHours(hour, minute);
                        this.setDate(date);
                    }
                } catch ({ code, message }) {
                    console.warn('Cannot open time picker', message);
                }
            }}>
                <Text style={{ marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5 }}>Select time: {timeText}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View>
                {Platform.OS === 'ios' ? this.renderIOS() : this.renderAndroid()}
            </View>
        );
    }
}
export default Time;
