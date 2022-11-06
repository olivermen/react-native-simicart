import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native'
import { Text, Icon, Textarea, Picker, Header, Left, Button, Title, Body, Right } from 'native-base';
import material from '@theme/variables/material';
import Identify from '@helper/Identify';
import SimiCart from '@helper/simicart';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Timezones from './timezones.json';

const EmailFriend = ({ submitEmailFormData, submitNotiFormData }) => {

    const styleCheckBoxEmpty = {
        borderWidth: 1, borderColor: '#BABABA'
    }
    const styleCheckBoxSelected = {
        backgroundColor: Identify.theme.button_background
    }

    const [showEmailForm, setShowEmailForm] = useState(false);
    const [showNotiForm, setShowNotiForm] = useState(false);
    const [showDatePicker, setShowshowDatePicker] = useState(false);
    const [emailFormData, setEmailFormData] = useState({
        senderName: undefined,
        recipientName: undefined,
        recipientEmail: undefined,
        customMessage: undefined
    });
    const [notiFormData, setNotiFormData] = useState({
        dayToSend: null,
        timezone: Timezones[0].tzCode
    });

    const getInitDate = () => {
        let initDate = new Date;
        if (notiFormData.dayToSend) {
            const splits = notiFormData.dayToSend.split('-');
            initDate.setDate(parseInt(splits[2]));
            initDate.setMonth(parseInt(splits[1]) - 1);
            initDate.setFullYear(parseInt(splits[0]));
        }
    }

    const updateNewDate = (newDate) => {
        let day = newDate.getDate();
        day = day < 10 ? '0' + day : day;
        let month = newDate.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        let year = newDate.getFullYear();
        let date = year + '-' + month + '-' + day;
        setShowshowDatePicker(false);
        setNotiFormData({
            ...notiFormData,
            dayToSend: date
        });
        submitNotiFormData({
            ...notiFormData,
            enable: true,
            dayToSend: date
        });
    }

    const handleEmailFormData = (formData) => {
        setEmailFormData(formData);
        submitEmailFormData({
            ...formData,
            enable: true
        });
    }

    const emailForm = (
        <View>
            <Text style={{ marginTop: 10 }}>{Identify.__('Sender Name')} ({Identify.__('optional')})</Text>
            <TextInput
                style={{ width: '100%', height: 50, borderRadius: 5, borderColor: '#C5CBD5', borderWidth: 1, paddingHorizontal: 10 }}
                onChangeText={(text) => handleEmailFormData({ ...emailFormData, senderName: text })} />
            <Text style={{ marginTop: 10 }}>{Identify.__('Recipient name')}<Text style={{ color: '#D51C17' }}>*</Text></Text>
            <TextInput
                style={{ width: '100%', height: 50, borderRadius: 5, borderColor: '#C5CBD5', borderWidth: 1, paddingHorizontal: 10 }}
                onChangeText={(text) => handleEmailFormData({ ...emailFormData, recipientName: text })} />
            <Text style={{ marginTop: 10 }}>{Identify.__('Recipient email address')}<Text style={{ color: '#D51C17' }}>*</Text></Text>
            <TextInput
                style={{ width: '100%', height: 50, borderRadius: 5, borderColor: '#C5CBD5', borderWidth: 1, paddingHorizontal: 10 }}
                onChangeText={(text) => handleEmailFormData({ ...emailFormData, recipientEmail: text })} />
            <Text style={{ marginTop: 10 }}>{Identify.__('Custom message')}</Text>
            <Textarea
                rowSpan={5}
                style={{ width: '100%', borderRadius: 5, borderColor: '#C5CBD5', borderWidth: 1 }}
                onChangeText={(text) => handleEmailFormData({ ...emailFormData, customMessage: text })} />
        </View>
    );

    const timezoneOptions = Timezones.map((item, index) => {
        return (
            <Picker.Item
                style={{ fontFamily: material.fontFamily }}
                key={index}
                value={item.tzCode}
                label={item.label}
                color={material.textColor} />
        );
    })

    const notiForm = (
        <View style={{ marginTop: 10 }}>
            <Text>{Identify.__('Day to send')}<Text style={{ color: '#D51C17' }}>*</Text></Text>
            <TouchableOpacity
                style={{ width: '50%', height: 50, borderRadius: 5, borderColor: '#C5CBD5', borderWidth: 1, paddingHorizontal: 10, justifyContent: 'center' }}
                onPress={() => setShowshowDatePicker(true)}>
                <Text style={{ fontSize: 16 }}>{notiFormData.dayToSend ?? Identify.__('Select Date')}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={showDatePicker}
                minimumDate={new Date()}
                mode="date"
                onConfirm={updateNewDate}
                onCancel={() => setShowshowDatePicker(false)}
                cancelTextIOS={Identify.__('Cancel')}
                confirmTextIOS={Identify.__('Confirm')}
                date={getInitDate()}
            />
            <Text style={{marginTop: 10}}>{Identify.__('Timezone')}<Text style={{ color: '#D51C17' }}>*</Text></Text>
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
                                <Icon name={"md-close"} style={{ color: Identify.theme.textColor }} />
                            </Button>
                        </Left>
                        <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                            <Title style={{ color: Identify.theme.textColor }}>{Identify.__('Select a timezone')}</Title>
                        </Body>
                        <Right />
                    </Header>}
                mode="dropdown"
                iosIcon={<Icon name="ios-arrow-down" style={{ color: material.textColor }} />}
                selectedValue={notiFormData.timezone}
                onValueChange={(value) => {
                    setNotiFormData({
                        ...notiFormData,
                        timezone: value
                    })
                    submitNotiFormData({
                        ...notiFormData,
                        enable: true,
                        timezone: value
                    });
                }}
                style={{ width: '100%', height: 50, borderWidth: 1, borderColor: '#C5CBD5', borderRadius: 5 }}
                itemTextStyle={{ color: material.textColor, fontFamily: material.fontFamily }}
                textStyle={{ color: material.textColor, textAlign: 'center' }}>
                {timezoneOptions}
            </Picker>
        </View>
    );

    return (
        <View style={{ marginTop: 20, paddingRight: 12 }}>
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => {
                    if (showEmailForm) {
                        submitEmailFormData({
                            enable: false,
                            senderName: undefined,
                            recipientName: undefined,
                            recipientEmail: undefined,
                            customMessage: undefined
                        });
                    } else {
                        setShowEmailForm(!showEmailForm);
                        submitEmailFormData({
                            enable: true,
                            ...emailFormData
                        });
                    }
                }}>
                <View style={[{ width: 20, height: 20, borderRadius: 3, alignItems: 'center', justifyContent: 'center' }, showEmailForm ? styleCheckBoxSelected : styleCheckBoxEmpty]}>
                    {showEmailForm && <Icon name={"md-checkmark"} style={{ fontSize: 12, left: 0, color: 'white' }} />}
                </View>
                <Text style={{ fontFamily: material.fontBold, fontSize: 16, marginLeft: 20, paddingTop: 2 }}>{Identify.__('Email this Gift voucher to a friend')}</Text>
            </TouchableOpacity>
            {showEmailForm && emailForm}
            {showEmailForm && <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}
                onPress={() => {
                    if (showNotiForm) {
                        submitNotiFormData({
                            enable: false,
                            dayToSend: null,
                            timezone: null
                        });
                    } else {
                        setShowNotiForm(!showNotiForm);
                        submitNotiFormData({
                            enable: true,
                            ...notiFormData
                        });
                    }
                }}>
                <View style={[{ width: 20, height: 20, borderRadius: 3, alignItems: 'center', justifyContent: 'center' }, showNotiForm ? styleCheckBoxSelected : styleCheckBoxEmpty]}>
                    {showNotiForm && <Icon name={"md-checkmark"} style={{ fontSize: 12, left: 0, color: 'white' }} />}
                </View>
                <Text style={{ fontFamily: material.fontBold, fontSize: 16, marginLeft: 20, paddingTop: 2 }}>{Identify.__('Get a notification email when your friend receives the Gift Voucher')}</Text>
            </TouchableOpacity>}
            {showEmailForm && showNotiForm && notiForm}
        </View>
    );

}

export default EmailFriend;