import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native'
import { Icon } from 'native-base';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';

const OrderSummary = (props) => {

    goBack = () => {
        NavigationManager.backToPreviousPage(props.navigation);
    }

    const convertDate = (data) => {
        let date = new Date(data.slice(0, 10));
        return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear()
    }

    return (
        <View style={{ paddingBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10 }}>
                <TouchableOpacity onPress={goBack}>
                    <Icon name="ios-arrow-back" style={{ fontSize: 20, color: '#E4531A' }} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: '500', paddingLeft: 16 }}>Order #{props.order.increment_id}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '500' }}>{Identify.__('Order Date:  ')}</Text>
                <Text style={{ fontSize: 16 }}>{convertDate(props.order.updated_at)}</Text>
            </View>
        </View>
    );
}

export default OrderSummary;