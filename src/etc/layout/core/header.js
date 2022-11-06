export default {
    container : {
    },
    content : {
        left : {
            active: true,
            sort_order: 1000,
            content: require('@base/components/layout/header/left').default,
        },
        body: {
            active: true,
            sort_order: 2000,
            content: require('@base/components/layout/header/body').default,
        },
        right:{
          active: true,
          sort_order: 3000,
          content: require('@base/components/layout/header/right').default,
        }
    }
}
