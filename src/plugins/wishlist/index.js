import React from 'react';
import {
    ScrollView, FlatList, TouchableOpacity, Image, View, Text, Modal, TextInput, KeyboardAvoidingView
} from 'react-native';
import { connect } from 'react-redux';
import { Container, Spinner, Icon, Button, Content } from 'native-base';
import Identify from '@helper/Identify';
import { wishlist_item } from '../constants'
import { quoteitems } from '@helper/constants';
import NewConnection from '@base/network/NewConnection';
import NavigationManager from '@helper/NavigationManager';
import Price from '@screens/catalog/components/product/price';
import SimiPageComponent from "@base/components/SimiPageComponent";
import styles from './styles';

class Wishlist extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.isPage = true;
        this.state = {
            ...this.state,
            data: null,
            loadMore: false,
            showLabel: false,
            visibleModal: false,
            formShare: {
                email: '',
                message: ''
            },
            err: {
                errEmail: false,
                errMess: false
            }
        };
        this.back = true;
        this.data = [];
        this.limit = 5;
        this.offset = 0;
        this.lastY = 0;
        this.isLoadingMore = false;
        this.refresh = this.props.navigation.getParam("refresh", null);
    }

    componentDidMount() {
        this.props.storeData('showLoading', { type: 'full' });
        this.getWishlist();
    }

    setData(data, requestId) {
        if (requestId != 'delete_item') {
            this.props.storeData('showLoading', { type: 'none' });
        }

        if (data.hasOwnProperty('quoteitems')) {
            this.props.storeData('actions', [
                { type: 'quoteitems', data: data }
            ]);
            return
        }

        let canLoadMore = true;
        if (this.offset + this.limit >= data.total) {
            canLoadMore = false;
        }

        if (requestId == 'add_to_cart') {
            this.getQuoteItems();
        }

        if (requestId == 'delete_item') {
            this.getWishlist(this.offset + this.limit, 0);
        }

        if (this.isLoadingMore) {
            let combinedWishlistItems = this.state.data.wishlistitems;
            combinedWishlistItems.push.apply(combinedWishlistItems, data.wishlistitems);
            data.wishlistitems = combinedWishlistItems;

            let combinedIds = this.state.data.all_ids;
            combinedIds.push.apply(combinedIds, data.all_ids);
            data.all_ids = combinedIds;
        }
        this.isLoadingMore = false;
        if (requestId != 'add_to_cart' && requestId != 'delete_item' && requestId !== 'email_share_list') {
            this.setState({
                data: data,
                loadMore: canLoadMore
            });
        }
        if (requestId === 'email_share_list' && data.status) {
            this.props.storeData('showLoading', { type: 'none' });
            if (this.state.err.errEmail || this.state.err.errMess) {
                this.setState({
                    ...this.state.err,
                    errEmail: false,
                    errMess: false
                })
            }
        }
    }

    getWishlist(limit, offset) {
        let params = [];
        params['limit'] = limit ?? this.limit;
        params['offset'] = offset ?? this.offset;
        try {
            new NewConnection()
                .init(wishlist_item, 'get_wishlist_data', this)
                .addGetData(params)
                .connect();
        } catch (e) {
            console.log(e.message);
        }
    }

    getQuoteItems() {
        new NewConnection()
            .init(quoteitems, 'get_quoteitems', this)
            .connect();
    }

    handleWhenRequestFail() {
        if (this.props.loading != 'none') {
            this.props.storeData('showLoading', { type: 'none' });
        }
    }

    handleChangeTxt = (name, value) => {
        let form = { ...this.state.formShare, [name]: value };
        this.setState({ formShare: form })
    }

    addPriceRow(item) {
        return (
            <Price type={item.type_id} prices={item.app_prices} styleDiscount={{ fontSize: 1, fontWeight: '100' }} />
        )
    }

    handleModal = (type) => {
        if (type === 'open') {
            this.setState({ visibleModal: true })
        } else {
            this.setState({ visibleModal: false })
        }
    }

    deleteWishlistItem(item) {
        this.props.storeData('showLoading', { type: 'dialog' });
        this.state.data = null;
        new NewConnection()
            .init(wishlist_item + '/' + item.wishlist_item_id, 'delete_item', this, 'DELETE')
            .connect();

        this.setState({ showLabel: true }, () => {
            setTimeout(() => {
                this.setState({ showLabel: false })
            }, 3000)
        })
    }

    addAllItemToCart = () => {
        new NewConnection()
            .init(wishlist_item + '/add_all_tocart', 'add_to_cart', this)
            .addGetData({ 'add_to_cart': '1' })
            .connect();
        this.props.storeData('showLoading', { type: 'dialog' });
        this.addCart = true;
    }

    imageItemOnclick(item) {
        NavigationManager.openPage(this.props.navigation,
            'ProductDetail', {
            productId: item.product_id
        })
    }

    handleShareWishlist = () => {
        const { email, message } = this.state.formShare
        if (email === '') {
            this.setState({
                err: {
                    ...this.state.err,
                    errEmail: true
                }
            })
        } else if (message === '') {
            this.setState({
                err: {
                    ...this.state.err,
                    errMess: true
                }
            })
        } else {
            this.setState({ visibleModal: false })
            this.props.storeData('showLoading', { type: 'dialog' });
            new NewConnection()
                .init(wishlist_item + '/share_wishlist', 'email_share_list', this, 'POST')
                .addBodyData({ emails: email, message })
                .connect();
        }
    }

    renderModalShare() {
        const { formShare, err } = this.state
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.visibleModal}
                style={{ flex: 1 }}
            >
                <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
                    <View activeOpacity={1} style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', paddingBottom: 15 }}>{Identify.__("Email your list to a friend")}</Text>
                            <View style={{ height: 1, width: '100%', backgroundColor: '#D8D8D8', marginBottom: 40 }} />
                            <View style={{ flexDirection: 'row', paddingBottom: 6 }}>
                                <Text style={{ color: '#5D5D5D', paddingBottom: 4 }}>{Identify.__("Email Address")}</Text>
                                <Text style={{ color: '#D51C17', paddingLeft: 2 }}>*</Text>
                            </View>
                            <TextInput
                                style={[styles.input, { borderColor: !err.errEmail ? '#D8D8D8' : '#D51C17' }]}
                                value={formShare.email}
                                placeholder={Identify.__("Your friend'\s email address")}
                                placeholderTextColor='#747474'
                                onChangeText={(text) => this.handleChangeTxt('email', text)}
                            />
                            <View style={{ flexDirection: 'row', paddingBottom: 6 }}>
                                <Text style={{ color: '#5D5D5D', paddingBottom: 4 }}>{Identify.__("Message")}</Text>
                                <Text style={{ color: '#D51C17', paddingLeft: 2 }}>*</Text>
                            </View>
                            <TextInput
                                multiline={true}
                                numberOfLines={5}
                                style={[styles.input, { height: 98, paddingTop: 10, borderColor: !err.errMess ? '#D8D8D8' : '#D51C17' }]}
                                value={formShare.message}
                                onChangeText={(text) => this.handleChangeTxt('message', text)}
                            />
                            <TouchableOpacity style={styles.btnEmail} onPress={this.handleShareWishlist}>
                                <Text style={{ fontSize: 16, color: '#fff', fontWeight: '500' }}>
                                    {Identify.__("EMAIL LIST")}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.close} onPress={() => this.handleModal('close')}>
                                <Image source={require('../../../src/customize/icon/icon-close.png')} style={{ width: 18, height: 18 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        )
    }

    renderWishListItemImage(item) {
        return (
            <View style={{ marginRight: 12, alignItems: 'center' }}>
                <Image resizeMode='contain' source={{ uri: item.product_image }} style={styles.imageListItem} />
                <View style={[styles.btnStatus, { backgroundColor: item.stock_status ? '#39A935' : '#696969' }]}>
                    <Text style={{ color: 'white', fontSize: 12 }}>{item.stock_status ? 'In stock' : 'Out of stock'}</Text>
                </View>
            </View>
        )
    }

    renderWishlistItemInfor(item) {
        return (
            <View>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                    this.imageItemOnclick(item)
                }}>
                    <Text style={{ fontWeight: '500', paddingBottom: 10, flex: 2 }}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
                {this.addPriceRow(item)}
                <TouchableOpacity
                    style={styles.btnDelete}
                    onPress={() => {
                        this.deleteWishlistItem(item);
                    }}>
                    <Image
                        source={require('../../customize/icon/icon-remove.png')}
                        style={{ tintColor: '#000', width: 20, height: 20 }}
                    />
                    <Text style={{ fontWeight: '500', paddingLeft: 5, fontSize: 15 }}>{Identify.__('Remove')}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderItem(item) {
        return (
            <View style={styles.item} key={item.wishlist_item_id}>
                {this.renderWishListItemImage(item)}
                {this.renderWishlistItemInfor(item)}
            </View>
        );
    }

    loadMore = () => {
        if (this.offset + this.limit < this.state.data.total && !this.isLoadingMore) {
            this.isLoadingMore = true;
            this.offset += this.limit;
            this.getWishlist();
        }
    }

    generatePropsToFlatlist() {
        return {
            style: styles.verticalList,
            data: this.state.data.wishlistitems,
            extraData: this.state.data
        }
    }

    renderWishlistItems() {
        return (
            <ScrollView
                onScroll={({ nativeEvent }) => {
                    if ((Number((nativeEvent.contentSize.height).toFixed(0)) - 1) <= Number((nativeEvent.contentOffset.y).toFixed(1)) + Number((nativeEvent.layoutMeasurement.height).toFixed(1))) {
                        this.loadMore();
                    }
                }}
            >
                <FlatList
                    {...this.generatePropsToFlatlist()}
                    keyExtractor={(item) => item.wishlist_item_id}
                    renderItem={({ item }) =>
                        <View>
                            {this.renderItem(item)}
                        </View>
                    }
                />
                <Spinner style={(this.state.loadMore) ? {} : { display: 'none' }} />
            </ScrollView>
        );
    }

    renderAddAllToCart() {
        return (
            <View style={[styles.btnShare, { borderColor: '#000', marginBottom: 15 }]}>
                <Button iconLeft transparent primary onPress={this.addAllItemToCart}>
                    <Image source={require('../../customize/icon/ic_cart_header.png')} style={{ tintColor: '#000', width: 24, height: 24 }} />
                    <Text style={{ paddingLeft: 6, fontSize: 15, fontWeight: '500' }}>{Identify.__('Add All to Cart')}</Text>
                </Button>
            </View>
        )
    }

    renderShareButton = () => {
        return (
            <View style={styles.btnShare}>
                <Button iconLeft transparent primary onPress={() => this.handleModal('open')}>
                    <Icon name='share' />
                    <Text style={{ paddingLeft: 6, fontSize: 15, fontWeight: '500', color: '#E4531A' }}>{Identify.__('Share wishlist')}</Text>
                </Button>
            </View>
        )
    }

    renderPhoneLayout() {
        if (this.state.data && this.state.data.wishlistitems && this.state.data.wishlistitems.length) {
            return (
                <Container style={styles.page}>
                    {this.state.showLabel ? <View style={styles.noti}>
                        <Text style={{ fontSize: 16 }}>{Identify.__('This product has been removed from')}</Text>
                        <Text style={{ fontSize: 16 }}>{Identify.__('your wishlist')}</Text>
                    </View> : null}
                    <Text style={styles.title}>{Identify.__('My Wishlist')}</Text>
                    {this.renderAddAllToCart()}
                    {this.renderShareButton()}
                    {this.renderWishlistItems()}

                    {this.renderModalShare()}
                </Container>
            );
        }
        return (
            <View style={styles.page}>
                <Text style={styles.title}>{Identify.__('My Wishlist')}</Text>
                <View style={styles.btnEmpty}>
                    <Text style={{ fontSize: 16 }}>{Identify.__('Your wishlist is empty')}</Text>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.redux_data.quoteitems,
        loading: state.redux_data.showLoading,
        wishlist: state.redux_data.wishlist,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
