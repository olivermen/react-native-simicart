import Identify from '@helper/Identify';

export default {
    container: {

    },
    content: {
        default_profile: {
            active: false,
            sort_order: 1000,
            content: require('@base/components/menu/BaseMenuItem').default,
            data: {
                keyItem: 'myaccount_profile',
                iconName: 'md-contact',
                label: 'Profile',
                extendable: true
            }
        },
        default_address: {
            active: false,
            sort_order: 2000,
            content: require('@base/components/menu/BaseMenuItem').default,
            data: {
                keyItem: 'myaccount_address',
                iconName: 'md-book',
                label: 'Address Book',
                extendable: true
            }
        },
        default_order_history: {
            active: false,
            sort_order: 3000,
            content: require('@base/components/menu/BaseMenuItem').default,
            data: {
                keyItem: 'myaccount_orders',
                iconName: 'md-paper',
                label: 'Order History',
                extendable: true
            }
        },
        default_register_button: {
            active: false,
            sort_order: 4000,
            content: require('@base/components/menu/BaseMenuItem').default,
            data: {
                keyItem: 'myaccount_logout',
                iconName: 'md-log-out',
                label: 'Sign Out',
                extendable: false
            }
        },
    }
}