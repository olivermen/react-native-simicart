export default {
    container: {
        
    },
    content: {
        default_login_form: {
            active: true,
            sort_order: 1000,
            content: require('../../../customize/customer/components/login/loginform').default
        },
        default_remember_email_pass: {
            active: false,
            sort_order: 2000,
            content: require('../../../core/screens/customer/components/login/remember').default
        },
        default_login_button: {
            active: true,
            sort_order: 3000,
            content: require('../../../customize/customer/components/login/loginbutton').default
        },
        default_forgot_password:{
            active: true,
            sort_order: 2000,
            content: require('../../../customize/customer/components/login/forgotPass').default
        },
        default_register_button: {
            active: true,
            sort_order: 9000,
            content: require('../../../customize/customer/components/login/registerbutton').default
        },
        customize_google_login: {
            active: true,
            sort_order: 8200,
            content: require('../../../customize/login/google').default
        }
    }
}