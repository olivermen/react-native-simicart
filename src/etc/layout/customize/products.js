export default {
    container: {
        selected_filter: {
            active: false,
            sort_order: 500,
            content: require('@screens/catalog/components/verticalproducts/selectedfilter').default
        },
        customize_action_bar: {
            active: true,
            sort_order: 500,
            content: require('../../../customize/catalog/components/verticalproducts/bar').default
        },
        default_vertical_products: {
            active: true,
            sort_order: 1000,
            content: require('../../../customize/catalog/components/verticalproducts').default
        },
        default_bottom: {
            active: false,
            sort_order: 2000,
            content: require('../../../customize/catalog/components/verticalproducts/bottom').default
        },
        customize_sort_popup: {
            active: true,
            sort_order: 3000,
            content: require('../../../customize/catalog/components/verticalproducts/sort').default
        },
        customize_filter_popup: {
            active: true,
            sort_order: 4000,
            content: require('../../../customize/catalog/components/verticalproducts/filter').default
        },
    },
    content: {

    }
}