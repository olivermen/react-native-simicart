import { AppEventsLogger } from "react-native-fbsdk-next";
import Identify from '@helper/Identify';

const Action = (params, obj = null, key = null) => {
    let data = { ...params }
    let action = data['event'];
    delete data['event'];

    if (action == 'checkout_action' && data['action'] == 'place_order_successful') {
        let total = data['total'];
        if (!total) {
            return;
        }
        let newParameters = {
            fb_coupon: total.coupon_code ? total.coupon_code : '',
            fb_tax: total.tax ? total.tax : 0,
            fb_shipping: total.shipping_hand_incl_tax ? total.shipping_hand_incl_tax : total.shipping_hand_excl_tax ? total.shipping_hand_excl_tax : 0,
            fb_transaction_id: data['order_id'],
            fb_currency: Identify.getMerchantConfig().storeview.base.currency_code
        };
        AppEventsLogger.logPurchase(total.grand_total_incl_tax ? total.grand_total_incl_tax : total.grand_total, Identify.getMerchantConfig().storeview.base.currency_code, newParameters);
    } else if (action == 'checkout_action' && data['action'] == 'init_checkout') {
        let total = data['total'];
        if (!total) {
            return;
        }
        let newParameters = {
            fb_coupon: total.coupon_code ? total.coupon_code : '',
            fb_value: total.grand_total_incl_tax ? total.grand_total_incl_tax : total.grand_total,
            fb_currency: Identify.getMerchantConfig().storeview.base.currency_code
        };
        AppEventsLogger.logEvent('fb_mobile_initiated_checkout', newParameters);
    } else if (action == 'product_action' && data['action'] == 'added_to_cart') {
        let newParameters = {
            fb_content_name: data['product_name'],
            fb_content_id: data['product_id'],
            fb_currency: Identify.getMerchantConfig().storeview.base.currency_code
        };
        AppEventsLogger.logEvent('fb_mobile_add_to_cart', newParameters);
    } else if (action == 'product_action' && data['action'] == 'added_to_wishlist') {
        let newParameters = {
            fb_content_name: data['product_name'],
            fb_content_id: data['product_id'],
            fb_currency: Identify.getMerchantConfig().storeview.base.currency_code
        };
        AppEventsLogger.logEvent('fb_mobile_add_to_wishlist', newParameters);
    } else if (action == 'page_view_action' && data['action'] == 'viewed_productdetail_screen') {
        let product = data['product'];
        let newParameters = {
            fb_content_name: product.name,
            fb_content_id: product.entity_id,
            fb_currency: Identify.getMerchantConfig().storeview.base.currency_code
        };
        AppEventsLogger.logEvent('fb_mobile_content_view', newParameters);
    } else if (action == 'search_action' && data['action'] == 'view_search_results') {
        let newParameters = {
            search_term: data['fb_search_string'],
            fb_success: true
        };
        AppEventsLogger.logEvent('fb_mobile_search', newParameters);
    } else if (action == 'customer_action' && data['action'] == 'register_success') {
        let newParameters = {
            email: data['email']
        };
        AppEventsLogger.logEvent('fb_mobile_complete_registration', newParameters);
    }
}

export default Action;