export default {
    customize: {
        products: require('./customize/products').default,
        product: require('./customize/product').default,
        login: require('./customize/login').default,
        address: require('./customize/address').default,
        standard: require('./customize/standard').default,
        checkout: require('./customize/checkout').default,
        cart: require('./customize/cart').default,
        addressbook: require('./customize/addressbook').default,
        orders: require('./customize/orders').default,
        order: require('./customize/order').default,
        header: require('./customize/header').default,
        customer: require('./customize/customer').default,
        myaccount: require('./customize/myaccount').default,
        profile: require('./customize/profile').default,
    },
    simi_simiproductreview_40: {
        product: require('../../etc/layout/plugins/simi_simiproductreview_40/product').default
    },
    simi_appwishlist_40: {
        product: require('../../etc/layout/plugins/simi_appwishlist_40/product').default
    },
    simi_fblogin_40: {
        login: require('../../etc/layout/plugins/simi_fblogin_40/login').default
    },
}
