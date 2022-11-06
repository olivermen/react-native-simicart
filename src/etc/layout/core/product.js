import { products } from '../../../core/helper/constants';
import Identify from '../../../core/helper/Identify'
export default {
    container: {
        default_add_to_cart: {
            active: true,
            sort_order: 1000,
            content: require('../../../core/screens/catalog/components/product/AddToCart').default,
            position: 'right'
        },
        default_fab: {
            active: true,
            sort_order: 2000,
            content: require('../../../core/screens/catalog/components/product/fab').default,
            position: 'right'
        },
    },
    content: {
        default_image_slider: {
            active: true,
            sort_order: 1000,
            content: require('../../../core/screens/catalog/components/product/images').default,
            position: 'left'
        },
        default_name_price: {
            active: true,
            sort_order: 2000,
            content: require('../../../core/screens/catalog/components/product/nameprice').default,
            position: 'right'
        },
        default_option: {
            active: true,
            sort_order: 3000,
            content: require('../../../core/screens/catalog/components/product/option').default,
            position: 'right'
        },
        default_description: {
            active: true,
            sort_order: 4000,
            content: require('../../../core/screens/catalog/components/product/description').default,
            position: 'right'
        },
        default_techspecs: {
            active: true,
            sort_order: 5000,
            content: require('../../../core/screens/catalog/components/product/techspecs').default,
            position: 'right'
        },
        default_related: {
            active: true,
            sort_order: 7000,
            content: require('../../../core/screens/catalog/components/horizontalProducts').default,
            data: {
                api: products,
                param: {
                    limit : 10,
                    offset: 0,
                },
                type: {
                    name: 'idAfter',
                    param: 'filter[related_to_id]'
                },
                redux_action: 'add_products_data',
                redux_data_key: 'products_data',
                idName : 'productId',
                show_as_card: true,
                title: 'Related Products'
            },
            position: 'right'
        },
    }
}