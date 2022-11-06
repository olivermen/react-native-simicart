export default {
    container: {
        default_action: {
            active: true,
            sort_order: 1000,
            content: require('@screens/customer/components/address/action').default,
        },
        default_list: {
            active: true,
            sort_order: 2000,
            content: require('@screens/customer/components/address/list').default,
        }
    },
    content: {

    }
}
