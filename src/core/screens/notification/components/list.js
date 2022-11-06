import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { FlatList } from 'react-native';
import { Text } from 'native-base';
import Identify from '@helper/Identify';
import NotificationItem from './item';

const NotificationList = (props) => {

    function generatePropsToFlatlist() {
        return {
            style: { marginLeft: 10, marginRight: 10 },
            data:  props.notifications,
            extraData:  props.parent.props.data,
            showsVerticalScrollIndicator: false
        }
    }
    if ( props.notifications.length == 0) {
        return (
            <Text style={{ textAlign: 'center', marginTop: 90 }}>{Identify.__('You have not received any notifications')}</Text>
        );
    }
    return (
        <FlatList
            {... generatePropsToFlatlist()}
            keyExtractor={(item) => item.notice_id}
            renderItem={({ item }) =>
                <NotificationItem notification={item} parent={ props.parent} />
            }
        />
    );
}

export default NotificationList