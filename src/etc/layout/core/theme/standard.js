export default {
    container: {
    },
    content: {
        default_banner_slider: {
            active: true,
            sort_order: 1000,
            content: require('@screens/home/components/banner').default
        },
        default_categories: {
            active: true,
            sort_order: 2000,
            content: require('@screens/home/components/categories').default
        },
        default_products: {
            active: true,
            sort_order: 3000,
            content: require('@screens/home/components/products').default
        }
    }
}
