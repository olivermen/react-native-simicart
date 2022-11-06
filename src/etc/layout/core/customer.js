export default {
    container: {
        default_customer_button: {
            active: true,
            sort_order: 1000,
            content: require('../../../core/screens/customer/components/customer/customerbutton').default
        },
    },
    content: {
        default_customer_form: {
            active: true,
            sort_order: 1000,
            content: require('../../../core/screens/customer/components/customer/customerform').default
        },
    }
}