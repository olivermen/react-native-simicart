import React from 'react';
import { Text, Button, View } from 'native-base';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import { address_book_mode, checkout_mode } from '@helper/constants';
import Events from '@helper/config/events';
import { Dimensions, Platform, Image } from 'react-native';
import md5 from 'md5';
import material from '@theme/variables/material';
import Format from '@screens/catalog/components/product/price/format';

const Checkoutbutton = (props) => {

    // componentDidMount(){
    //   Toast.show({
    //       text: this.props.parent.props.data.message[0],
    //       textStyle: { color: "yellow" },
    //       buttonText: "Okay",
    //       type: 'warning',
    //       duration: 4000
    //   });
    // }

    const { checkout, paypal_express_config } = Identify.getMerchantConfig().storeview;

    function openAddressBook() {
        NavigationManager.openPage(props.parent.props.navigation, 'AddressBook', {
            mode: address_book_mode.checkout.select
        });
    }

    function openCheckoutPage(address, method) {
        if (method === 'HomeDeli') {
            NavigationManager.openPage(props.parent.props.navigation, 'Checkout', {
                mode: checkout_mode.exist_customer,
                shippingAddressParams: { entity_id: address ? address.entity_id : null },
                billingAddressParams: { entity_id: address ? address.entity_id : null },
                scroll_to_payment: true
            });
        } else {
            NavigationManager.openPage(props.parent.props.navigation, 'Checkout', {
                selectedMode: props.parent.state.selectedShippingMethod,
                store: address
            });
        }
    }

    function showCheckoutOptions() {
        let data = {};
        data['event'] = 'cart_action';
        data['action'] = 'clicked_checkout_button';

        Events.dispatchEventAction(data, this);

        NavigationManager.openPage(props.parent.props.navigation, 'Login', {
            isCheckout: true
        });
    }

    function dispatchPluginPaypalExpress() {
        let items = [];
        if (Events.events.paypal_express_cart && paypal_express_config && Identify.TRUE(paypal_express_config.show_on_cart)) {
            for (let i = 0; i < Events.events.paypal_express_cart.length; i++) {
                let node = Events.events.paypal_express_cart[i];
                if (node.active === true) {
                    let key = md5("action_cart" + i);
                    let Content = node.content;
                    items.push(<Content key={key} />)
                }
            }
        }
        return items;
    }

    let data = props.parent.props.data;
    let items = dispatchPluginPaypalExpress();
    let total = props.totals ? props.totals : props.parent.totals;
    const disableCheckout = (data.hasOwnProperty('is_can_checkout') && data.is_can_checkout == "0") || props.parent.state.isShowValidate

    return (
        <View style={{
            overflow: 'hidden', paddingTop: 5,
            position: 'absolute',
            bottom: Platform.OS === 'ios' && Dimensions.get('window').height >= 812 ? 15 : 0,
            width: '100%',
            height: 75
        }}>
            <View style={{
                backgroundColor: 'white',
                flex: 1,
                backgroundColor: 'white',
                flexDirection: 'row',
                paddingHorizontal: 15, paddingVertical: 10,
                shadowColor: '#000',
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 0.4,
                shadowRadius: 3,
                elevation: 5,
            }}>
                {total.grand_total_incl_tax ?
                    <View style={{ flex: 1, height: 54 }}>
                        <Text style={{ fontSize: 12, color: '#747474', marginTop: 4 }}>{Identify.__('Grand Total')}</Text>
                        <Format price={total.grand_total_incl_tax} style={{ fontSize: 14, lineHeight: 32, fontFamily: material.fontBold }} />
                    </View> : null}
                <Button
                    full
                    onPress={() => {
                        if (disableCheckout) {
                            return;
                        }
                        if (checkout.checkout_webview && checkout.checkout_webview.enable == '1') {
                            NavigationManager.clearStackAndOpenPage(props.parent.props.navigation, 'CheckoutWebView', {
                                quote_id: data.quote_id
                            });
                        } else {
                            if (Identify.getCustomerData()) {
                                if (props.parent.state.selectedShippingMethod === 1) {
                                    openCheckoutPage(props.parent.state.selectedStore, 'C&C');
                                } else {
                                    if (!data.hasOwnProperty('estimate_shipping') || !data.estimate_shipping.address || !data.estimate_shipping.shipping_method) {
                                        openAddressBook();
                                    } else {
                                        openCheckoutPage(data.estimate_shipping.address, 'HomeDeli');
                                    }
                                }
                            } else {
                                showCheckoutOptions();
                            }
                        }
                    }} style={{ flex: 1, height: 54, borderRadius: 8, opacity: disableCheckout ? 0.5 : 1 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Image source={require('../../../icon/icon-lock.png')} style={{ width: 19, height: 24 }} />
                        <Text style={{ color: Identify.theme.button_text_color, fontFamily: material.fontBold, marginStart: 10, fontSize: 16 }}>{Identify.__('Checkout')} ({props.parent.props.data.quoteitems.length})</Text>
                    </View>
                </Button>
            </View>
        </View>
    );
}

export default Checkoutbutton;
