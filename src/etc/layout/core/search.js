export default {
    container : {
        default_search_bar: {
            active: true,
            sort_order: 1000,
            content: require('../../../core/screens/catalog/components/search/bar').default
        },
        default_recents: {
            active: true,
            sort_order: 2000,
            content: require('../../../core/screens/catalog/components/search/recents').default
        },
    },
    content : {
      
    }
}
