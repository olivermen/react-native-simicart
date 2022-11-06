export default {
    container: {
        default_checkout_button: {
            active: true,
            sort_order: 1000,
            content: require('../../../customize/checkout/components/checkoutbutton/place').default
        },
    },
    content: {
        default_header: {
            active: true,
            sort_order: 999,
            content: require('../../../customize/checkout/components/checkout/header').default
        },
        default_billing_address: {
            active: false,
            sort_order: 1000,
            title_content: 'Billing Address',
            content: require('../../../customize/checkout/components/checkout/address').default
        },
        default_shipping_adress: {
            active: true,
            sort_order: 2000,
            title_content: 'Delivery Address',
            content: require('../../../customize/checkout/components/checkout/address').default
        },
        default_shipping: {
            active: true,
            sort_order: 3000,
            title_content: 'Shipping Method',
            content: require('../../../customize/checkout/components/checkout/shipping').default
        },
        default_payment: {
            active: true,
            sort_order: 4000,
            title_content: 'Payment Method',
            content: require('../../../customize/checkout/components/checkout/payment').default
        },
        customize_discount: {
            active: true,
            sort_order: 4500,
            content: require('../../../customize/checkout/components/discount').default,
        },
        default_list: {
            active: true,
            sort_order: 5000,
            title_content: 'Shipment Details',
            content: require('../../../customize/checkout/components/checkout/summary').default
        },
        default_total: {
            active: false,
            sort_order: 6000,
            title_content: 'Totals',
            content: require('../../../customize/checkout/components/totals').default
        },
        default_term_condition: {
            active: false,
            sort_order: 7000,
            title_content: 'Term and Conditions',
            content: require('@screens/checkout/components/checkout/term').default
        }
    }
}
