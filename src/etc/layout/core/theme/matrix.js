export default {
    container: {
    },
    content: {
        default_banner_slider: {
            active: true,
            sort_order: 1000,
            content: require('@screens/home/components/banner').default
        },
        default_matrix: {
            active: true,
            sort_order: 2000,
            content: require('@screens/home/components/matrixrow').default
        }
    }
}
