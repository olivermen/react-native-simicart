export default {
    container: {
        
    },
    content: {
        default_login_form: {
            active: true,
            sort_order: 1000,
            content: require('../../../core/screens/customer/components/login/loginform').default
        },
        default_remember_email_pass: {
            active: true,
            sort_order: 2000,
            content: require('../../../core/screens/customer/components/login/remember').default
        },
        default_login_button: {
            active: true,
            sort_order: 3000,
            content: require('../../../core/screens/customer/components/login/loginbutton').default
        },
        default_forgot_password:{
            active: true,
            sort_order: 5000,
            content: require('../../../core/screens/customer/components/login/forgotPass').default
        },
        default_register_button: {
            active: true,
            sort_order: 8000,
            content: require('../../../core/screens/customer/components/login/registerbutton').default
        }
    }
}