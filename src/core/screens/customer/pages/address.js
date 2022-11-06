import React from 'React';
import SimiPageComponent from '@base/components/SimiPageComponent';
import { connect } from 'react-redux';
import { View, Alert } from 'react-native';
import { Container, Content } from 'native-base';
import NewConnection from '@base/network/NewConnection';
import NavigationManager from '@helper/NavigationManager';
import variable from '@theme/variables/material';
import { addresses, address_detail_mode, checkout_mode } from "@helper/constants";
import Identify from "@helper/Identify";

class AddressDetailPage extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.mode = this.props.navigation.getParam('mode');
        this.onSaveShippingAddress = this.props.navigation.getParam('onSaveShippingAddress');
        this.onSaveBillingAddress = this.props.navigation.getParam('onSaveBillingAddress');
        this.countryStateData = {};
        this.state = {
            ...this.state,
            address: this.props.navigation.getParam('address') ? this.props.navigation.getParam('address') : {}
        };
        if (this.mode.includes('checkout')) {
            this.isRight = false;
        }
    }

    updateButtonStatus(status) {
        if (this.button) {
            this.button.updateButtonStatus(status);
        }
    }

    editNewAddress = () => {
        this.addressData = this.form.getAddressData();
        const { addressData } = this
        this.addressData = {
            ...addressData,
            is_default_billing: addressData.is_default_billing === '0' ? true : false,
            is_default_shipping: addressData.is_default_shipping === '0' ? true : false,
        }
        let countryStateData = this.addressData.country_state;
        this.addressData = {
            ...this.state.address,
            ...this.addressData,
            ...countryStateData
        }
        delete this.addressData.country_state;

        if (this.mode.includes('checkout')) {
            if (this.mode.includes('add_new')) {
                if (this.mode.includes('exist_customer')) {
                    this.props.storeData('showLoading', { type: 'dialog' });
                    new NewConnection()
                        .init(addresses, 'add_new_address_checkout', this, 'POST')
                        .addBodyData(this.addressData)
                        .connect();
                } else {
                    if (this.addressData.customer_password !== this.addressData.confirm_password) {
                        Alert.alert(
                            Identify.__('Error'),
                            Identify.__('Password and Confirm password don\'t match'),
                        );
                        return;
                    }

                    let checkoutMode = '';
                    if (this.mode == address_detail_mode.checkout.as_new_customer.add_new) {
                        checkoutMode = checkout_mode.new_customer;
                    } else {
                        checkoutMode = checkout_mode.guest;
                    }
                    NavigationManager.openPage(this.props.navigation, 'Checkout', {
                        mode: checkoutMode,
                        shippingAddressParams: this.addressData,
                        billingAddressParams: this.addressData
                    });
                }
            } else if (this.mode.includes('edit')) {
                let step = 1;
                if (this.mode.includes('exist_customer')) {
                    step = 2;
                }
                NavigationManager.backToPage(this.props.navigation, step);
                if (this.mode.includes('shipping')) {
                    this.onSaveShippingAddress(this.addressData);
                } else {
                    this.onSaveBillingAddress(this.addressData);
                }
            }
        } else {
            this.props.storeData('showLoading', { type: 'dialog' });
            if (this.mode == address_detail_mode.normal.edit) {
                new NewConnection()
                    .init(addresses, 'edit_address', this, 'POST')
                    .addBodyData(this.addressData)
                    .connect();
            } else if (this.mode == address_detail_mode.normal.add_new) {
                new NewConnection()
                    .init(addresses, 'add_new_address_normal', this, 'POST')
                    .addBodyData(this.addressData)
                    .connect();
            }
        }
    }

    setData(data, requestID) {
        this.props.storeData('actions', [
            { type: 'showLoading', data: { type: 'none' } },
            { type: 'address_book_data', data: undefined }
        ]);
        if (this.mode == address_detail_mode.checkout.exist_customer.add_new) {
            NavigationManager.backToPreviousPage(this.props.navigation);

            NavigationManager.openPage(this.props.navigation, 'Checkout', {
                mode: checkout_mode.exist_customer,
                shippingAddressParams: { entity_id: data.Address.entity_id },
                billingAddressParams: { entity_id: data.Address.entity_id }
            });
        } else {
            // if (Device.isTablet()) {
            //     if (this.props.parent !== undefined) {
            //         this.props.parent.showAddressList();
            //     }
            // } else {

            NavigationManager.backToPreviousPage(this.props.navigation);
            // }
        }
    }

    createRef(id) {
        switch (id) {
            case 'default_address_form':
                return ref => (this.form = ref);
            case 'default_address_button':
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
                    <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15, paddingTop: 15, paddingBottom: 80 }}>
                        {this.renderLayoutFromConfig('address_layout', 'content')}
                    </View>
                </Content>
                {/* {this.renderLayoutFromConfig('address_layout', 'container')} */}
            </Container>
        );
    }
}

//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(null, mapDispatchToProps)(AddressDetailPage);