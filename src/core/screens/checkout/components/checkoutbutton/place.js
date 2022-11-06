import React from 'react';
import { Text, Button, View } from 'native-base';
import Identify from '@helper/Identify';
import Events from '@helper/config/events';
import material from '../../../../../../native-base-theme/variables/material';

const Place = (props) => {

  return (
    <View style={[{
      position: 'absolute',
      bottom: 0,
      flex: 1, flexDirection: 'row'
    },
    material.isIphoneX ? { marginLeft: 15, marginRight: 15, bottom: 15 } : {}
    ]}>
      <Button full style={{ flex: 1 }} onPress={() => {
        let data = {};
        data['event'] = 'checkout_action';
        data['action'] = 'clicked_place_order_button';
        Events.dispatchEventAction(data, this);
        props.parent.onPlaceOrder();
      }}>
        <Text>{Identify.__('PLACE ORDER')}</Text>
      </Button>
    </View>
  );
}

export default Place;
