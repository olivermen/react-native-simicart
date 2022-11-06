export default {
    container: {
        default_address_button: {
            active: true,
            sort_order: 1000,
            content: require('@screens/customer/components/order/reorder').default
        },
    },
    content: {
        default_summary: {
            active: true,
            sort_order: 1000,
            content: require('@screens/customer/components/order/summary').default
        },
        default_shipping: {
            active: true,
            sort_order: 2000,
            content: require('@screens/customer/components/order/shipping').default
        },
        default_billing: {
            active: true,
            sort_order: 3000,
            content: require('@screens/customer/components/order/billing').default
        },
        default_items: {
            active: true,
            sort_order: 4000,
            content: require('@screens/customer/components/order/items').default
        },
        default_total: {
            active: true,
            sort_order: 5000,
            content: require('@screens/customer/components/order/total').default
        },
    }
}