const initialState = {
    dashboard_configs: {},
    merchant_configs: {},
    home_data: {},
    home_spot_data: {},
    category_data: {},
    products_data: {},
    product_details_data: {},
    customer_data: {},
    order_history_data: {},
    order_review_data: {},
    quoteitems: {},
    orders_onepage: {},
    address_book_data: {},
    checkout_steps: {
        selected_shipping_address: false,
        selected_billing_address: false,
        selected_payment_method: false,
        selected_shipping_method: false,
        selected_terms_and_conditions: false,
    },
    currentStepCheckout: 1,
    selectedShippingAddress: null,
    selectedBillingAddress: null,
    useSameShippingAddress: true,
    showLoading: {
        type: 'none',
        style: {}
    },
    popover_config: {
        visible: false,
        modalStackMode: 'MyAccountStack'
    },
    customPayment: null,
    showNotification: {
        show: false,
        data: {}
    },
    notificationHistory: {},
    showUpdate: {
        show: false,
        urlApp: ''
    },
    currentURL: ''
}

export function redux_data(state = initialState, action) {
    if (action.type === 'actions') {
        let actions = action.data;
        actions.forEach(item => {
            state = processSingleAction(state, item);
        });
        return state;
    } else {
        return processSingleAction(state, action);
    }
}

function processSingleAction(state, action) {
    switch (action.type) {
        case 'dashboard_configs':
            return { ...state, ...{ 'dashboard_configs': action.data } };
        case 'merchant_configs':
            return { ...state, ...{ 'merchant_configs': action.data } };
        case 'home_data':
            return { ...state, ...{ 'home_data': action.data } };
        case 'add_home_spot_data':
            let home_spot_data = state.home_spot_data;
            home_spot_data = {
                ...home_spot_data,
                ...action.data
            }
            return { ...state, ...{ 'home_spot_data': home_spot_data } };
        case 'add_category_data':
            let category_data = state.category_data;
            category_data = {
                ...category_data,
                ...action.data
            }
            return { ...state, ...{ 'category_data': category_data } };
        case 'add_products_data':
            let products_data = state.products_data;
            products_data = {
                ...products_data,
                ...action.data
            }
            return { ...state, ...{ 'products_data': products_data } };
        case 'customer_data':
            return { ...state, ...{ 'customer_data': action.data } };
        case 'order_history_data':
            return { ...state, ...{ 'order_history_data': action.data } };
        case 'add_product_details_data':
            let product_details_data = state.product_details_data;
            product_details_data = {
                ...product_details_data,
                ...action.data
            }
            return { ...state, ...{ 'product_details_data': product_details_data } };
        case 'order_review_data':
            return { ...state, ...{ 'order_review_data': action.data } };
        case 'quoteitems':
            return { ...state, ...{ 'quoteitems': action.data } };
        case 'address_book_data':
            return { ...state, ...{ 'address_book_data': action.data } };
        case 'clear_all_data':
            return {
                ...initialState,
                ...{ dashboard_configs: state.dashboard_configs },
                ...{ merchant_configs: state.merchant_configs },
                ...{ showLoading: state.showLoading },
                ...{ customPayment: state.customPayment }
            };
        case 'clear_checkout_data':
            return {
                ...state, ...{
                    'quoteitems': {},
                    'orders_onepage': {},
                    'checkout_steps': {
                        'selected_shipping_address': false,
                        'selected_billing_address': false,
                        'selected_payment_method': false,
                        'selected_shipping_method': false,
                        'selected_terms_and_conditions': false,
                    },
                    'selectedShippingAddress': null,
                    'selectedBillingAddress': null,
                    'useSameShippingAddress': true,
                    'currentStepCheckout': 1
                },
                'showLoading': { type: 'none' }
            };
        case 'selectedBillingAddress':
            return { ...state, ...{ 'selectedBillingAddress': action.data } };
        case 'useSameShippingAddress':
            return { ...state, ...{ 'useSameShippingAddress': action.data } };
        // case 'selected_shipping_address':
        //     return {...state, ...{'selected_shipping_address': action.data}};
        // case 'selected_billing_address':
        //     return {...state, ...{'selected_billing_address': action.data}};
        // case 'selected_shipping_method':
        //     return {...state, ...{'selected_shipping_method': action.data}};
        // case 'selected_payment_method':
        //     return {...state, ...{'selected_payment_method': action.data}};
        // case 'selected_terms_and_conditions':
        //     return {...state, ...{'selected_terms_and_conditions': action.data}};
        // case 'selected_all':
        //     return {...state, ...{'selected_all': action.data}};
        case 'showLoading':
            return { ...state, ...{ 'showLoading': action.data } };
        case 'popover_config':
            return { ...state, ...{ 'popover_config': action.data } };
        case 'customPayment':
            return { ...state, ...{ 'customPayment': action.data } };
        case 'showNotification':
            return { ...state, ...{ 'showNotification': action.data } };
        case 'notification_history_data':
            return { ...state, ...{ 'notification_history_data': action.data } };
        case 'showUpdate':
            return { ...state, ...{ 'showUpdate': action.data } };
        case 'currentURL':
            return { ...state, ...{ 'currentURL': action.data } };
        default:
            let customData = {};
            customData[action.type] = action.data;
            return { ...state, ...customData };
    }
}
