import React from 'react';
import { connect } from 'react-redux';
import SimiComponent from '@base/components/SimiComponent';
import { TouchableOpacity } from 'react-native';
import { Card, CardItem, Text, H3 } from 'native-base';

class NotificationItem extends SimiComponent {
    itemOnPress(){
        this.props.storeData('showNotification', { show: true, data: this.props.notification });
    }
    renderPhoneLayout() {
        return (
            <TouchableOpacity onPress={() => {
                this.itemOnPress()
            }}>
                <Card>
                    <CardItem style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <H3>{this.props.notification.notice_title}</H3>
                        <Text>{this.props.notification.created_time}</Text>
                        <Text>{this.props.notification.notice_content}</Text>
                    </CardItem>
                </Card>
            </TouchableOpacity>
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

export default connect(null, mapDispatchToProps)(NotificationItem);