export default {
    container: {
        
    },
    content: {
        plugin_fb_login: {
            active: true,
            sort_order: 8100,
            // content: require('../../../../plugins/facebook/login').default
            content: require('../../../../plugins/facebook/loginV2').default
        }
    }
}