import React from 'react';
import { connect } from 'react-redux';
import SimiComponent from '@base/components/SimiComponent';
import { Alert, StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';
import { Button, Text, Toast } from 'native-base';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { quoteitems, address_book_mode, customer_social_login } from '@helper/constants';
import Connection from '@base/network/Connection';
import NewConnection from '@base/network/NewConnection';
import AppStorage from '@helper/storage';
import md5 from 'md5';
import NavigationManager from '@helper/NavigationManager';
import simicart from '@helper/simicart';
import Identify from '@helper/Identify';
import material from "@theme/variables/material";

class AddGoogleLogin extends SimiComponent {
    constructor(props) {
        super(props);
        this.shouldGetQuoteItems = false;
        this.customerData = null;
        this.email = '';
        this.password = '';
    }

    async componentDidMount() {

        //test
        //android
        // 643730520187-arocf5scdvp2atl84evull4h1j6f4jbo.apps.googleusercontent.com
        //ios
        // 643730520187-q0h6jiiq5r6pul990l2g7t98k9faj667.apps.googleusercontent.com

        //live
        // ios
        // 214638710520-v29c7mfsa9bmll8mhunfokjpb4loehkg.apps.googleusercontent.com
        //android
        // 214638710520-6c0eps3rl3spo7pbf61rrlf65mnb5vpo.apps.googleusercontent.com

        let webClientId = '703840219754-kmf2dbvif26k6io26vmbqcgmhh6loanm.apps.googleusercontent.com'
        if (Platform.OS === 'ios') {
            webClientId = '703840219754-tpqsu3psmqtiocfgmp7j95pp9l9jo7pm.apps.googleusercontent.com'
            // webClientId = '643730520187-q0h6jiiq5r6pul990l2g7t98k9faj667.apps.googleusercontent.com'
        }

        // if (simicart.isDemo == '0') {
        //     webClientId = '1000358569501-780ko730uubb4gk2lvk27mt1h2mh67l2.apps.googleusercontent.com'
        //     if (Platform.OS === 'ios') {
        //         webClientId = '1000358569501-dg4eo4gn15sjqvr4on7l9ml11rs628ep.apps.googleusercontent.com'
        //     }
        // }

        await GoogleSignin.configure({
            webClientId: webClientId,
            offlineAccess: true
        });
        try {
            const isSignedIn = await GoogleSignin.isSignedIn();
            if (isSignedIn) {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
            }
        } catch (error) {
            console.error(error);
        }
    }

    handleWhenRequestFail() {
        this.props.storeData('actions', [
            { type: 'showLoading', data: { type: 'none' } }
        ]);
    }

    setData(data) {
        this.props.clearData();
        if (!this.shouldGetQuoteItems) {
            this.customerData = data;
            this.saveCustomerData();
            this.shouldGetQuoteItems = true;
            this.getQuoteItems();
        } else {
            this.props.storeData('actions', [
                { type: 'showLoading', data: { type: 'none' } },
                { type: 'customer_data', data: this.customerData.customer },
                { type: 'quoteitems', data: data }
            ]);
            this.navigate();
        }
    }

    getQuoteItems() {
        newConnection = new NewConnection();
        newConnection.init(quoteitems, 'get_quoteitems', this);
        newConnection.connect();
    }

    saveCustomerData() {
        try {
            let loginData = {
                email: this.email,
                password: this.customerData.customer.simi_hash
            };

            Identify.setCustomerData(this.customerData.customer);
            // if (this.customerData.customer.simi_hash && this.customerData.customer.simi_hash != '') {
            //     loginData = {
            //         email: this.loginData.email,
            //         simi_hash: this.customerData.customer.simi_hash
            //     }
            // }

            Connection.setCustomer(loginData);   // For old customization
            Identify.setCustomerParams(loginData);
            AppStorage.saveCustomerAutoLoginInfo(loginData);
        } catch (error) {
            // Error saving data
        }
    }

    navigate = () => {
        NavigationManager.backToRootPage(this.props.navigation);
        if (this.props.isCheckout) {
            NavigationManager.openPage(this.props.navigation, 'AddressBook', {
                isCheckout: true,
                mode: address_book_mode.checkout.select
            });
        }
    }

    requestSocialLogin(params) {
        new NewConnection()
            .init('simiconnector/rest/v2/sociallogins', 'google_sign', this)
            .addGetData(params)
            .connect();
    }

    _signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log(userInfo);

            this.props.storeData('showLoading', { type: 'dialog' });

            this.email = userInfo.user.email;
            this.password = 'Simi123a@' + md5(simicart.merchant_authorization + userInfo.user.email);

            let params = [];
            params['uid'] = userInfo.user.id;
            params['providerId'] = 'google';
            params['email'] = this.email;
            params['password'] = this.password;
            params['firstname'] = userInfo.user.familyName;
            params['lastname'] = userInfo.user.givenName;

            this.requestSocialLogin(params);
        } catch (error) {
            this.props.storeData('showLoading', { type: 'none' });
            Toast.show({
                text: Identify.__('Login with Google error')
            })
            console.log(error);
        }
    };

    render() {
        if (Identify.getMerchantConfig().storeview.base
            && Identify.getMerchantConfig().storeview.base.hide_login
            && Identify.getMerchantConfig().storeview.base.hide_login === '1'
        ) {
            return null
        }
        return (
            <TouchableOpacity bordered style={styles.button} onPress={this._signIn}>
                <Image source={require('../icon/icon-google.png')} style={styles.icon} />
                <Text style={{ fontFamily: material.fontBold, marginLeft: 30, textAlign: 'center', fontSize: 16 }}>{Identify.__('Sign in with Google')}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 50,
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 8,
        backgroundColor: 'white',
        marginBottom: 15,
        borderWidth: 1
    },
    icon: {
        width: 24,
        height: 24
    }
})

const mapStateToProps = (state) => {
    return { data: state.redux_data.customer_data };
}

//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        },
        clearData: () => {
            dispatch({ type: 'clear_all_data', data: null })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddGoogleLogin);