export default {
    container: {
    },
    content: {
        default_banner_slider: {
            active: true,
            sort_order: 1000,
            content: require('../../../customize/home/components/banner').default
        },
        default_products: {
            active: true,
            sort_order: 1500,
            content: require('../../../customize/home/components/products').default
        },
        default_categories: {
            active: true,
            sort_order: 2000,
            content: require('../../../customize/home/components/categories/index').default
        },
        customize_slogan: {
            active: true,
            sort_order: 2500,
            content: require('../../../customize/home/components/slogans').default
        },
        customize_newsletter: {
            active: true,
            sort_order: 3000,
            content: require('../../../customize/home/components/newsletter').default
        }
    }
}
