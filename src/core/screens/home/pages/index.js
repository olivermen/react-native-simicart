import React from 'react';
import { Container } from "native-base";
import { BackHandler, Platform, Alert } from 'react-native'
import SimiPageComponent from "@base/components/SimiPageComponent";
import NewConnection from '@base/network/NewConnection';
import { homes_lite } from '@helper/constants';
import Identify from '@helper/Identify';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import type { Notification, RemoteMessage, NotificationOpen } from 'react-native-firebase';
import NavigationManager from '@helper/NavigationManager';

let HomeContent = null;
class Home extends SimiPageComponent {
    constructor(props) {
        super(props);
        let appConfig = this.props.dashboard['app-configs'][0];
        this.layout = appConfig.home;
        this.isBack = false;
        this.test = true;
    }

    componentWillMount() {
        if (this.props.loading.type === 'none' && Identify.isEmpty(this.props.data)) {
            this.showLoading('full');
        }
    }

    componentDidMount() {
        super.componentDidMount();
        if (Identify.isEmpty(this.props.data)) {
            this.requestHomeData();
        }
        if (!Identify.isInitNotiOpened()) {
            firebase.notifications().getInitialNotification()
                .then((notificationOpen: NotificationOpen) => {
                    if (notificationOpen && notificationOpen.notification && notificationOpen.notification._data) {
                        Identify.saveInitNotiOpened(true);
                        const notification: Notification = notificationOpen.notification;
                        console.log('App opened from notification');
                        console.log(notification);

                        let data = notification._data;
                        if (data.show_popup == '1') {
                            this.props.storeData('showNotification', { show: true, data: data });
                        } else {
                            this.openNotification(data);
                        }
                    }
                });
        }
    }

    requestHomeData() {
        let data = {};
        if (this.layout == 'zara') {
            data['get_child_cat'] = '1';
        }
        data['limit'] = '100';
        new NewConnection()
            .init(homes_lite, 'get_home_data', this)
            .addGetData(data)
            .connect();
    }

    setData(data, requestID) {
        //store data and disable loading.
        this.showLoading('none', false);
        this.props.storeData('home_data', data);
    }

    renderLayout() {
        if (this.layout == 'default') {
            HomeContent = require('./default').default;
            return <HomeContent navigation={this.props.navigation} />
        } else if (this.layout == 'matrix') {
            HomeContent = require('./matrix').default;
            return <HomeContent navigation={this.props.navigation} />
        } else if (this.layout == 'zara') {
            HomeContent = require('./zara').default;
            return <HomeContent navigation={this.props.navigation} />
        } else {
            return null;
        }
    }

    addContextToConsumer() {
        return {
            extraContext: 'test'
        }
    }

    renderPhoneLayout() {
        return (
            <Container>
                {this.renderLayout()}
            </Container>
        );
    }

    openNotification(notification) {
        let type = notification.type;
        let routeName = ''
        switch (type) {
            case '1':
                routeName = 'ProductDetail';
                params = {
                    productId: notification.productID ? notification.productID : notification.product_id,
                };
                break;
            case '2':
                if (notification.has_child) {
                    routeName = 'Category';
                    params = {
                        categoryId: notification.categoryID ? notification.categoryID : notification.category_id,
                        categoryName: notification.categoryName ? notification.categoryName : notification.category_name,
                    };
                } else {
                    routeName = 'Products';
                    params = {
                        categoryId: notification.categoryID ? notification.categoryID : notification.category_id,
                        categoryName: notification.categoryName ? notification.categoryName : notification.category_name,
                    };
                }
                break;
            case '3':
                routeName = 'WebViewPage';
                params = {
                    uri: notification.url ? notification.url : notification.notice_url,
                };
                break;
            default:
                break;
        }
        if (routeName != '') {
            NavigationManager.openPage(null, routeName, params);
        }
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.redux_data.showLoading,
        dashboard: state.redux_data.dashboard_configs,
        data: state.redux_data.home_data
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);

//export default Home;
