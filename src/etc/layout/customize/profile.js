export default {
    container: {

    },
    content: {
        default_profile_form: {
            active: true,
            sort_order: 1000,
            content: require('../../../customize/customer/components/profile/profileform').default
        },
        default_profile_button: {
            active: true,
            sort_order: 2000,
            content: require('../../../customize/customer/components/profile/profilebutton').default
        },
    }
}