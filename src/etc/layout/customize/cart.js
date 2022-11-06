export default {
    container: {
        default_checkout_button: {
            active: true,
            sort_order: 1000,
            content: require('../../../customize/checkout/components/checkoutbutton').default
        },
    },
    content: {
        default_estimate_shipping: {
            active: false,
            sort_order: 1,
            content: require('@screens/checkout/components/estimateshipping').default,
            left: true
        },
        default_list: {
            active: true,
            sort_order: 1000,
            content: require('../../../customize/checkout/components/quoteitem/list').default,
            left: true
        },
        default_shipping: {
            active: true,
            sort_order: 2000,
            content: require('../../../customize/checkout/components/shipping').default,
            left: true
        },
        customize_discount: {
            active: true,
            sort_order: 3000,
            content: require('../../../customize/checkout/components/discount').default,
            left: false,
            data: {
                is_cart: true
            }
        },
        default_total: {
            active: true,
            sort_order: 4000,
            content: require('../../../customize/checkout/components/totals').default,
            left: false
        }
    }
}
