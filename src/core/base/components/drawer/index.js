import React from 'react';
import { StyleProvider, Container, List } from "native-base";
import { routes, routes_login } from '../../../../../router/config';
import Identify from '@helper/Identify';
import { connect } from 'react-redux';
import variable from '@theme/variables/material';
import Events from '@helper/config/events';
import Item from './item';
import getTheme from '@theme/components/index';

class Drawer extends React.Component {

    initData() {
        let items = JSON.parse(JSON.stringify(routes));
        let name = "";

        if (!Identify.isEmpty(this.props.customer_data)) {
            let customer = this.props.customer_data;
            items = [...items, ...routes_login];
            name = customer.firstname + ' ' + customer.lastname;
            items[0].label = name;
            items[0].route_name = 'MyAccount';
        }

        items = [...items, ...this.addCms()];

        items = [...items, ...this.dispatchEventAddItems()];

        let activeItems = [];
        items.forEach(element => {
            if (element.active == true && !this.checkDisableItem(element.key) && (!element.hasOwnProperty('shouldDisplay') || element.shouldDisplay())) {
                activeItems.push(element);
            }
        });

        activeItems.sort(function (a, b) {
            return parseInt(a.position) - parseInt(b.position);
        });

        return activeItems;
    }

    checkDisableItem(key) {
        let plugins = Events.events.menu_left_disable_items;
        if (plugins.indexOf(key) >= 0) {
            return true;
        }
        return false;
    }

    addCms() {
        let cmsItems = [];
        let cmsList = null;
        if (this.props.merchant_configs.storeview && this.props.merchant_configs.storeview.cms.cmspages) {
            cmsList = this.props.merchant_configs.storeview.cms.cmspages;
        }

        if (cmsList) {
            cmsList.sort(function(a, b){
                var keyA = a.sort_order,
                    keyB = b.sort_order;
                if(keyA < keyB) return -1;
                if(keyA > keyB) return 1;
                return 0;
            });
            cmsList.forEach(element => {
                cmsItems.push({
                    active: true,
                    key: 'item_cms_id_' + element.cms_id,
                    route_name: "WebViewPage",
                    params: {
                        html: element.cms_content
                    },
                    label: element.cms_title,
                    image: element.cms_image ? { uri: element.cms_image } : {},
                    is_extend: false,
                    is_more: false,
                    position: 701 + cmsList.indexOf(element)
                });
            });
        }
        return cmsItems;
    }

    dispatchEventAddItems() {
        let plugins = Events.events.menu_left_items;
        let items = [];
        if (plugins) {
            for (let i = 0; i < plugins.length; i++) {
                let item = plugins[i];
                let passRequireLogin = true;
                if (item.hasOwnProperty('require_logged_in') && item.require_logged_in == true && Identify.isEmpty(this.props.customer_data)) {
                    passRequireLogin = false;
                }
                let passAdditionalCondition = true;
                if (item.hasOwnProperty('add_condition') && item.add_condition() == false) {
                    passAdditionalCondition = false;
                }
                if (item.active && passRequireLogin && passAdditionalCondition) {
                    items.push(item);
                }
            }
        }
        return items;
    }

    render() {
        if (Identify.theme === null) {
            return (null);
        }
        let items = this.initData();
        return (
            <StyleProvider style={getTheme(variable)}>
                <Container style={{ backgroundColor: variable.menuLeftColor, paddingTop: 30 }}>
                    <List
                        dataArray={items}
                        renderRow={data => {
                            return (
                                <Item data={data} navigation={this.props.navigation} />
                            );
                        }}
                    />
                </Container>
            </StyleProvider>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        customer_data: state.redux_data.customer_data,
        merchant_configs: state.redux_data.merchant_configs,
    };
}

export default connect(mapStateToProps)(Drawer);