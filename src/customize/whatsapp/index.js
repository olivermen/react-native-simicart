import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import Identify from '@helper/Identify';
import { Image, Linking, Platform, View } from 'react-native';
import { Fab, Toast } from "native-base";
import { TouchableOpacity } from 'react-native';

export default class WhatsApp extends SimiComponent {

    constructor(props) {
        super(props);

        if (Identify.getMerchantConfig().storeview.instant_contact &&
            Identify.getMerchantConfig().storeview.instant_contact.phone &&
            Identify.getMerchantConfig().storeview.instant_contact.phone[0]
        ) {
            this.numberWhatsapp = Identify.getMerchantConfig().storeview.instant_contact.phone[0];
        }
    }

    onPress() {
        if (this.numberWhatsapp) {
            if (Platform.OS === 'android') {
                Linking.canOpenURL('whatsapp://send?text=')
                    .then((supported) => {
                        if (!supported) {
                            Linking.openURL("market://details?id=com.whatsapp");
                        } else {
                            Linking.openURL('http://api.whatsapp.com/send?phone=' + this.numberWhatsapp);
                        }
                    })
                    .catch((err) => console.error('An error occurred', err));
            } else {
                Linking.canOpenURL('whatsapp://')
                    .then((supported) => {
                        if (!supported) {
                            Linking.openURL('https://itunes.apple.com/vn/app/whatsapp-messenger/id310633997')
                        } else {
                            Linking.openURL('http://api.whatsapp.com/send?phone=' + this.numberWhatsapp);
                        }
                    })
                    .catch((err) => console.error('An error occurred', err));
            }
        } else {
            Toast.show({
                text: Identify.__('Please enter phone number')
            })
        }
    }

    render() {
        if (!this.numberWhatsapp) {
            return null;
        }

        // if (this.props.navigation.state.routeName === 'ProductDetail'
        //     || this.props.navigation.state.routeName === 'Checkout'
        //     || this.props.navigation.state.routeName === 'ContactUs'
        //     || this.props.navigation.state.routeName === 'Cart'
        //     || (this.props.navigation.state.routeName === 'AddressBook' && this.props.navigation.state.params.mode !== 'view_address')
        //     || (this.props.navigation.state.routeName === 'NewAddress' && this.props.navigation.state.params.mode !== 'add_new_address_detail')
        // ) {
        //     return null;
        // } else {
        return (
            <TouchableOpacity
                style={{ position: 'absolute', zIndex: 999, left: 25, bottom: 60 }}
                onPress={() => this.onPress()}>
                <Image
                    source={require('../icon/ic_whatsapp.png')}
                    style={{ width: 50, height: 50 }}
                />
            </TouchableOpacity>
        );
        // }
    }

}