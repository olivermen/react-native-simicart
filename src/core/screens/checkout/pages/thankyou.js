import React from 'react';
import { Container, Content } from "native-base";
import SimiPageComponent from "@base/components/SimiPageComponent";
import variable from '@theme/variables/material';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import AppStorage from '@helper/storage';
import { customer_login } from '../../../helper/constants';
import Connection from '@base/network/Connection';
import NewConnection from '@base/network/NewConnection';
import Identify from '@helper/Identify';
import { checkout_mode } from '@helper/constants';

class Thankyou extends SimiPageComponent {
  autoLogin() {
    AppStorage.getCustomerAutoLoginInfo().then((customerInfo) => {
      if (customerInfo !== null) {
        if (customerInfo.email !== undefined) {
          this.email = customerInfo.email;
        }
        if (customerInfo.password !== undefined) {
          this.password = customerInfo.password;
        }
        if (this.email !== '' && this.password !== '') {
          try {
            Connection.setCustomer(null);
            Identify.setCustomerParams(null);
            let params = [];
            params['email'] = this.email;
            params['password'] = this.password;
            new NewConnection()
              .init(customer_login, 'get_home_data', this)
              .addGetData(params)
              .connect();
          } catch (e) {
            console.log(e.message);
          }
        }
      }
      //this callback is executed when your Promise is resolved
    }).catch((error) => {
      //this callback is executed when your Promise is rejected
    });
  }

  setData(data) {
    this.props.storeData('actions', [
      { type: 'customer_data', data: data.customer },
    ]);
    Identify.setCustomerData(data.customer);
    let dataCustomer = null;
    // if (data.customer.simi_hash && data.customer.simi_hash != '') {
    //   dataCustomer = {
    //     email: this.email,
    //     simi_hash: data.customer.simi_hash
    //   }
    // } else {
    dataCustomer = {
      email: this.email,
      password: this.password
    }
    // }
    Connection.setCustomer(dataCustomer);
    Identify.setCustomerParams(dataCustomer);
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.navigation.getParam('mode') == checkout_mode.new_customer) {
      this.autoLogin();
    }
    this.props.clearData();
  }
  renderPhoneLayout() {
    return (
      <Container style={{ backgroundColor: variable.appBackground }}>
        <Content style={styles.content}>
          {this.renderLayoutFromConfig('thankyou_layout', 'content')}
        </Content>
        {this.renderLayoutFromConfig('thankyou_layout', 'container')}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    margin: 20,
  },
});
//Save to redux.
const mapDispatchToProps = (dispatch) => {
  return {
    storeData: (type, data) => {
      dispatch({ type: type, data: data })
    },
    clearData: () => {
      dispatch({ type: 'clear_checkout_data', data: null })
    }
  };
};

export default connect(null, mapDispatchToProps)(Thankyou);
