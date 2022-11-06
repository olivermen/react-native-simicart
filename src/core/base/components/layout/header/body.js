import React from 'react';
import { Title } from 'native-base';
import variable from "@theme/variables/material";
import { StyleSheet, Dimensions, TouchableHighlight, Image, View, Alert, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-matters';
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify'
import Events from '@helper/config/events';

const BodyHeader = (props) => {
  forceLogin = false;

  if (Identify.getMerchantConfig().storeview.base.force_login && Identify.getMerchantConfig().storeview.base.force_login == '1') {
    forceLogin = true;
  }

  function dispatchSplashCompleted() {
    for (let i = 0; i < Events.events.splash_completed.length; i++) {
      let node = Events.events.splash_completed[i];
      if (node.force_login && node.force_login === true) {
        forceLogin = true
      }
    }
  }

  function renderShowTitle() {
    return (
      <Title style={{ color: variable.toolbarBtnColor, textAlign: 'center' }}>{props.parent.props.title}</Title>
    );
  }

  function onPressBody() {
    dispatchSplashCompleted();
    if (props.parent.props.obj && props.parent.props.obj.isPaymentWebview === true) {
      Alert.alert(
        Identify.__('Warning'),
        Identify.__('Are you sure you want to cancel this order?'),
        [
          { text: Identify.__('Cancel'), onPress: () => { style: 'cancel' } },
          {
            text: Identify.__('OK'), onPress: () => {
              if (props.parent.props.obj.cancelOrder) {
                props.parent.props.obj.cancelOrder();
              } else {
                NavigationManager.backToRootPage(props.navigation);
              }
            }
          },
        ],
        { cancelable: true }
      );
    } else if (forceLogin === true && Identify.isEmpty(Identify.getCustomerData())) {
      return;
    } else {
      NavigationManager.backToRootPage(props.navigation);
    }
  }

  function renderShowLogo() {
    return (
      <TouchableOpacity
        onPress={() => {
          onPressBody();
        }}
        underlayColor="white">
        <Image source={require('../../../../../../media/logo.png')} style={styles.image} resizeMode='contain' />
      </TouchableOpacity>
    );
  }

  if (
    props.parent.props.title) {
    return (
      <View style={{ flexGrow: 1, flex: 1 }}>
        {renderShowTitle()}
      </View>
    );
  } else {
    return (
      <View style={{ flexGrow: 1, flex: 1, paddingLeft: 10, paddingRight: 10 }}>
        {renderShowLogo()}
      </View>
    );
  }
}

export const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
  },
  viewBodyPhone: {
    width: Dimensions.get('window').width, marginRight: scale(20)
  },
  viewBodyTablet: {
    width: Dimensions.get('window').width, marginLeft: scale(120), alignItems: 'center'
  },
  bodyAndroid: {
    alignItems: 'center', position: 'absolute', width: Dimensions.get('window').width
  },
  image: {
    height: 45, resizeMode: 'contain', width: '100%'
  }
});

export default BodyHeader;
