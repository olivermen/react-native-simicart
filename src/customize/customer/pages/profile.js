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
import ProfileLabel from '../components/profile/profilelabel'

class ProfilePage extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.loginPage = this.props.navigation.getParam('parent');
        this.isEditProfile = this.props.navigation.getParam('isEditProfile');
        this.password = '';
        this.mode = this.props.navigation.getParam('mode')
        this.state = {
            ...this.state,
            isError: false,
            messages: '',
            showMessage: false
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

    onProfileAction() {
        let currentPassword = '';
        let newPassword = '';
        let confirmPassword = '';
        this.profileData = this.form.getProfileData();
        if (this.profileData.password) {
            currentPassword = this.profileData.password;
        } else {
            currentPassword = this.props.data.password;
        }
        if (this.profileData.new_password) {
            newPassword = this.profileData.new_password;
        }
        if (this.profileData.com_password) {
            confirmPassword = this.profileData.com_password;
        }
        if (this.profileData.selected === 1) {
            if (currentPassword.length > 0 || newPassword.length > 0 || confirmPassword.length > 0) {
                if (newPassword !== confirmPassword) {
                    this.setState({
                        isError: true,
                        messages: 'Password and Confirm password don\'t match',
                        showMessage: true
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                showMessage: false
                            })
                        }, 3000)
                    })
                    return;
                } else if (newPassword.length < 6 || confirmPassword.length < 6) {
                    this.setState({
                        isError: true,
                        messages: 'Please enter 6 or more characters',
                        showMessage: true
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                showMessage: false
                            })
                        }, 3000)
                    })
                    return;
                } else if (currentPassword != this.password) {
                    this.setState({
                        isError: true,
                        messages: 'Current password don\'t correct',
                        showMessage: true
                    })
                    return;
                } else {
                    this.profileData.change_password = '1';
                }
                this.profileData['old_password'] = currentPassword;
                this.profileData['password'] = undefined;
            } else {
                this.profileData.change_password = '0';
            }
        } else if (this.profileData.selected === 0) {
            if (currentPassword != this.password) {
                this.setState({
                    isError: true,
                    messages: 'Current password don\'t correct',
                    showMessage: true
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            showMessage: false
                        })
                    }, 3000)
                })
                return;
            }
        }

        this.requestProfileAction();
    }

    updateButtonStatus(status) {
        if (this.button) {
            this.button.updateButtonStatus(status);
        }
    }

    requestProfileAction() {
        const data = this.profileData
        let params;
        if (!data.email) {
            data.email = this.props.data.email
        }
        if (data.selected === 0) {
            params = {
                change_email: 1,
                email: this.props.data.email,
                firstname: data.firstname,
                lastname: data.lastname,
                old_password: data.password ? data.password : this.props.data.password,
                new_email: data.email
            }
        } else if (data.selected === 1) {
            params = {
                change_password: 1,
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                old_password: data.old_password,
                new_password: data.new_password,
                com_password: data.com_password
            }
        } else {
            params = {
                firstname: data.firstname,
                lastname: data.lastname
            }
        }
        new NewConnection()
            .init(customers, 'customer_action', this, 'PUT')
            .addBodyData(params)
            .connect();
        this.props.storeData('showLoading', { type: 'dialog' });
    }

    setData(data) {
        this.props.storeData('actions', [
            { type: 'showLoading', data: { type: 'none' } },
            { type: 'customer_data', data: data.customer }
        ]);
        if (this.profileData.selected === 1) {
            AppStorage.saveCustomerAutoLoginInfo({
                email: this.profileData.email,
                password: this.profileData.new_password
            });
            AppStorage.getCustomerRemebermeLoginInfo().then((rememberInfo) => {
                if (rememberInfo) {
                    AppStorage.saveRemembermeLoginInfo({
                        email: this.profileData.email,
                        password: this.profileData.new_password
                    });
                }
            });
        }
        if (data.message !== undefined) {
            let messages = data.message;
            if (messages.length > 0) {
                let message = messages[0];
                this.setState({
                    isError: false,
                    messages: message,
                    showMessage: true
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            showMessage: false
                        })
                        this.props.navigation.goBack(null);
                    }, 3000)
                })
                return;
            }
        } else {
            NavigationManager.backToPreviousPage(this.props.navigation);
        }
    }

    createRef(id) {
        switch (id) {
            case 'default_profile_form':
                return ref => (this.form = ref);
            case 'default_profile_button':
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
        const { messages, isError, showMessage } = this.state;

        return (
            <Container style={{ backgroundColor: variable.appBackground }}>
                <Content>
                    <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15, paddingTop: 30, paddingBottom: 70 }}>
                        {showMessage ? <ProfileLabel text={messages} error={isError} /> : null}
                        {this.renderLayoutFromConfig('profile_layout', 'content')}
                    </View>
                </Content>
                {this.renderLayoutFromConfig('profile_layout', 'container')}
            </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);