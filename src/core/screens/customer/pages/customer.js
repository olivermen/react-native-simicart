import React from 'react';
import { connect } from 'react-redux';
import SimiPageComponent from '@base/components/SimiPageComponent';
import { Alert, View } from 'react-native';
import { Content, Container } from 'native-base';
import NewConnection from '@base/network/NewConnection';
import variable from '@theme/variables/material';
import { customers } from '@helper/constants';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import AppStorage from '@helper/storage';
import Events from '@helper/config/events';

class CustomerPage extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.loginPage = this.props.navigation.getParam('parent');
        this.isEditProfile = this.props.navigation.getParam('isEditProfile');
        this.password = '';
        this.dispatchSplashCompleted();
    }

    dispatchSplashCompleted() {
        if (Identify.getMerchantConfig().storeview.base.force_login && Identify.getMerchantConfig().storeview.base.force_login == '1' && !this.isEditProfile) {
            this.isRight = false;
            this.isMenu = false;
        }

        for (let i = 0; i < Events.events.splash_completed.length; i++) {
            let node = Events.events.splash_completed[i];
            if (node.force_login && node.force_login === true && !this.isEditProfile) {
                this.isRight = false;
                this.isMenu = false;
            }
        }
    }

    onCustomerAction() {
        if (this.isEditProfile) {
            this.editProfile();
        } else {
            this.createNewAccount();
        }
    }

    createNewAccount = () => {
        this.customerData = this.form.getCustomerData();
        if (this.customerData.password !== this.customerData.com_password) {
            Alert.alert(
                Identify.__('Error'),
                Identify.__('Password and Confirm password don\'t match'),
            );
            return;
        }
        this.requestCustomerAction();
    }

    editProfile() {
        let currentPassword = '';
        let newPassword = '';
        let confirmPassword = '';
        this.customerData = this.form.getCustomerData();
        if (this.customerData.password) {
            currentPassword = this.customerData.password;
        }
        if (this.customerData.new_password) {
            newPassword = this.customerData.new_password;
        }
        if (this.customerData.com_password) {
            confirmPassword = this.customerData.com_password;
        }
        if (currentPassword.length > 0 || newPassword.length > 0 || confirmPassword.length > 0) {
            if (newPassword !== confirmPassword) {
                Alert.alert(
                    Identify.__('Error'),
                    Identify.__('Password and Confirm password don\'t match'),
                );
                return;
            } else if (newPassword.length < 6 || confirmPassword.length < 6) {
                Alert.alert(
                    Identify.__('Error'),
                    Identify.__('Please enter 6 or more characters'),
                );
                return;
            } else if (currentPassword != this.password) {
                Alert.alert(
                    Identify.__('Error'),
                    Identify.__('Current password don\'t correct'),
                );
                return;
            } else {
                this.customerData.change_password = '1';
            }
            this.customerData['old_password'] = currentPassword;
            this.customerData['password'] = undefined;
        } else {
            this.customerData.change_password = '0';
        }

        this.requestCustomerAction();
    }

    requestCustomerAction() {
        new NewConnection()
            .init(customers, 'customer_action', this, this.isEditProfile ? 'PUT' : 'POST')
            .addBodyData(this.customerData)
            .connect();
        this.props.storeData('showLoading', { type: 'dialog' });
    }

    setData(data, requestID) {
        if (this.isEditProfile) {
            this.props.storeData('actions', [
                { type: 'showLoading', data: { type: 'none' } },
                { type: 'customer_data', data: data.customer }
            ]);
            if (this.customerData === '1') {
                AppStorage.saveCustomerAutoLoginInfo({
                    email: this.customerData.email,
                    password: this.customerData.new_password
                });
                AppStorage.getCustomerRemebermeLoginInfo().then((rememberInfo) => {
                    if (rememberInfo) {
                        AppStorage.saveRemembermeLoginInfo({
                            email: this.customerData.email,
                            password: this.customerData.new_password
                        });
                    }
                });
            }
        } else {
            this.props.storeData('showLoading', { type: 'none' });
            this.tracking(this.customerData.email);
        }
        if (data.message !== undefined) {
            let messages = data.message;
            if (messages.length > 0) {
                let message = messages[0];
                setTimeout(() => {
                    Alert.alert(
                        '',
                        Identify.__(message),
                        [
                            {
                                text: Identify.__('OK'), onPress: () => {
                                    if (this.isEditProfile) {
                                        this.props.navigation.goBack(null);
                                    } else {
                                        NavigationManager.clearStackAndOpenPage(this.props.navigation, 'Login', {
                                            email: this.customerData.email,
                                            password: this.customerData.password
                                        });
                                    }
                                }
                            },
                        ],
                        { cancelable: false }
                    );
                }, 300);
                return;
            }
        } else {
            NavigationManager.backToPreviousPage(this.props.navigation);
        }
    }

    componentDidMount() {
        super.componentDidMount();
        AppStorage.getCustomerAutoLoginInfo().then((customerInfo) => {
            if (customerInfo !== null) {
                this.password = customerInfo.password;
            }
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });
    }

    updateButtonStatus(status) {
        if (this.button) {
            this.button.updateButtonStatus(status);
        }
    }

    createRef(id) {
        switch (id) {
            case 'default_customer_form':
                return ref => (this.form = ref);
            case 'default_customer_button':
                return ref => (this.button = ref);
            default:
                return undefined;
        }
    }

    addMorePropsToComponent(element) {
        return {
            onRef: this.createRef(element.id)
        };
    }

    renderPhoneLayout() {
        return (
            <Container style={{ backgroundColor: variable.appBackground }}>
                <Content>
                    <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15, paddingTop: 30, paddingBottom: 70 }}>
                        {this.renderLayoutFromConfig('customer_layout', 'content')}
                    </View>
                </Content>
                {this.renderLayoutFromConfig('customer_layout', 'container')}
            </Container>
        );
    }

    tracking(email) {
        let data = {};
        data['event'] = 'customer_action';
        data['action'] = 'register_success';
        data['email'] = email;
        Events.dispatchEventAction(data, this);
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerPage);