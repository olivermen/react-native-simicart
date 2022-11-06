import React from 'react';
import { connect } from 'react-redux';
import SimiComponent from '@base/components/SimiComponent';
import { LoginButton, AccessToken, GraphRequestManager, GraphRequest } from 'react-native-fbsdk-next';
import { quoteitems, address_book_mode } from '@helper/constants';
import Connection from '@base/network/Connection';
import NewConnection from '@base/network/NewConnection';
import AppStorage from '@helper/storage';
import md5 from 'md5';
import NavigationManager from '@helper/NavigationManager';
import simicart from '@helper/simicart';
import Identify from '@helper/Identify';

class AddFBLogin extends SimiComponent {
    constructor(props) {
        super(props);
        this.shouldGetQuoteItems = false;
        this.customerData = null;
        this.email = '';
        this.password = '';
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
    handleWhenRequestFail() {
        this.props.storeData('showLoading', { type: 'none' });
    }
    getQuoteItems() {
        new NewConnection()
            .init(quoteitems, 'get_quoteitems', this)
            .connect();
    }
    saveCustomerData() {
        Identify.setCustomerData(this.customerData.customer);
        try {
            Connection.setCustomer({ email: this.email, password: this.password });
            Identify.setCustomerParams({ email: this.email, password: this.password });
            AppStorage.saveCustomerAutoLoginInfo({ email: this.email, password: this.password });
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

    renderPhoneLayout() {
        const that = this;
        return (
            <LoginButton
                style={{ width: '100%', marginTop: 17, height: 38, flex: 1, justifyContent: 'center' }}
                readPermissions={['email', 'user_photos', 'user_birthday']}
                onLoginFinished={
                    (error, result) => {
                        if (error) {
                            console.log("Request login has error: " + JSON.stringify(error));
                        } else if (result.isCancelled) {
                            console.log("Request login is cancelled.");
                        } else {
                            console.log('Login Success: ' + JSON.stringify(result));
                            AccessToken.getCurrentAccessToken().then(
                                (data) => {
                                    console.log(data.accessToken.toString());

                                    const callback = (error: ?Object, result: ?Object) => {
                                        if (error) {
                                            console.log('Error fetching data: ' + JSON.stringify(error.toString()));
                                        } else {
                                            console.log('Success fetching data: ' + JSON.stringify(result));
                                        }

                                        let names = result.name.split(' ');

                                        that.email = result.email;
                                        that.password = md5(simicart.merchant_authorization + result.email);

                                        if (Identify.getMerchantConfig().storeview.base.magento_version && Identify.getMerchantConfig().storeview.base.magento_version === '2') {
                                            that.password = 'Simi123a@' + md5(simicart.merchant_authorization + result.email);
                                        }

                                        let params = [];
                                        params['email'] = that.email;
                                        params['password'] = that.password;
                                        params['firstname'] = encodeURI(names[0]);
                                        params['lastname'] = encodeURI(names[1]);
                                        new NewConnection()
                                            .init('simiconnector/rest/v2/customers/sociallogin', 'social_login', this)
                                            .addGetData(params)
                                            .connect();

                                        that.props.storeData('showLoading', { type: 'dialog' });
                                    };

                                    const infoRequest = new GraphRequest(
                                        '/me?fields=id,name,email,gender,birthday&access_token=' + data.accessToken.toString(),
                                        null,
                                        callback
                                    );
                                    // Start the graph request.
                                    new GraphRequestManager().addRequest(infoRequest).start();
                                }
                            );
                        }
                    }
                }
                onLogoutFinished={() => console.log("logout.")} />
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
        },
        clearData: () => {
            dispatch({ type: 'clear_all_data', data: null })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFBLogin);