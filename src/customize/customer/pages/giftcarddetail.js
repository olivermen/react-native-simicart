import React from 'react';
import { connect } from 'react-redux';
import SimiPageComponent from '@base/components/SimiPageComponent';
import { Alert, Image, TextInput, TouchableOpacity, View } from 'react-native';
import { Content, Container, Text, Button, Textarea, Toast } from 'native-base';
import NewConnection from '@base/network/NewConnection';
import variable from '@theme/variables/material';
import { customers } from '@helper/constants';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import AppStorage from '@helper/storage';

export default class MyGiftcard extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            showSendEmail: false
        }
        this.formData = {
            name: '',
            email: '',
            message: ''
        }
    }

    sendEmailToFriend = (voucherId) => {
        if (!this.formData.name) {
            Toast.show({
                text: Identify.__('Recepient name is not valid'),
                type: "warning", textStyle: { fontFamily: variable.fontFamily }, duration: 3000
            })
            return;
        }
        if (!this.formData.email || !Identify.validateEmail(this.formData.email)) {
            Toast.show({
                text: Identify.__('Recepient email is not valid'),
                type: "warning", textStyle: { fontFamily: variable.fontFamily }, duration: 3000
            })
            return;
        }
        this.showLoading('dialog');
        new NewConnection()
            .init('simiconnector/rest/v2/mygiftcards/email', 'send_email', this, 'POST')
            .addBodyData({
                giftvoucher_id: voucherId,
                recipient_name: this.formData.name,
                recipient_email: this.formData.email,
                message: this.formData.message
            })
            .connect();
    }

    setData(data, requestId) {
        this.showLoading('none');
        if (data && data.success) {
            Toast.show({
                text: Identify.__('The gift card email has been sent successful'),
                type: "success", textStyle: { fontFamily: variable.fontFamily }, duration: 3000
            })
        } else {
            Toast.show({
                text: Identify.__('Failed to send gift card email'),
                type: "danger", textStyle: { fontFamily: variable.fontFamily }, duration: 3000
            })
        }
    }

    renderPhoneLayout() {
        const data = this.props.navigation.getParam('data');
        let status = null;
        if (data.status == 1) {
            status = 'Pending';
        } else if (data.status == 2) {
            status = 'Active';
        } else if (data.status == 3) {
            status = 'Disabled';
        } else if (data.status == 4) {
            status = 'Used';
        } else if (data.status == 5) {
            status = 'Expired';
        } else if (data.status == 7) {
            status = 'Refunded';
        }
        const history = data.history.map(item => {
            let action = null;
            if (item.action == 1) {
                action = 'Create';
            } else if (item.action == 2) {
                action = 'Update';
            } else if (item.action == 3) {
                action = 'Mass update';
            } else if (item.action == 5) {
                action = 'Spent on order';
            } else if (item.action == 6) {
                action = 'Refund';
            } else if (item.action == 7) {
                action = 'Redeem';
            } else if (item.action == 8) {
                action = 'Cancel';
            }
            return (
                <View key={item.history_id} style={{ borderRadius: 8, backgroundColor: '#F8F8F8', padding: 20, marginTop: 15 }}>
                    {action && <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontFamily: variable.fontBold }}>{Identify.__('Action')}:</Text>
                        <Text style={{ marginLeft: 7 }}>{Identify.__(action)}</Text>
                    </View>}
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text style={{ fontFamily: variable.fontBold }}>{Identify.__('Balance')}:</Text>
                        <Text style={{ marginLeft: 7 }}>{item.currency} {item.amount}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text style={{ fontFamily: variable.fontBold }}>{Identify.__('Date')}:</Text>
                        <Text style={{ marginLeft: 7 }}>{item.created_at ? item.created_at.split(' ')[0] : ''}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text style={{ fontFamily: variable.fontBold }}>{Identify.__('Balance Change')}:</Text>
                        <Text style={{ marginLeft: 7 }}>{item.currency} {item.order_amount}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text style={{ fontFamily: variable.fontBold }}>{Identify.__('Order')}:</Text>
                        <Text style={{ color: '#E4531A', marginLeft: 7 }}>{item.order_increment_id ?? Identify.__('N/A')}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text style={{ fontFamily: variable.fontBold }}>{Identify.__('Comment')}:</Text>
                        <Text style={{ marginLeft: 7 }}>{item.comments}</Text>
                    </View>
                </View>
            );
        })
        const emailForm = (
            <View>
                <Text style={{ marginTop: 15 }}>{Identify.__('Name')}<Text style={{ color: '#D51C17' }}>*</Text></Text>
                <TextInput
                    style={{ width: '100%', height: 50, borderRadius: 5, borderColor: '#C5CBD5', borderWidth: 1, marginTop: 5, paddingHorizontal: 10 }}
                    onChangeText={(text) => {
                        this.formData['name'] = text;
                    }} />
                <Text style={{ marginTop: 15 }}>{Identify.__('Email Address')}<Text style={{ color: '#D51C17' }}>*</Text></Text>
                <TextInput
                    style={{ width: '100%', height: 50, borderRadius: 5, borderColor: '#C5CBD5', borderWidth: 1, marginTop: 5, paddingHorizontal: 10 }}
                    onChangeText={(text) => {
                        this.formData['email'] = text;
                    }} />
                <Text style={{ marginTop: 15 }}>{Identify.__('Message')}</Text>
                <Textarea
                    rowSpan={5}
                    style={{ width: '100%', borderRadius: 5, borderColor: '#C5CBD5', borderWidth: 1, marginTop: 5 }}
                    onChangeText={(text) => {
                        this.formData['message'] = text;
                    }} />
            </View>
        );
        return (
            <Container style={{ paddingHorizontal: 12 }}>
                <Content showsVerticalScrollIndicator={false}>
                    <Text style={{ fontSize: 20, fontFamily: variable.fontBold, marginTop: 30 }}>{Identify.__('Gift Cards')}</Text>
                    <View style={{ marginBottom: 30, marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#333333', flex: 1, fontSize: 16 }}>{Identify.__('Gift Card Code')}</Text>
                            <Text style={{ fontFamily: variable.fontBold, flex: 1, fontSize: 16 }}>{data.gift_code_hide}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 16, alignItems: 'center' }}>
                            <Text style={{ color: '#333333', flex: 1, fontSize: 16 }}>{Identify.__('Balance')}</Text>
                            <Text style={{ fontFamily: variable.fontBold, marginLeft: 10, flex: 1, fontSize: 16 }}>{data.currency} {data.balance}</Text>
                        </View>
                        {status && <View style={{ flexDirection: 'row', marginTop: 16, alignItems: 'center' }}>
                            <Text style={{ color: '#333333', width: '50%', fontSize: 16 }}>{Identify.__('Status')}</Text>
                            <View style={{ height: 25, backgroundColor: data.status == 2 ? '#39A935' : data.status == 4 ? '#D51C17' : '#7A7A7A', paddingHorizontal: 10, justifyContent: 'center', borderRadius: 4 }}>
                                <Text style={{ fontSize: 12, fontFamily: variable.fontBold, color: 'white' }}>{Identify.__(status)}</Text>
                            </View>
                        </View>}
                        <View style={{ flexDirection: 'row', marginTop: 16, alignItems: 'center' }}>
                            <Text style={{ color: '#333333', flex: 1, fontSize: 16 }}>{Identify.__('Added Date')}</Text>
                            <Text style={{ fontFamily: variable.fontBold, marginLeft: 10, flex: 1, fontSize: 16 }}>{data.added_date ? data.added_date.split(' ')[0] : ''}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 16, alignItems: 'center' }}>
                            <Text style={{ color: '#333333', flex: 1, fontSize: 16 }}>{Identify.__('Expired Date')}</Text>
                            <Text style={{ fontFamily: variable.fontBold, marginLeft: 10, flex: 1, fontSize: 16 }}>{data.expired_at ?? ''}</Text>
                        </View>
                    </View>
                    <Text style={{ fontSize: 20, fontFamily: variable.fontBold, alignItems: 'center' }}>{Identify.__(this.state.showSendEmail ? 'Email to Friend' : 'History')}</Text>
                    <View style={{ width: '100%', height: 1, marginTop: 10, backgroundColor: '#D8D8D8' }} />
                    {this.state.showSendEmail ? emailForm : history}
                    <Button
                        full
                        onPress={() => {
                            if (this.state.showSendEmail) {
                                this.sendEmailToFriend(data.voucher_id)
                            } else {
                                this.setState({ showSendEmail: true });
                            }
                        }}
                        style={{ flex: 1, height: 50, borderRadius: 3, marginVertical: 20 }}>
                        <Text style={{ color: Identify.theme.button_text_color, fontFamily: variable.fontBold, fontSize: 16 }}>{Identify.__("Email to Friend")}</Text>
                    </Button>
                    {this.state.showSendEmail && <Text style={{ color: '#096BB3', marginBottom: 30, textDecorationLine: 'underline' }} onPress={() => this.setState({ showSendEmail: false })}>{Identify.__('BACK')}</Text>}
                </Content>
            </Container>
        );
    }
}