import React from 'react';
import { Icon, Text, Content, View, H2, H3 } from 'native-base';
import SimiPageComponent from '@base/components/SimiPageComponent';
import Identify from '@helper/Identify';
import styles from "./styles";
import { scale } from 'react-native-size-matters';
import { TouchableHighlight, Linking } from 'react-native';
import MapDetail from './MapDetail';

export default class StoreDetail extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.data = this.props.navigation.getParam("item_data", null);
        this.colorIcon = { color: Identify.theme.icon_color };
    }

    componentDidMount() {
        setTimeout(() => this.map.renderMap(), 1000);
    }

    renderTop() {
        let phone = (this.data.phone && this.data.phone != "") ?
            (<TouchableHighlight onPress={() => Linking.openURL(`tel:${this.data.phone}`)} underlayColor="white">
                <View style={styles.row}>
                    <Icon name='md-call' style={[styles.marginItem, this.colorIcon]} />
                    <Text>{this.data.phone}</Text>
                </View>
            </TouchableHighlight>) : null;
        let email = (this.data.email && this.data.email != "") ?
            (<TouchableHighlight onPress={() => Linking.openURL(`mailto:${this.data.email}`)} underlayColor="white">
                <View style={styles.row}>
                    <Icon name='md-mail' style={[styles.marginItem, this.colorIcon]} />
                    <Text>{this.data.email}</Text>
                </View>
            </TouchableHighlight>) : null
        let addressString = '';
        addressString = this.data.address ? addressString + this.data.address : addressString
        addressString = this.data.city ? addressString + ' ' + this.data.city : addressString
        addressString = this.data.country ? addressString + ' ' + this.data.country : addressString

        return (
            <View>
                <H2 style={{ color: 'red', paddingTop: scale(15) }}>{this.data.store_name}</H2>
                <View style={{ flex: 1, marginTop: scale(10), flexDirection: 'column' }}>
                    <View style={styles.row}>
                        <Icon name='md-pin' style={[styles.marginItem, this.colorIcon]} />
                        <Text>{addressString}</Text>
                    </View>
                    {phone}
                    {email}
                </View>
            </View>
        );
    }

    renderOpeningHour() {
        return (
            <View>
                <View style={[styles.row, { marginTop: scale(10) }]}>
                    <Icon name='md-alarm' style={[styles.marginItem, this.colorIcon]} />
                    <H3>{Identify.__('Opening Hours')}</H3>
                </View>
                {this.renderHours("Monday", this.data.monday_status, this.data.monday_open, this.data.monday_close)}
                {this.renderHours("Tuesday", this.data.tuesday_status, this.data.tuesday_open, this.data.tuesday_close)}
                {this.renderHours("Wednesday", this.data.wednesday_status, this.data.wednesday_open, this.data.wednesday_close)}
                {this.renderHours("Thursday", this.data.thursday_status, this.data.thursday_open, this.data.thursday_close)}
                {this.renderHours("Friday", this.data.friday_status, this.data.friday_open, this.data.friday_close)}
                {this.renderHours("Staurday", this.data.saturday_status, this.data.saturday_open, this.data.saturday_close)}
                {this.renderHours("Sunday", this.data.sunday_status, this.data.sunday_open, this.data.sunday_close)}
            </View>
        );
    }

    renderSepicalDays() {
        if (this.data.special_days && this.data.special_days.length > 0) {
            let days = this.data.special_days;
            let items = [];
            for (let i = 0; i < days.length; i++) {
                let item = days[i];
                items.push(
                    <Text key={i}>
                        {item.date + " " + item.time_open + " " + item.time_close}
                    </Text>
                );
            }
            return (
                <View>
                    <View style={[styles.row, { marginTop: scale(10) }]}>
                        <Icon name='md-notifications' style={[styles.marginItem, this.colorIcon]} />
                        <H3>{Identify.__('Special Days')}</H3>
                    </View>
                    {items}
                </View>
            )
        }
        return null;
    }
    renderHolidayDays() {
        if (this.data.holiday_days && !Identify.isEmpty(this.data.holiday_days)) {
            let days = this.data.holiday_days;
            let items = [];
            for (var key in days) {
                let item = days[key];
                items.push(
                    <Text key={key + "holidays"}>
                        {item.date}
                    </Text>
                );
            }

            return (
                <View>
                    <View style={[styles.row, { marginTop: scale(10) }]}>
                        <Icon name='md-time' style={[styles.marginItem, this.colorIcon]} />
                        <H3>{Identify.__('Holiday')}</H3>
                    </View>
                    {items}
                </View>
            )
        }
        return null;
    }

    renderHours(label, status, opentime, closetime) {
        let time = "Close";
        if (status == "1") {
            time = "Open";
            if ((opentime && opentime != "00:00") || (closetime && closetime != "00:00")) {
                time = opentime + " -> " + closetime;
            }
        }
        return (
            <View style={{ flex: 1, flexDirection: 'row', width: scale(240), justifyContent: 'space-between' }}>
                <Text style={styles.marginItem}>{Identify.__(label)}</Text>
                <Text>{Identify.__(time)}</Text>
            </View>
        );
    }

    renderPhoneLayout() {
        if (this.data == null) return null;
        return (
            <Content style={{ marginLeft: 16, marginRight: 16 }}>
                <MapDetail data={this.data} onRef={ref => (this.map = ref)} />
                {this.renderTop()}
                {this.renderOpeningHour()}
                {this.renderSepicalDays()}
                {this.renderHolidayDays()}
            </Content>
        );
    }

}