import React from 'react';
import { Text, Button, View } from 'native-base';
import Identify from '@helper/Identify';
import Events from '@helper/config/events';
import material from '@theme/variables/material';

const Place = (props) => {

  return (
    <View
      style={[{
        position: 'absolute',
        bottom: 0,
        flex: 1, flexDirection: 'row',
        backgroundColor: 'white',
        paddingHorizontal: 15, paddingVertical: 8
      },
      material.isIphoneX ? { bottom: 15 } : {}
      ]}>
      <Button
        full
        style={{ flex: 1, height: 54, borderRadius: 8, opacity: !props.parent.isCanPlaceOrder() ? 0.5 : 1 }}
        onPress={() => {
          if (props.parent.isCanPlaceOrder()) {
            let data = {};
            data['event'] = 'checkout_action';
            data['action'] = 'clicked_place_order_button';
            Events.dispatchEventAction(data, this);
            props.parent.onPlaceOrder();
          }
        }}>
        <Text style={{ fontSize: 16, fontFamily: material.fontBold }}>{Identify.__('Place Order')}</Text>
      </Button>
    </View>
  );
}

export default Place;
