export const storeviews_default = 'simiconnector/rest/v2/storeviews/default';
export const homes = 'simiconnector/rest/v2/homes';
export const homes_lite = 'simiconnector/rest/v2/homes/lite';
export const home_spot_products = 'simiconnector/rest/v2/homeproductlists';
export const category = 'simiconnector/rest/v2/categories';
export const products = 'simiconnector/rest/v2/products';
export const customer_login = 'simiconnector/rest/v2/customers/login';
export const customer_logout = 'simiconnector/rest/v2/customers/logout';
export const customers = 'simiconnector/rest/v2/customers';
export const quoteitems = 'simiconnector/rest/v2/quoteitems';
export const order_history = 'simiconnector/rest/v2/orders';
export const addresses = 'simiconnector/rest/v2/addresses';
export const onepage = 'simiconnector/rest/v2/orders/onepage';
export const storeviews = 'simiconnector/rest/v2/storeviews';
export const devices = 'simiconnector/rest/v2/devices';
export const notifications_history = 'simiconnector/rest/v2/notifications';

export const customizepayments = 'simiconnector/rest/v2/customizepayments';

export const forgotpassword = 'simiconnector/rest/v2/customers/forgetpassword';
export const customer_social_login = 'simiconnector/rest/v2/customers/sociallogin';

export const autologin_info = 'autologin_info';
export const rememberme_info = 'rememberme_info';

export const products_mode = {
  category: 'category',
  spot:'spot'
};

export const address_book_mode = {
  normal: 'view_address',
  checkout: {
    select: 'checkout_select_address',
    edit_shipping: 'checkout_edit_shipping_address',
    edit_billing: 'checkout_edit_billing_address',
  }
};

export const address_detail_mode = {
  normal: {
    add_new: 'add_new_address_detail',
    edit: 'edit_address_detail',
  },
  checkout: {
    exist_customer: {
      add_new: 'checkout_exist_customer_add_new_address',
      edit_shipping: 'checkout_exist_customer_edit_shipping_address',
      edit_billing: 'checkout_exist_customer_edit_billing_address',
    },
    as_new_customer: {
      add_new: 'checkout_new_customer_add_new_address',
      edit_shipping: 'checkout_new_customer_edit_shipping_address',
      edit_billing: 'checkout_new_customer_edit_billing_address',
    },
    as_guest: {
      add_new: 'checkout_guest_add_new_address',
      edit_shipping: 'checkout_guest_edit_shipping_address',
      edit_billing: 'checkout_guest_edit_billing_address',
    }
  }
};

export const checkout_mode = {
  exist_customer: 'checkout_as_existing_customer',
  new_customer: 'checkout_as_new_customer',
  guest: 'checkout_as_guest',
}

export const month = [
  {value: '01', label: 'January'},
  {value: '02', label: 'February'},
  {value: '03', label: 'March'},
  {value: '04', label: 'April'},
  {value: '05', label: 'May'},
  {value: '06', label: 'June'},
  {value: '07', label: 'July'},
  {value: '08', label: 'August'},
  {value: '09', label: 'September'},
  {value: '10', label: 'October'},
  {value: '11', label: 'November'},
  {value: '12', label: 'December'},
]
