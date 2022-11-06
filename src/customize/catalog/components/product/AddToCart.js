import React from 'react';
import { Alert, Keyboard, Dimensions } from 'react-native';
import { Button, Text, View } from "native-base";
import { connect } from 'react-redux';
import Format from './price/format';
import Identify from '@helper/Identify';
import AppStorage from '@helper/storage';
import Events from '@helper/config/events';
import { quoteitems } from '@helper/constants';
import material from "@theme/variables/material";
import NewConnection from '@base/network/NewConnection';
import SimiComponent from '@base/components/SimiComponent';

class AddToCart extends SimiComponent {

    constructor(props) {
        super(props);
        this.storeConfig = Identify.getMerchantConfig().storeview.base;
        this.state = {
            prices: this.props.product.app_prices,
            qty : 1
        }
    }

    updateQty(qty){
        this.setState({qty: qty})
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }
    }

    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined)
        }
    }

    updatePrices = (newPrices) => {
        this.setState({ prices: newPrices });
    }

    setData(data) {
        data['reload_data'] = true;

        this.props.storeData('actions', [
            { type: 'showLoading', data: { type: 'none' } },
            { type: 'quoteitems', data: data }
        ]);
        if (data.quote_id && data.quote_id != null && data.quote_id != '' && !Identify.getCustomerData()) {
            AppStorage.saveData('quote_id', data.quote_id);
        }
        this.updatePrices(this.props.product.app_prices)
        this.props.parent.handleAlert(Identify.__('Product is added to the cart successfully!'))
    }

    handleWhenRequestFail() {
        this.props.storeData('showLoading', { type: 'none' });
    }

    tracking() {
        let data = {};
        data['event'] = 'product_action';
        data['action'] = 'added_to_cart';
        data['product_name'] = this.props.product.name;
        data['product_id'] = this.props.product.entity_id;
        data['price'] = this.props.product.price;
        data['sku'] = this.props.product.sku;
        data['qty'] = this.props.parent.getCheckoutQty();
        Events.dispatchEventAction(data, this);
    }

    onClickAddToCart() {
        if (this.props.parent.product && this.props.product.is_salable === 1) {
            let params = {};

            let optionParams = this.props.parent.getOptionParams();
            if (optionParams != null) {
                params = {
                    ...optionParams,
                };
            } else if (this.props.product.type_id == 'grouped' || this.props.product.type_id == 'giftvoucher') {
                return;
            }

            params['product'] = this.props.product.entity_id;
            let qty = this.props.parent.getCheckoutQty() ? this.props.parent.getCheckoutQty() : '1';
            if (isNaN(qty) || parseInt(qty) == 0) {
                Alert.alert(
                    Identify.__('Error'),
                    Identify.__('Quantity is not valid')
                );
                return;
            }
            params['qty'] = qty;
            Keyboard.dismiss();

            if (parseInt(qty, 10) > 0) {
                this.tracking();
                this.props.storeData('showLoading', { type: 'dialog' });

                newConnection = new NewConnection();
                newConnection.init(quoteitems, 'add_to_cart', this, 'POST');
                newConnection.addBodyData(params);
                newConnection.connect();
            }
        } else {
            this.props.parent.handleAlert(Identify.__('This product currently is not available'), true)
        }
    }

    renderPrice = () => {
        let prices = this.state.prices
        console.log(prices);
        let qty = this.state.qty;
        if (prices.price !== null) {
            if (prices.price < prices.regular_price_display) {
                return <Format price={prices.price_after_discount_display * qty} style={{ flex: 1, fontSize: 18, fontFamily: material.fontBold }} />
            } else {
                return <Format price={prices.price * qty} style={{ flex: 1, fontSize: 18, fontFamily: material.fontBold }} />
            }
        } else {
            return <Format price={prices.price_after_discount_display * qty} style={{ flex: 1, fontSize: 18, fontFamily: material.fontBold }} />
        }
    }

    render() {
        // let showButton = true;
        // if (this.storeConfig && this.storeConfig.hasOwnProperty('is_show_price_for_guest') &&
        //     this.storeConfig.is_show_price_for_guest == '0' && !Identify.getCustomerData()) {
        //     showButton = false;
        // }
        return (
            <View style={{
                overflow: 'hidden', paddingTop: 5,
                position: 'absolute',
                bottom: Platform.OS === 'ios' && Dimensions.get('window').height >= 812 ? 15 : 0,
                width: '100%'
            }}>
                <View style={{
                    backgroundColor: 'white',
                    flex: 1,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 15, paddingVertical: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 1, height: 1 },
                    shadowOpacity: 0.4,
                    shadowRadius: 3,
                    elevation: 5,
                }}>
                    {/* {prices.regular_price_display === 0 ?
                        <Format
                            price={prices.regular_price}
                            style={{ flex: 1, fontSize: 18, fontFamily: material.fontBold }}
                        /> :
                        <Format
                            price={prices.price_after_discount_display < prices.regular_price_display ? prices.price_after_discount_display : prices.regular_price_display}
                            style={{ flex: 1, fontSize: 18, fontFamily: material.fontBold }}
                        />
                    } */}
                    {this.renderPrice()}
                    <Button full
                        onPress={() => this.onClickAddToCart()}
                        style={{ flex: 1, height: 54, borderRadius: 8 }}>
                        <Text style={{ color: Identify.theme.button_text_color, fontFamily: material.fontBold, fontSize: 16 }}>{Identify.__("Add to cart")}</Text>
                    </Button>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.redux_data.quoteitems,
        customer_data: state.redux_data.customer_data,
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToCart);
