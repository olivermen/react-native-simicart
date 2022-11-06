import React from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { Icon, Text } from 'native-base';
import Identify from '@helper/Identify';
import NewConnection from '@base/network/NewConnection';
import { connect } from 'react-redux';
import NavigationManager from '@helper/NavigationManager';
import { wishlist_item } from '../constants';
import Events from '@helper/config/events';

class AddWishlist extends React.Component {
    constructor(props) {
        super(props);
        this.addedToWishlist = false;
        this.didRemoveProductFromWishlist = false;
        this.wishlistItemId = '';
    }

    wishlistButtonAction() {
        let isLogin = false;
        if (!Identify.isEmpty(this.props.customer_data)) {
            isLogin = true;
        }
        if (isLogin) {
            console.log(this.addedToWishlist);
            if (this.addedToWishlist == true) {
                this.removeProductFromWishlist();
            } else {
                this.addProductToWishlist();
            }
        } else {
            NavigationManager.openPage(this.props.navigation, "Login");
        }
    }

    removeProductFromWishlist() {
        this.props.storeData('showLoading', { type: 'dialog' });
        new NewConnection()
            .init(wishlist_item + '/' + this.wishlistItemId, 'remove_product', this, 'DELETE')
            .connect();
    }

    addProductToWishlist() {
        this.tracking();
        this.props.storeData('showLoading', { type: 'dialog' });
        new NewConnection()
            .init(wishlist_item, 'remove_product', this, 'POST')
            .addBodyData({ "product": this.props.product.entity_id, "qty": "1" })
            .connect();
    }

    setData(data) {
        this.props.storeData('showLoading', { type: 'none' });
        let product = this.props.product;
        if (data.wishlistitem) {
            this.addedToWishlist = true;
            this.wishlistItemId = data.wishlistitem.wishlist_item_id;
            product.wishlist_item_id = data.wishlistitem.wishlist_item_id
        } else if (data.wishlistitems) {
            this.didRemoveProductFromWishlist = true;
            this.addedToWishlist = false;
            product.wishlist_item_id = null;
        }
        let productData = {};
        productData[this.props.product.entity_id] = product;
        this.props.storeData('add_product_details_data', productData);
        this.setState({});
    }

    handleWhenRequestFail() {
        this.props.storeData('showLoading', { type: 'none' });
    }

    render() {
        if (this.props.product && this.didRemoveProductFromWishlist == false) {
            if (this.props.product.wishlist_item_id) {
                this.wishlistItemId = this.props.product.wishlist_item_id;
                this.addedToWishlist = true;
            }
        }
        let color = "white";
        if (this.addedToWishlist == true) {
            color = "red";
        }
        return (
            <View style={{ marginTop: 20, marginHorizontal: 12, borderTopWidth: 1, borderColor: '#D8D8D8', paddingTop: 20, alignItems: 'center' }}>
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                        if (!Identify.getCustomerData()) {
                            NavigationManager.openPage(this.props.navigation, 'Login')
                            return;
                        }
                        if (this.addedToWishlist) {
                            this.removeProductFromWishlist();
                        } else {
                            this.addProductToWishlist();
                        }
                    }}>
                    <Image source={this.addedToWishlist ? require('./icon-heart-active.png') : require('./icon-heart-empty.png')} style={{ width: 23, height: 20, tintColor: this.addedToWishlist ? '#E4531A' : undefined }} />
                    <Text style={{ marginLeft: 15, fontSize: 16, paddingTop: 3, color: this.addedToWishlist ? '#E4531A' : 'black' }}>{Identify.__('Add to wishlist')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    tracking() {
        let data = {};
        data['event'] = 'product_action';
        data['action'] = 'added_to_wishlist';
        data['product_name'] = this.props.product.name;
        data['product_id'] = this.props.product.entity_id;
        data['sku'] = this.props.product.sku;
        data['qty'] = '1';
        Events.dispatchEventAction(data, this);
    }
}

const mapStateToProps = (state) => {
    return {
        customer_data: state.redux_data.customer_data,
        dashboard_configs: state.redux_data.dashboard_configs,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddWishlist);