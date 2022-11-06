import React from 'react';
import { connect } from 'react-redux';
import { Container, Content } from 'native-base';
import Connection from '@base/network/Connection';
import NewConnection from '@base/network/NewConnection';
import NavigationManager from '@helper/NavigationManager';
import AppStorage from '@helper/storage';
import { customer_logout, address_book_mode, quoteitems } from '@helper/constants';
import SimiPageComponent from '@base/components/SimiPageComponent';
import variable from '@theme/variables/material';
import Identify from '@helper/Identify';
import Events from '@helper/config/events';

class MyAccountPage extends SimiPageComponent {

    logout() {
        try {
            this.props.storeData('showLoading', { type: 'dialog' });
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
        if(requestID == 'customer_logout') {
            this.props.storeData('actions', [
                { type: 'showLoading', data: { type: 'none' } },
                { type: 'clear_all_data', data: null },
            ]);
            Identify.setCustomerData(null);
            Identify.setCustomerParams(null);
            Connection.setCustomer(null);
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

    onSelectMenuItem(keyItem) {
        switch (keyItem) {
            case 'myaccount_logout':
                this.logout();
                break;
            case 'myaccount_address':
                NavigationManager.openPage(this.props.navigation, 'AddressBook', {
                    mode: address_book_mode.normal
                });
                break;
            case 'myaccount_orders':
                NavigationManager.openPage(this.props.navigation, 'OrderHistory');
                break;
            case 'myaccount_profile':
                NavigationManager.openPage(this.props.navigation, 'Customer', {
                    isEditProfile: true
                });
                break;
            case 'my_rewardpoint':
                NavigationManager.openPage(this.props.navigation, 'MyReward');
                break;
            default:
                return false;
        }
        return true;
    }

    renderPhoneLayout() {
        return (
            <Container style={{ paddingLeft: 15, paddingRight: 15, backgroundColor: variable.appBackground }}>
                <Content style={{ flex: 1, paddingTop: 15 }}>
                    {this.renderLayoutFromConfig('myaccount_layout', 'content')}
                </Content>
                {this.renderLayoutFromConfig('myaccount_layout', 'container')}
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

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountPage);