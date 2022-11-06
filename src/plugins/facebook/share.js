import React from 'react';
import { Icon } from 'native-base';
import { Alert } from 'react-native'
import { ShareDialog } from 'react-native-fbsdk-next';
import simicart from '../../core/helper/simicart';
import Identify from '@helper/Identify'

export default class AddFBShare extends React.Component {
    constructor(props) {
        super(props);
    }
    openShareDialog() {
        var tmp = this;
        Identify.saveIsOpenShareFB(true);

        ShareDialog.canShow(this.shareLinkContent)
            .then(function (canShow) {
                if (canShow) {
                    return ShareDialog.show(tmp.shareLinkContent);
                }
            })
            .then(
                function (result) {
                    if (result.isCancelled) {
                        Identify.saveIsOpenShareFB(false);
                        Alert.alert(
                            Identify.__('Alert'),
                            Identify.__('Share cancelled'),
                        );
                    } else {
                        Alert.alert(
                            Identify.__('Alert'),
                            Identify.__('Share success'),
                        );
                    }
                },
                function (error) {
                    alert('Share fail with error: ' + error);
                },
            );
    }
    initProductURL() {
        if (this.props.product) {
            let url = simicart.merchant_url;
            if (url.slice(-1) !== '/') {
                url = url + '/';
            }
            if (this.props.product.url_path && this.props.product.url_path != null && this.props.product.url_path != "") {
                url = url + this.props.product.url_path;
            } else {
                url = url + "catalog/product/view/id/" + this.props.product.entity_id;
            }
            this.shareLinkContent = {
                contentType: 'link',
                contentUrl: url,
            };
        }
    }
    render() {
        this.initProductURL();
        return (
            <Icon name="logo-facebook" onPress={() => { this.openShareDialog() }} />
        );
    }
}