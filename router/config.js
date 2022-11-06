import Identify from '../src/core/helper/Identify';
export const routes = [
  {
    active: true,
    key: 'item_login',
    route_name: "Login",
    label: "Sign In",
    icon: 'md-person',
    is_extend: false,
    is_separator: false,
    position: 100
  },
  {
    active: true,
    key: 'item_home',
    route_name: "Home",
    label: "Home",
    icon: 'md-home',
    is_extend: false,
    is_separator: false,
    position: 200
  },
  {
    active: true,
    key: 'item_category',
    route_name: "Category",
    params: {
      categoryId: -1,
    },
    label: "Category",
    icon: 'md-list',
    is_extend: false,
    is_separator: false,
    position: 300
  },
  {
    active: false,
    key: 'item_noti_history',
    route_name: "NotificationHistory",
    label: "Notification History",
    icon: 'md-alarm',
    is_extend: false,
    is_separator: false,
    position: 500
  },
  {
    active: true,
    key: 'item_more',
    label: "More",
    is_separator: true,
    position: 600
  },
  {
    active: true,
    key: 'item_setting',
    route_name: "Settings",
    label: "Settings",
    icon: 'md-settings',
    is_extend: false,
    is_separator: false,
    position: 700
  },
];

export const routes_login = [
  {
    active: true,
    key: 'item_order_history',
    route_name: "OrderHistory",
    label: "Order History",
    icon: 'md-paper',
    is_extend: false,
    is_more: false,
    position: 400
  },
];
