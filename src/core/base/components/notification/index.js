import React from 'react';
import { View, Text, H3, Button } from 'native-base';
import { Modal, Image, Platform } from 'react-native';
import { connect } from 'react-redux';
import styles from './styles';
import NavigationManager from '../../../helper/NavigationManager';
import Identify from '../../../helper/Identify';
import SimiCart from '../../../helper/simicart';

class Notification extends React.Component {

    constructor(props) {
        super(props);
    }

    openNotification(notification) {
        if (notification.is_onesignal) {
            let routeName = '';
            let url = '';
            let params = {}

            if (notification.payload.additionalData) {
                let additionalData = notification.payload.additionalData;

                if (additionalData.category_id) {
                    if (additionalData.has_child) {
                        routeName = 'Category';
                        params = {
                            categoryId: additionalData.category_id,
                            categoryName: additionalData.category_name ? additionalData.category_name : "",
                        };
                    } else {
                        routeName = 'Products';
                        params = {
                            categoryId: additionalData.category_id,
                            categoryName: additionalData.category_name ? additionalData.category_name : "",
                        };
                    }
                } else if (additionalData.product_id) {
                    routeName = 'ProductDetail';
                    params = {
                        productId: additionalData.product_id,
                    };
                } else if (additionalData.url) {
                    routeName = 'WebViewPage';
                    params = {
                        uri: additionalData.url,
                    };
                }
            }

            if (routeName != '') {
                if (Identify.appConfig.app_settings && Identify.appConfig.app_settings.web_app && Identify.appConfig.app_settings.web_app == '1') {
                    this.props.storeData('currentURL', url);
                } else {
                    NavigationManager.openPage(null, routeName, params);
                }
            }
        } else {
            let type = notification.type;
            let routeName = '';
            let url = '';
            switch (type) {
                case '1':
                    let productID = notification.productID ? notification.productID : notification.product_id;
                    routeName = 'ProductDetail';
                    params = {
                        productId: productID,
                    };
                    if (!productID) {
                        return;
                    }
                    url = SimiCart.merchant_url + '/catalog/product/view?id=' + productID;
                    break;
                case '2':
                    let categoryID = notification.categoryID ? notification.categoryID : notification.category_id;
                    let categoryName = notification.categoryName ? notification.categoryName : notification.category_name;
                    if (notification.has_child) {
                        routeName = 'Category';
                        params = {
                            categoryId: categoryID,
                            categoryName: categoryName,
                        };
                    } else {
                        routeName = 'Products';
                        params = {
                            categoryId: categoryID,
                            categoryName: categoryName,
                        };
                    }
                    if (!categoryID) {
                        return;
                    }
                    url = SimiCart.merchant_url + '/catalog/category/view?id=' + categoryID;
                    break;
                case '3':
                    routeName = 'WebViewPage';
                    params = {
                        uri: notification.url ? notification.url : notification.notice_url,
                    };
                    url = notification.url ? notification.url : notification.notice_url;
                    if (!url) {
                        return;
                    }
                    break;
                default:
                    break;
            }
            if (routeName != '') {
                if (Identify.appConfig.app_settings && Identify.appConfig.app_settings.web_app && Identify.appConfig.app_settings.web_app == '1') {
                    this.props.storeData('currentURL', url);
                } else {
                    NavigationManager.openPage(null, routeName, params);
                }
            }
        }

    }

    renderNotificationPopupLayout(title, imageUrl, content, noti) {
        return (
            <Modal onRequestClose={() => null} visible={true} transparent={true} animationType="fade">
                <View style={styles.container}>
                    <View style={styles.dialog}>
                        <H3>{title}</H3>
                        {imageUrl != '' && <Image resizeMode='center' source={{ uri: imageUrl }} style={styles.image} />}
                        <Text numberOfLines={3} style={styles.message}>{content}</Text>
                        <View style={styles.buttonContainer}>
                            <Button transparent style={styles.button} onPress={() => {
                                this.props.storeData('showNotification', {
                                    show: false,
                                    data: {}
                                });
                            }}>
                                <Text style={{ textAlign: 'center', width: '100%' }}>{Identify.__('Cancel')}</Text>
                            </Button>
                            <Button transparent style={styles.button} onPress={() => {
                                this.props.storeData('showNotification', {
                                    show: false,
                                    data: {}
                                });
                                this.openNotification(noti);
                            }}>
                                <Text style={{ textAlign: 'center', width: '100%' }}>{Identify.__('Show')}</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
    renderNotificationPopup() {
        let noti = this.props.data.data;
        let title = "";
        let imageUrl = "";
        let content = "";
        if (noti.is_onesignal) {
            title = noti.payload.title ? noti.payload.title : "";
            if (noti.payload.bigPicture) {
                imageUrl = noti.payload.bigPicture;
            } else if (noti.payload.rawPayload && noti.payload.rawPayload.att && noti.payload.rawPayload.att.id) {
                imageUrl = noti.payload.rawPayload.att.id
            }
            content = noti.payload.body ? noti.payload.body : "";
        } else {
            title = noti.title ? noti.title : noti.notice_title;
            imageUrl = noti.imageUrl ? noti.imageUrl : decodeURI(noti.image_url);
            content = noti.message ? noti.message : noti.notice_content;
        }

        return this.renderNotificationPopupLayout(title, imageUrl, content, noti)
    }

    render() {
        if (this.props.data.show == true) {
            return (
                <View>
                    {this.renderNotificationPopup()}
                </View>
            );
        } else {
            return (
                <View />
            );
        }
    }
}

const mapStateToProps = state => ({
    data: state.redux_data.showNotification
});

const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (action, data) => {
            dispatch({ type: action, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
