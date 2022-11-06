import React from 'react';
import Abstract from './Abstract';
import { DatePickerIOS, Platform, View } from 'react-native';
import DatePicker from './date';
import TimePicker from './time';

class DateTime extends Abstract {

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
        if(this.state.chosenDate == undefined) {
            return '';
        }
        return Platform.OS === 'ios' ? this.convertDateTimeIos() : this.convertDateTimeAndroid();
    }

    convertDateTimeIos = () => {
        let day = this.state.chosenDate.getDate();
        let month = this.state.chosenDate.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        let year = this.state.chosenDate.getFullYear();

        let hours = this.state.chosenDate.getHours();
        hours = hours < 10 ? '0' + hours : hours.toString();
        let minutes = this.state.chosenDate.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes.toString();

        return {
            year: year,
            month: parseInt(month, 10),
            day: day,
            hour: hours,
            minute: minutes
        }
    };

    convertDateTimeAndroid() {
        return {
            ...this.datePicker.getValues(),
            ...this.timePicker.getValues(),
        };
    }

    renderIOS() {
        return (
            <DatePickerIOS
                mode='datetime'
                date={this.state.chosenDate ? this.state.chosenDate : new Date()}
                onDateChange={this.setDate}
                format={'HH:mm'} />
        );
    }

    renderAndroid() {
        return (
            <View>
                <DatePicker id={this.props.id} parent={this.props.parent} onRef={ref => (this.datePicker = ref)} />
                <TimePicker id={this.props.id} parent={this.props.parent} onRef={ref => (this.timePicker = ref)} />
            </View>
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
export default DateTime;
