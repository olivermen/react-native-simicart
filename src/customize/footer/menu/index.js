import React from 'react';
import { connect } from 'react-redux';
import { View, Image, Modal, TouchableOpacity, ScrollView, I18nManager } from 'react-native';
import { Text, Spinner, Icon } from 'native-base';
import Identify from '../../../core/helper/Identify';
import material from '../../../../native-base-theme/variables/material';
import NavigationManager from '@helper/NavigationManager';
import SimiPageComponent from '../../../core/base/components/SimiPageComponent';
import SimiCart from '../../../core/helper/simicart';
import NewConnection from '@base/network/NewConnection';
import AppStorage from '@helper/storage';
import { customer_logout, quoteitems } from '@helper/constants';
import Events from '@helper/config/events';
import RNRestart from 'react-native-restart';

class MenuBottomPage extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            showPopup: false
        }
        this.storeConfig = Identify.getMerchantConfig().storeview;
    }

    logout() {
        try {
            this.showLoading('dialog')
            new NewConnection()
                .init(customer_logout, 'customer_logout', this)
                .connect();
        } catch (e) {
            console.log(e.message);
        }
    }

    getQuoteItems() {
        new NewConnection()
            .init(quoteitems, 'get_quoteitems', this)
            .connect();
    }

    setData(data, requestID) {
        if (requestID == 'customer_logout') {
            this.showLoading('none')
            this.props.storeData('clear_all_data', null);
            Identify.setCustomerData(null);
            Identify.setCustomerParams(null);
            AppStorage.removeAutologinInfo();
            AppStorage.removeData(['credit_card']);
            AppStorage.saveData('quote_id', '');

            this.getQuoteItems();

            NavigationManager.backToRootPage(this.props.navigation);
            this.dispatchLogout();
        } else {
            if (data.quote_id && data.quote_id != null && data.quote_id != '') {
                AppStorage.saveData('quote_id', data.quote_id);
            }
        }
    }

    dispatchLogout() {
        if (Identify.getMerchantConfig().storeview.base.force_login && Identify.getMerchantConfig().storeview.base.force_login == '1') {
            if (Identify.isEmpty(Identify.getCustomerData())) {
                NavigationManager.openPage(this.props.navigation, 'Login');
                return;
            }
        }

        for (let i = 0; i < Events.events.splash_completed.length; i++) {
            let node = Events.events.splash_completed[i];
            if (node.force_login && node.force_login === true) {
                if (Identify.isEmpty(Identify.getCustomerData())) {
                    NavigationManager.openPage(this.props.navigation, 'Login');
                    return;
                }
            }
        }
    }

    renderLanguageOptions() {
        const { base, stores } = this.storeConfig;
        return stores.stores[0].storeviews.storeviews.map(item => {
            const isSelected = item.store_id == base.store_id;
            return (
                <TouchableOpacity
                    style={{ paddingVertical: 15, flexDirection: 'row', alignItems: 'center' }} key={item.store_id}
                    onPress={() => {
                        this.setState({ showPopup: false }, () => {
                            this.props.storeData('clear_all_data', null);
                            if (item.code == 'Arabic') {
                                I18nManager.forceRTL(true);
                                AppStorage.saveData('appIsRtl', 'yes');
                            } else {
                                I18nManager.forceRTL(false);
                                AppStorage.saveData('appIsRtl', 'no');
                            }
                            AppStorage.saveData('store_id', item.store_id).then(
                                () => {
                                    RNRestart.Restart()
                                }
                            )
                        });
                    }}>
                    <Image source={item.code == 'Arabic' ? require('../icon/ic_arabic.png') : require('../icon/ic_english.png')} style={{ width: 30, height: 30 }} />
                    <Text style={{ textAlign: 'left', fontSize: 16, marginLeft: 10, color: isSelected ? '#E4531A' : 'black', fontFamily: material.fontBold, flexGrow: 1 }}>{item.name}</Text>
                    {isSelected && <Icon name="md-checkmark" style={{ fontSize: 20, color: '#E4531A' }} />}
                </TouchableOpacity>
            );
        })
    }

    getLanguageToShow() {
        let language = '';
        const { base, stores } = this.storeConfig;
        stores.stores[0].storeviews.storeviews.forEach(element => {
            if (element.store_id != base.store_id) {
                language = element.name;
            }
        });
        return language;
    }

    renderItem(icon, label, navigate, borderBottomWidth = 1, disable = false) {
        return (
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: borderBottomWidth, borderColor: '#E6E6E6', paddingVertical: 12, opacity: disable ? 0.5 : 1 }}
                onPress={() => {
                    if (!disable) {
                        NavigationManager.openPage(this.props.navigation, navigate.route, navigate.param)
                    }
                }}>
                <Image source={icon} style={{ width: 25, height: 25 }} />
                <Text style={{ fontSize: 15, marginLeft: 15, textAlign: 'left' }}>{Identify.__(label)}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={{ flex: 1, overflow: 'scroll' }}>
                <ScrollView>
                    <View style={{ backgroundColor: '#E4531A', paddingHorizontal: 15, paddingTop: 70, paddingBottom: 24 }}>
                        {!Identify.getCustomerData() ?
                            <TouchableOpacity
                                style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'white', borderRadius: 20, alignSelf: 'baseline' }}
                                onPress={() => NavigationManager.openPage(this.props.navigation, "Login")}>
                                <Text>
                                    {Identify.__('Sign In')}
                                    <Text style={{ color: '#E4531A' }}> | </Text>
                                    {Identify.__('Register')}
                                </Text>
                            </TouchableOpacity> :
                            <View style={{ alignItems: 'flex-start' }}>
                                <Text style={{ color: 'white', fontFamily: material.fontBold, fontSize: 16 }}>{Identify.__('Welcome')}, {Identify.getCustomerData().firstname} {Identify.getCustomerData().lastname}!</Text>
                                <Text style={{ color: 'white', marginTop: 6 }}>{Identify.getCustomerData().email}</Text>
                            </View>}
                    </View>
                    <View style={{ padding: 30, paddingRight: 16, flex: 1, backgroundColor: material.appBackground }}>
                        {Identify.getCustomerData() && <View style={{ marginBottom: 15 }}>
                            {this.renderItem(require('../icon/icon-use.png'), 'My Account', { route: 'MyAccount', param: null })}
                            {this.renderItem(require('../icon/icon-information.png'), 'Account Information', { route: 'Profile', param: null })}
                            {this.renderItem(require('../icon/icon-location2.png'), 'Address Book', { route: 'AddressBook', param: null })}
                            {this.renderItem(require('../icon/icon-list.png'), 'Recent Orders List', { route: 'OrderHistory', param: null })}
                            {this.renderItem(require('../icon/icon-giftcard.png'), 'Gift Card', { route: 'MyGiftcard', param: null })}
                            {this.renderItem(require('../icon/icon-wishlist.png'), 'My Wishlist', { route: 'Wishlist', param: null })}
                            {this.renderItem(require('../icon/icon-review.png'), 'My Product Reviews', { route: 'MyReviews', param: null })}
                            {this.renderItem(require('../icon/icon-mail.png'), 'Newsletter Subscription', { route: 'Newsletter', param: null }, 0)}
                        </View>}
                        {this.renderItem(require('../icon/icon-track-order.png'), 'Track Order'), null, 1, true}
                        {this.renderItem(require('../icon/icon-location2.png'), 'Store', { route: 'Store', param: null })}
                        {this.renderItem(require('../icon/ic_services.png'), 'Service', { route: 'Service', param: null })}
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, marginVertical: 15 }}
                            onPress={() => this.setState({ showPopup: true })}>
                            <Image source={require('../icon/icon-language.png')} style={{ width: 25, height: 25 }} />
                            <Text style={{ fontSize: 15, marginLeft: 15, flexGrow: 1 }}>{Identify.__('Language')}</Text>
                            <Text style={{ marginLeft: 5, color: '#747474' }}>{this.getLanguageToShow()}</Text>
                        </TouchableOpacity>
                        {this.renderItem(require('../icon/icon-phone.png'), 'Contact Us', { route: 'WebViewPage', param: { uri: SimiCart.pwa_url + `contact-us${Identify.isRtl() ? '?lang=Arabic' : '?lang=English'}` } })}
                        {this.renderItem(require('../icon/icon-information-2.png'), Identify.__('About Us'), { route: 'WebViewPage', param: { uri: SimiCart.pwa_url + `about-us${Identify.isRtl() ? '?lang=Arabic' : '?lang=English'}` } })}
                        {this.renderItem(require('../icon/icon-list-3.png'), Identify.__('Terms & Conditions'), { route: 'WebViewPage', param: { uri: SimiCart.pwa_url + `terms-and-conditions${Identify.isRtl() ? '?lang=Arabic' : '?lang=English'}` } })}
                        {this.renderItem(require('../icon/icon-privacy.png'), Identify.__('Privacy Policy'), { route: 'WebViewPage', param: { uri: SimiCart.pwa_url + `privacy-policy${Identify.isRtl() ? '?lang=Arabic' : '?lang=English'}` } }, 0)}
                        {Identify.getCustomerData() && <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingVertical: 12 }}
                            onPress={() => this.logout()}>
                            <Image source={require('../icon/icon-logout.png')} style={{ width: 25, height: 25 }} />
                            <Text style={{ fontSize: 15, marginLeft: 15 }}>{Identify.__('Log out')}</Text>
                        </TouchableOpacity>}
                    </View>
                </ScrollView>
                {this.dispatchPlugin('footer_app')}
                {this.state.showLoading != 'none' &&
                    <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: this.state.showLoading == 'full' ? 'white' : '#00000033', alignItems: 'center', justifyContent: 'center' }}>
                        <Spinner color={this.loadingColor} />
                    </View>}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.showPopup}
                    onRequestClose={() => {
                        console.log('Modal has been closed.');
                    }}>
                    <View style={{ flex: 1, paddingVertical: 50, paddingHorizontal: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{
                            width: '100%',
                            backgroundColor: 'white',
                            borderRadius: 8,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.20,
                            shadowRadius: 1.41,
                            elevation: 2,
                            padding: 20
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text style={{ fontSize: 20, fontFamily: material.fontBold }}>{Identify.__('Language')}</Text>
                                <Icon name="md-close" style={{ fontSize: 22 }} onPress={() => this.setState({ showPopup: false })} />
                            </View>
                            {this.renderLanguageOptions()}
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

}

const mapStateToProps = (state) => {
    return { data: state.redux_data.customer_data };
}

//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuBottomPage);