export default {
    container: {

    },
    content: {
        default_account_info: {
            active: true,
            sort_order: 1000,
            content: require('../../../customize/customer/components/myaccount/account').default
        },
        default_address_book: {
            active: true,
            sort_order: 1000,
            content: require('../../../customize/customer/components/myaccount/address').default
        },
    }
}