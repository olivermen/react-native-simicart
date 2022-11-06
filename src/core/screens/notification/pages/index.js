import React from 'react';
import { connect } from 'react-redux';
import SimiPageComponent from '@base/components/SimiPageComponent';
import { Container } from 'native-base';
import { notifications_history } from '@helper/constants';
import NewConnection from '@base/network/NewConnection';
import variable from '@theme/variables/material';
import AppStorage from '@helper/storage';

class NotificationHistory extends SimiPageComponent {

    componentWillMount() {
        if (this.props.showLoading.type === 'none' && !this.checkExistData()) {
            this.props.storeData('showLoading', { type: 'full' });
        }
    }

    componentDidMount() {
        if (!this.checkExistData()) {
            AppStorage.getData('notification_token').then((savedToken) => {
                let jsonBody = {
                    limit: 100,
                    offset: 0,
                    dir: 'desc'
                };
                if (savedToken) {
                    jsonBody['device_token'] = savedToken;
                }
                new NewConnection()
                    .init(notifications_history, 'get_noti_history', this)
                    .addGetData(jsonBody)
                    .connect();
            });
        }
    }

    setData(data) {
        this.notifications = data;
        this.props.storeData('actions', [
            { type: 'showLoading', data: { type: 'none' } },
            { type: 'notification_history_data', data: data }
        ]);
    }

    checkExistData() {
        if (this.props.data !== undefined) {
            this.notifications = this.props.data;
            return true;
        }
        return false;
    }

    shouldRenderLayoutFromConfig() {
        if (this.notifications) {
            return true;
        }
        return false;
    }

    addMorePropsToComponent(element) {
        return {
            notifications: this.notifications.notifications
        };
    }

    renderPhoneLayout() {
        return (
            <Container style={{ backgroundColor: variable.appBackground }}>
                {this.renderLayoutFromConfig('notification_history_layout', 'container')}
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.notification_history_data, showLoading: state.redux_data.showLoading };
}

//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationHistory);

