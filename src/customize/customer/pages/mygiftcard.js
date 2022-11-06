import React from 'react';
import { connect } from 'react-redux';
import SimiPageComponent from '@base/components/SimiPageComponent';
import { Alert, Image, TextInput, TouchableOpacity, View, Linking } from 'react-native';
import { Content, Container, Text, Button, Toast } from 'native-base';
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
            showLoading: 'full',
            data: null,
            showAddGiftcard: false
        }
        this.giftcodeToAdd = '';
    }

    componentDidMount() {
        this.getMyGiftcards();
    }

    setData(data, requestId) {
        if (requestId == 'mygiftcards') {
            this.setState({
                showLoading: 'none',
                data: data.giftvouchers,
                showAddGiftcard: false
            });
        } else if (requestId == 'add_giftcode' || requestId == 'delete_giftcode') {
            if (data && data.success) {
                this.getMyGiftcards();
                Toast.show({
                    text: Identify.__(requestId == 'delete_giftcode' ? 'Delete gift code successfully' : 'Add gift card successfully'),
                    type: "success", textStyle: { fontFamily: variable.fontFamily }, duration: 3000
                })
            } else {
                Toast.show({
                    text: Identify.__(requestId == 'delete_giftcode' ? 'Delete gift code unsuccessfully' : 'Add gift card unsuccessfully'),
                    type: "danger", textStyle: { fontFamily: variable.fontFamily }, duration: 3000
                })
            }
        }
    }

    getMyGiftcards = () => {
        new NewConnection()
            .init('simiconnector/rest/v2/mygiftcards', 'mygiftcards', this)
            .addGetData({ limit: 100 })
            .connect();
    }

    addGiftCode = () => {
        if (!this.giftcodeToAdd) {
            Toast.show({
                text: Identify.__('Gift code is not valid'),
                type: "warning", textStyle: { fontFamily: variable.fontFamily }, duration: 3000
            })
            return;
        }
        this.showLoading('dialog');
        new NewConnection()
            .init('simiconnector/rest/v2/mygiftcards', 'add_giftcode', this, 'POST')
            .addBodyData({ gift_code: this.giftcodeToAdd })
            .connect();
    }

    showDeletePopup(id) {
        Alert.alert(
            Identify.__('Warning'),
            Identify.__('Are you sure you want to delete this gift code?'),
            [
                { text: Identify.__('Cancel'), onPress: () => { style: 'cancel' } },
                {
                    text: Identify.__('OK'), onPress: () => {
                        this.showLoading('dialog');
                        new NewConnection()
                            .init('simiconnector/rest/v2/mygiftcards', 'delete_giftcode', this, 'DELETE')
                            .addBodyData({ voucher_id: id })
                            .connect();
                    }
                },
            ],
            { cancelable: true }
        );
    }

    renderListVouchers = () => {
        const items = this.state.data.map(item => {
            let status = null;
            if (item.status == 1) {
                status = 'Pending';
            } else if (item.status == 2) {
                status = 'Active';
            } else if (item.status == 3) {
                status = 'Disabled';
            } else if (item.status == 4) {
                status = 'Used';
            } else if (item.status == 5) {
                status = 'Expired';
            } else if (item.status == 7) {
                status = 'Refunded';
            }
            return (
                <View key={item.voucher_id} style={{ backgroundColor: '#F8F8F8', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row-reverse', width: '100%' }}>
                    {status && <View style={{ height: 25, backgroundColor: item.status == 2 ? '#39A935' : item.status == 4 ? '#D51C17' : '#7A7A7A', paddingHorizontal: 10, justifyContent: 'center', borderRadius: 4 }}>
                        <Text style={{ fontSize: 12, fontFamily: variable.fontBold, color: 'white' }}>{Identify.__(status)}</Text>
                    </View>}
                    <View style={{ flex: 1 }}>
                        <View>
                            <Text style={{ color: '#333333' }}>{Identify.__('Code')}:</Text>
                            <Text style={{ fontFamily: variable.fontBold, marginTop: 5 }}>{item.gift_code_hide}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 16 }}>
                            <Text style={{ color: '#333333' }}>{Identify.__('Current Balance')}:</Text>
                            <Text style={{ fontFamily: variable.fontBold, marginLeft: 10 }}>{item.currency} {item.balance}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 8 }}>
                            <Text style={{ color: '#333333' }}>{Identify.__('Added Date')}:</Text>
                            <Text style={{ fontFamily: variable.fontBold, marginLeft: 10 }}>{item.added_date ? item.added_date.split(' ')[0] : ''}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 8 }}>
                            <Text style={{ color: '#333333' }}>{Identify.__('Expired Date')}:</Text>
                            <Text style={{ fontFamily: variable.fontBold, marginLeft: 10 }}>{item.expired_at ?? ''}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                            <Text
                                style={{ color: '#E4531A', fontFamily: variable.fontBold, textDecorationLine: 'underline' }}
                                onPress={() => {
                                    NavigationManager.openPage(this.props.navigation, 'GiftcardDetail', { data: item });
                                }}>
                                {Identify.__('View')}
                            </Text>
                            <View style={{ width: 1, height: 10, backgroundColor: '#4C4C4C', marginHorizontal: 10 }} />
                            <Text
                                style={{ color: '#E4531A', fontFamily: variable.fontBold, textDecorationLine: 'underline' }}
                                onPress={() => {
                                    if (item.print_link) {
                                        Linking.openURL(item.print_link);
                                    }
                                }}>
                                {Identify.__('Print')}
                            </Text>
                            <View style={{ width: 1, height: 10, backgroundColor: '#4C4C4C', marginHorizontal: 10 }} />
                            <Text
                                style={{ color: '#E4531A', fontFamily: variable.fontBold, textDecorationLine: 'underline' }}
                                onPress={() => {
                                    this.showDeletePopup(item.customer_voucher_id)
                                }}>
                                {Identify.__('Remove')}
                            </Text>
                        </View>
                    </View>
                </View>
            );
        })
        return (
            <View style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: 16, marginBottom: 12 }}>{Identify.__('Gift Codes')}</Text>
                {items}
            </View>
        );
    }

    renderPhoneLayout() {
        if (!this.state.data) {
            return null;
        }
        const noGiftVouchers = (
            <View style={{ backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#C5CBD5', borderRadius: 5, paddingHorizontal: 30, paddingVertical: 15 }}>
                <Text style={{ fontSize: 16, textAlign: 'center' }}>{Identify.__('There are no gift codes matching this selection')}.</Text>
            </View>
        );
        const addGiftcardForm = (
            <View>
                <Text style={{ fontSize: 16, fontFamily: variable.fontBold, marginTop: 20 }}>{Identify.__('Add a Gift Card')}</Text>
                <Text style={{ marginTop: 15 }}>{Identify.__('Gift Card Code')}<Text style={{ color: '#D51C17' }}>*</Text></Text>
                <TextInput
                    placeholder={Identify.__('Enter Gift Card Code') + '*'}
                    style={{ width: '100%', height: 50, borderRadius: 5, borderColor: '#C5CBD5', borderWidth: 1, marginTop: 5, paddingHorizontal: 10 }}
                    onChangeText={(text) => {
                        this.giftcodeToAdd = text;
                    }} />
                <Button
                    full
                    onPress={() => this.addGiftCode()}
                    style={{ flex: 1, height: 50, borderRadius: 3, marginTop: 15 }}>
                    <Text style={{ color: Identify.theme.button_text_color, fontFamily: variable.fontBold, fontSize: 16 }}>{Identify.__("Add to Your List")}</Text>
                </Button>
                <Text style={{ color: '#096BB3', marginTop: 30, textDecorationLine: 'underline' }} onPress={() => this.setState({ showAddGiftcard: false })}>{Identify.__('BACK')}</Text>
            </View>
        );
        return (
            <Container style={{ paddingHorizontal: 12 }}>
                <Content showsVerticalScrollIndicator={false}>
                    <Text style={{ fontSize: 20, fontFamily: variable.fontBold, marginTop: 30 }}>{Identify.__('Gift Cards')}</Text>
                    {this.state.showAddGiftcard ? addGiftcardForm : <>
                        <View style={{ flexDirection: 'row-reverse', marginBottom: 30, marginTop: 20 }}>
                            <TouchableOpacity
                                style={{ borderRadius: 3, backgroundColor: '#E4531A', height: 50, justifyContent: 'center', paddingHorizontal: 10 }}
                                onPress={() => {
                                    this.giftcodeToAdd = '';
                                    this.setState({ showAddGiftcard: true });
                                }}>
                                <Text style={{ fontSize: 16, fontFamily: variable.fontBold, color: 'white' }}>{Identify.__('Add a Giftcard')}</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1, borderRadius: 5, borderWidth: 1, borderColor: '#C5CBD5', marginLeft: 10, flexDirection: 'row-reverse', paddingHorizontal: 16, alignItems: 'center' }}>
                                <Image source={require('../../icon/icon-search.png')} style={{ tintColor: 'black', width: 21, height: 21 }} />
                                <TextInput
                                    placeholder={Identify.__('Search gift card') + '...'}
                                    placeholderTextColor='#747474'
                                    style={{ flex: 1, height: 40, marginRight: 5 }} />
                            </View>
                        </View>
                        {this.state.data.length > 0 ? this.renderListVouchers() : noGiftVouchers}
                    </>}
                </Content>
            </Container>
        );
    }
}