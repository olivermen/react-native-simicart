import React from 'react';
import { connect } from 'react-redux';
import { Container, Content } from 'native-base';
import SimiPageComponent from '@base/components/SimiPageComponent';
import NewConnection from '@base/network/NewConnection';
import { addresses, address_detail_mode } from "@helper/constants";
import NavigationManager from '@helper/NavigationManager';
import variable from '@theme/variables/material';

class MyAccountPage extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.data = null
        this.address = null
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

    setData(data) {
        this.address = data;
        this.props.storeData('actions', [
            { type: 'showLoading', data: { type: 'none' } },
            { type: 'address_book_data', data }
        ]);
    }

    checkExistData() {
        if (this.props.addressData.addresses) {
            this.address = this.props.addressData;
            return true;
        }
        return false;
    }

    onSelectAddress = (item) => {
        NavigationManager.openPage(this.props.navigation, 'NewAddress', {
            mode: address_detail_mode.normal.edit,
            address: item
        });
    }

    renderPhoneLayout() {
        this.data = this.props.data
        if (typeof this.props.addressData === 'undefined') {
            this.getListAddresses();
        }

        return (
            <Container style={{ paddingHorizontal: 12, backgroundColor: variable.appBackground }}>
                <Content style={{ flex: 1, paddingTop: 30 }} showsVerticalScrollIndicator={false}>
                    {this.renderLayoutFromConfig('myaccount_layout', 'content')}
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.redux_data.customer_data,
        addressData: state.redux_data.address_book_data,
        showLoading: state.redux_data.showLoading
    };
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