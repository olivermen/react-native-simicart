export default {
    container : {
        default_address_button: {
            active: true,
            sort_order: 1000,
            content: require('@screens/customer/components/address/addressbutton').default
        },
    },
    content : {
        default_address_form: {
            active: true,
            sort_order: 1000,
            content: require('@screens/customer/components/address/addressform').default
        },
    }
}
