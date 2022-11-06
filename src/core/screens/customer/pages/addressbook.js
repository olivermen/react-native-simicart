import React from 'react';
import { connect } from 'react-redux';
import { Container, Toast } from 'native-base';
import NewConnection from '@base/network/NewConnection';
import { addresses, address_book_mode, address_detail_mode, checkout_mode } from "@helper/constants";
import NavigationManager from '@helper/NavigationManager';
import SimiPageComponent from '@base/components/SimiPageComponent';
import Identify from '@helper/Identify';
import variable from '@theme/variables/material';
import material from "@theme/variables/material";

class AddressBookPage extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.addressData = null;
        this.mode = this.props.navigation.getParam('mode');
        this.onSaveShippingAddress = this.props.navigation.getParam('onSaveShippingAddress');
        this.onSaveBillingAddress = this.props.navigation.getParam('onSaveBillingAddress');
        if (this.mode === undefined) {
            this.mode = address_book_mode.normal;
        } else if (this.mode.includes('checkout')) {
            this.isRight = false;
        }
        this.selectedAddress = {};
        this.deleteAddressID = '';
    }

    componentWillMount() {
        if (this.props.showLoading.type === 'none' && !this.checkExistData()) {
            this.props.storeData('showLoading', { type: 'full' });
        }
    }

    componentDidMount() {
        if (!this.checkExistData()) {
            this.getListAddresses();
        }
    }

    getListAddresses() {
        new NewConnection()
            .init(addresses, 'get_address_data', this)
            .addGetData({
                limit: 100,
                offset: 0,
                dir: 'desc'
            })
            .connect();
    }

    setData(data, requestID) {
        if (requestID == 'delete_address') {
            Toast.show({
                text: Identify.__('Delete address successful'),
                textStyle: { color: "yellow", fontFamily: material.fontFamily },
                duration: 3000
            });
            for (let i = 0; i < this.addressData.addresses.length; i++) {
                let element = this.addressData.addresses[i];
                if (element.entity_id === this.deleteAddressID) {
                    this.addressData.addresses.splice(i, 1);
                    break;
                }
            }
            this.deleteAddressID = '';
        } else {
            this.addressData = data;
        }
        this.props.storeData('actions', [
            { type: 'showLoading', data: { type: 'none' } },
            { type: 'address_book_data', data: data }
        ]);
    }

    checkExistData() {
        if (this.props.data.addresses !== undefined) {
            this.addressData = this.props.data;
            return true;
        }
        return false;
    }

    deleteAddress(addressID) {
        this.deleteAddressID = addressID;
        this.props.storeData('showLoading', { type: 'dialog' });
        new NewConnection()
            .init(addresses + '/' + addressID, 'delete_address', this, 'DELETE')
            .connect();
    }

    addNewAddress() {
        let addressDetailMode = '';
        if (this.mode.includes('checkout')) {
            switch (this.mode) {
                case address_book_mode.checkout.select:
                    addressDetailMode = address_detail_mode.checkout.exist_customer.add_new;
                    break;
                case address_book_mode.checkout.edit_shipping:
                    addressDetailMode = address_detail_mode.checkout.exist_customer.edit_shipping;
                    break;
                case address_book_mode.checkout.edit_billing:
                    addressDetailMode = address_detail_mode.checkout.exist_customer.edit_billing;
                    break;
                default:
                    break;
            }
        } else {
            addressDetailMode = address_detail_mode.normal.add_new;
        }
        NavigationManager.openPage(this.props.navigation, 'NewAddress', {
            mode: addressDetailMode,
            onSaveShippingAddress: this.onSaveShippingAddress,
            onSaveBillingAddress: this.onSaveBillingAddress,
        });
    }

    onSelectAddress = (item) => {
        if (this.mode.includes('checkout')) {
            switch (this.mode) {
                case address_book_mode.checkout.select:
                    NavigationManager.openPage(this.props.navigation, 'Checkout', {
                        mode: checkout_mode.exist_customer,
                        shippingAddressParams: { entity_id: item.entity_id },
                        billingAddressParams: { entity_id: item.entity_id }
                    });
                    break;
                case address_book_mode.checkout.edit_shipping:
                    NavigationManager.backToPreviousPage(this.props.navigation);
                    this.onSaveShippingAddress({ entity_id: item.entity_id });
                    break;
                case address_book_mode.checkout.edit_billing:
                    NavigationManager.backToPreviousPage(this.props.navigation);
                    this.onSaveBillingAddress({ entity_id: item.entity_id });
                    break;
                default:
                    break;
            }
        } else {
            NavigationManager.openPage(this.props.navigation, 'NewAddress', {
                mode: address_detail_mode.normal.edit,
                address: item
            });
        }
    }

    shouldRenderLayoutFromConfig() {
        if (this.addressData) {
            return true;
        }
        return false;
    }

    addMorePropsToComponent(element) {
        return {
            addresses: this.addressData.addresses
        };
    }

    renderPhoneLayout() {
        if (this.addressData && this.props.data == undefined) {
            this.getListAddresses();
            return (null);
        }
        return (
            <Container style={{ backgroundColor: variable.appBackground }}>
                {this.renderLayoutFromConfig('addressbook_layout', 'container')}
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.address_book_data, showLoading: state.redux_data.showLoading };
}

//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressBookPage);
