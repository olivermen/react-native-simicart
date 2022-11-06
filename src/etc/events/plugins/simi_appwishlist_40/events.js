import Identify from '@helper/Identify';

export default {
    product_buttons: [
        {
            active: true,
            content: require('../../../../plugins/wishlist/addWishlist').default,
            position: 300
        }
    ],
    menu_left_items: [
        {
            active: true,
            key: 'item_wish_list',
            route_name: "Wishlist",
            label: Identify.__("My Wishlist"),
            icon: 'md-heart',
            require_logged_in: true,
            is_extend: false,
            is_separator: false,
            position: 420
        }
    ],
}