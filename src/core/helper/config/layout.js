import ExternalLayout from '@etc/layout/layout';
import ProductLayout from '@etc/layout/core/product';
import ProductsLayout from '@etc/layout/core/products';
import StandardLayout from '@etc/layout/core/theme/standard';
import MatrixLayout from '@etc/layout/core/theme/matrix';
import ZaraLayout from '@etc/layout/core/theme/zara';
import CartLayout from '@etc/layout/core/cart';
import CheckoutLayout from '@etc/layout/core/checkout';
import ThankyouLayout from '@etc/layout/core/thankyou';
import CatalogLayout from '@etc/layout/core/category';
import LoginLayout from '@etc/layout/core/login';
import CustomerLayout from '@etc/layout/core/customer';
import MyAccountLayout from '@etc/layout/core/myaccount';
import AddressBook from '@etc/layout/core/addressbook';
import AddressDetail from '@etc/layout/core/address';
import Orders from '@etc/layout/core/orders';
import OrderDetail from '@etc/layout/core/order';
import Setting from '@etc/layout/core/setting';
import NotificationHistory from '@etc/layout/core/notificationhistory';
import Search from '@etc/layout/core/search';
import HeaderLayout from '@etc/layout/core/header';
import ProfileLayout from '@etc/layout/customize/profile';

export default class Layout {
    static layout = {};
    static plugins = [];

    static initAppLayout() {
        this.createPageLayout('product_layout', 'product', ProductLayout);
        this.createPageLayout('products_layout', 'products', ProductsLayout);
        this.createPageLayout('catalog_layout', 'category', CatalogLayout);
        this.createPageLayout('standard_layout', 'standard', StandardLayout);
        this.createPageLayout('matrix_layout', 'matrix', MatrixLayout);
        this.createPageLayout('zara_layout', 'zara', ZaraLayout);
        this.createPageLayout('cart_layout', 'cart', CartLayout);
        this.createPageLayout('checkout_layout', 'checkout', CheckoutLayout);
        this.createPageLayout('thankyou_layout', 'thankyou', ThankyouLayout);
        this.createPageLayout('login_layout', 'login', LoginLayout);
        this.createPageLayout('customer_layout', 'customer', CustomerLayout);
        this.createPageLayout('myaccount_layout', 'myaccount', MyAccountLayout);
        this.createPageLayout('addressbook_layout', 'addressbook', AddressBook);
        this.createPageLayout('address_layout', 'address', AddressDetail);
        this.createPageLayout('orders_layout', 'orders', Orders);
        this.createPageLayout('order_detail_layout', 'order', OrderDetail);
        this.createPageLayout('setting_layout', 'setting', Setting);
        this.createPageLayout('notification_history_layout', 'notification_history', NotificationHistory);
        this.createPageLayout('header_layout', 'header', HeaderLayout);
        this.createPageLayout('search_layout', 'search', Search);
        this.createPageLayout('profile_layout', 'profile', ProfileLayout);
    }

    static createPageLayout(keyForSave, keyConfig, coreLayout) {
        layout = this.createLayoutObject();

        layout = {
            container: {
                ...coreLayout.container
            },
            content: {
                ...coreLayout.content
            }
        }

        layout = this.loadPluginsForPageLayout(layout, keyConfig);
        layout = this.loadCustomizeForPageLayout(layout, keyConfig);
        layout = this.convertToArray(layout);

        this.layout[keyForSave] = layout;
    }

    static loadPluginsForPageLayout(layoutObj, keyLayout) {
        this.plugins.forEach(plugin => {
            if (plugin.config.enable == '1') {
                layoutObj = this.loadLayoutWithKey(layoutObj, plugin.sku, keyLayout)
            }
        });
        return layoutObj;
    }

    static loadCustomizeForPageLayout(layoutObj, keyLayout) {
        return this.loadLayoutWithKey(layoutObj, 'customize', keyLayout)
    }

    static loadLayoutWithKey(layoutObj, key, keyLayout) {
        if (ExternalLayout.hasOwnProperty(key)) {
            let pluginLayout = ExternalLayout[key];
            if (pluginLayout.hasOwnProperty(keyLayout)) {
                let plugin_layout = pluginLayout[keyLayout];
                if (plugin_layout) {
                    layoutObj = {
                        container: {
                            ...layoutObj.container,
                            ...plugin_layout.container
                        },
                        content: {
                            ...layoutObj.content,
                            ...plugin_layout.content
                        }
                    }
                }
            }
        }
        return layoutObj;
    }

    static convertToArray(layoutObj) {
        for (let key in layoutObj) {
            let layouts = [];
            let container = layoutObj[key];
            for (let itemKey in container) {
                let item = container[itemKey];
                item['id'] = itemKey;
                layouts.push(item);
            }

            layouts.sort(function (a, b) {
                return parseInt(a.sort_order) - parseInt(b.sort_order);
            });

            layoutObj[key] = layouts;
        }
        return layoutObj;
    }

    static createLayoutObject() {
        return ({
            container: {},
            content: {}
        });
    }

}
