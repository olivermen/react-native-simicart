import Firebase from 'react-native-firebase';
import Identify from '@helper/Identify';

const Action = (params, obj = null, key = null) => {
    let Analytics = Firebase.analytics();
    let data = { ...params }
    let action = data['event'];
    delete data['event'];

    if (action == 'checkout_action' && data['action'] == 'place_order_successful') {
        let total = data['total'];
        if (!total) {
            return;
        }
        let newParameters = {
            coupon: total.coupon_code ? total.coupon_code : '',
            value: total.grand_total_incl_tax ? total.grand_total_incl_tax : total.grand_total,
            tax: total.tax ? total.tax : 0,
            shipping: total.shipping_hand_incl_tax ? total.shipping_hand_incl_tax : total.shipping_hand_excl_tax ? total.shipping_hand_excl_tax : 0,
            transaction_id: data['order_id'],
            currency: Identify.getMerchantConfig().storeview.base.currency_code
        };
        Analytics.logEvent('ecommerce_purchase', newParameters);
    } else if (action == 'checkout_action' && data['action'] == 'init_checkout') {
        let total = data['total'];
        if (!total) {
            return;
        }
        let newParameters = {
            coupon: total.coupon_code ? total.coupon_code : '',
            value: total.grand_total_incl_tax ? total.grand_total_incl_tax : total.grand_total,
            currency: Identify.getMerchantConfig().storeview.base.currency_code
        };
        Analytics.logEvent('begin_checkout', newParameters);
    } else if (action == 'product_action' && data['action'] == 'added_to_cart') {
        let newParameters = {
            quantity: data['qty'],
            item_name: data['product_name'],
            item_id: data['product_id'],
            currency: Identify.getMerchantConfig().storeview.base.currency_code
        };
        Analytics.logEvent('add_to_cart', newParameters);
    } else if (action == 'product_action' && data['action'] == 'added_to_wishlist') {
        let newParameters = {
            quantity: data['qty'],
            item_name: data['product_name'],
            item_id: data['product_id'],
            currency: Identify.getMerchantConfig().storeview.base.currency_code
        };
        Analytics.logEvent('add_to_wishlist', newParameters);
    } else if (action == 'thankyou_action' && data['action'] == 'purchase') {
        order_review_data = data['order_review_data'];
        let newParameters = {
            currency: Identify.getMerchantConfig().storeview.base.currency_code,
            transaction_id: data['invoice'],
            value: order_review_data.total.subtotal_incl_tax ? order_review_data.total.subtotal_incl_tax : order_review_data.total.shipping_hand_excl_tax,
            tax: order_review_data.total.tax ? order_review_data.total.tax : 0,
            shipping: order_review_data.total.shipping_hand_incl_tax ? order_review_data.total.shipping_hand_incl_tax :
                order_review_data.total.shipping_hand_excl_tax ? order_review_data.total.shipping_hand_excl_tax : 0,
            coupon: order_review_data.total.coupon_code ? order_review_data.total.coupon_code : '',
        }
        Analytics.logEvent('purchase', newParameters);
    } else if (action == 'page_view_action' && data['action'] == 'viewed_productdetail_screen') {
        let product = data['product'];
        let newParameters = {
            item_name: product.name,
            item_id: product.entity_id
        };
        Analytics.logEvent('view_item', newParameters);
    } else if (action == 'page_view_action' && (data['action'] == 'view_cart_screen' || data['action'] == 'viewed_cart_screen')) {
        if (data && data.quoteitems) {
            let quoteitems = data.quoteitems;
            let items = [];
            if (quoteitems && quoteitems.quoteitems && quoteitems.quoteitems.length > 0) {
                quoteitems.quoteitems.forEach(element => {
                    items.push({
                        item_id: element.sku,
                        item_name: element.name,
                        currency: Identify.getMerchantConfig().storeview.base.currency_code,
                        discount: element.discount_amount,
                        price: element.price,
                        quantity: element.qty
                    })
                });
                let newParameters = {
                    currency: Identify.getMerchantConfig().storeview.base.currency_code,
                    value: quoteitems.total?.subtotal_incl_tax,
                    items: items
                }
                Analytics.logEvent('view_cart', newParameters);
            }
        }
    } else if (action == 'page_view_action' && data['action'] == 'viewed_category_screen') {
        let newParameters = {
            item_name: data['cat_name'],
            item_id: data['cat_id']
        };
        Analytics.logEvent('view_item_list', newParameters);
    } else if (action == 'search_action' && data['action'] == 'view_search_results') {
        let newParameters = {
            search_term: data['search_term']
        };
        Analytics.logEvent('view_search_results', newParameters);
    } else if (action == 'login_action' && data['action'] == 'login_success') {
        let newParameters = {
            method: data['method']
        };
        Analytics.logEvent('login', newParameters);
    } else if (action == 'customer_action' && data['action'] == 'register_success') {
        let newParameters = {
            email: data['email']
        };
        Analytics.logEvent('sign_up', newParameters);
    }
}

export default Action;
