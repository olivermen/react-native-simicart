export default {
    container: {
        selected_filter: {
            active: true,
            sort_order: 500,
            content: require('@screens/catalog/components/verticalproducts/selectedfilter').default
        },
        default_vertical_products: {
            active: true,
            sort_order: 1000,
            content: require('../../../core/screens/catalog/components/verticalproducts').default
        },
        default_bottom: {
            active: true,
            sort_order: 2000,
            content: require('../../../core/screens/catalog/components/verticalproducts/bottom').default
        },
    },
    content: {

    }
}