export default {
    container : {
        default_checkout_button : {
            active: true,
            sort_order: 1000,
            content: require('@screens/checkout/components/checkoutbutton/place').default
        },
    },
    content : {
        default_billing_address : {
            active: true,
            sort_order: 1000,
            title_content: 'Billing Address',
            content: require('@screens/checkout/components/checkout/address').default
        },
        default_shipping_adress : {
            active: true,
            sort_order: 2000,
            title_content: 'Shipping Address',
            content: require('@screens/checkout/components/checkout/address').default
        },
        default_shipping: {
            active: true,
            sort_order: 3000,
            title_content: 'Shipping Method',
            content: require('@screens/checkout/components/checkout/shipping').default
        },
        default_payment: {
            active: true,
            sort_order: 4000,
            title_content: 'Payment Method',
            content: require('@screens/checkout/components/checkout/payment').default
        },
        default_list: {
            active: true,
            sort_order: 5000,
            title_content: 'Shipment Details',
            content: require('@screens/checkout/components/quoteitem/list').default
        },
        default_total: {
            active: true,
            sort_order: 6000,
            title_content: 'Totals',
            content: require('@screens/checkout/components/totals').default
        },
        default_term_condition: {
            active: true,
            sort_order: 7000,
            title_content: 'Term and Conditions',
            content: require('@screens/checkout/components/checkout/term').default
        }
    }
}
