import React from 'react';
import Abstract from './Abstract';
import { DatePickerIOS, DatePickerAndroid, Platform, View, TouchableOpacity } from 'react-native';
import { Text } from 'native-base'

class DateField extends Abstract {

    constructor(props) {
        super(props);
        this.state = { chosenDate: new Date() };

        this.setDate = this.setDate.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        this.parent.updatePrices();
    }

    setDate(newDate) {
        this.setState({chosenDate: newDate});
        this.parent.updatePrices();
    }

    getValues() {
        if (this.state.chosenDate == undefined) {
            return '';
        }
        return this.convertDate();
    }

    convertDate = () => {
        let d = this.state.chosenDate.getDate();
        let m = this.state.chosenDate.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        let y = this.state.chosenDate.getFullYear();
        return {
            year: y,
            month: parseInt(m, 10),
            day: d
        }
    };

    renderIOS() {
        return (
            <DatePickerIOS
                mode='date'
                date={this.state.chosenDate ? this.state.chosenDate : new Date()}
                onDateChange={this.setDate} />
        );
    }

    renderAndroid() {
        let dateObject = this.convertDate();
        let dateText = dateObject['day'] + '/' + dateObject['month'] + '/' + dateObject['year'];
        return (
            <TouchableOpacity onPress={async () => {
                try {
                    const { action, year, month, day } = await DatePickerAndroid.open({
                        date: new Date()
                    });
                    if (action !== DatePickerAndroid.dismissedAction) {
                        let date = new Date(year, month, day);
                        this.setDate(date);
                    }
                } catch ({ code, message }) {
                    console.log('Cannot open date picker', message);
                }
            }}>
                <Text style={{ marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5 }}>Select date: {dateText}</Text>
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
export default DateField;
