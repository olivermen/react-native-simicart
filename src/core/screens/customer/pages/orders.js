import React from 'react';
import { connect } from 'react-redux';
import SimiPageComponent from '@base/components/SimiPageComponent';
import { order_history } from '@helper/constants';
import NewConnection from '@base/network/NewConnection';
import { Container } from 'native-base';
import variable from '@theme/variables/material';

export default class OrdersPage extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            loadMore: true,
            order_history_data: null
        };
        this.limit = 10;
        this.offset = 0;
        this.lastY = 0;
        this.isLoadingMore = false;
    }

    componentWillMount() {
        this.state.showLoading = 'full';
    }

    componentDidMount() {
        super.componentDidMount();
        this.requestData(this.createParams());
    }

    createParams() {
        let params = [];
        params['limit'] = this.limit;
        params['offset'] = this.offset;
        params['order'] = 'entity_id';
        params['dir'] = 'desc';
        return params;
    }

    requestData(params) {
        new NewConnection()
            .init(order_history, 'get_order_history', this)
            .addGetData(params)
            .connect();
    }

    setData(data, requestID) {
        if (this.state.order_history_data) {
            let combinedOrders = this.state.order_history_data.orders ? this.state.order_history_data.orders : [];
            combinedOrders.push.apply(combinedOrders, data.orders);
            data.orders = combinedOrders;

            let combinedIds = this.state.order_history_data.all_ids ? this.state.order_history_data.all_ids : [];
            combinedIds.push.apply(combinedIds, data.all_ids);
            data.all_ids = combinedIds;
        }
        let canLoadMore = true;
        if (this.offset + this.limit >= data.total) {
            canLoadMore = false;
        }
        this.isLoadingMore = false;
        this.showLoading('none');

        this.setState({
            order_history_data: data,
            loadMore: canLoadMore
        })
    }

    onEndReached = () => {
        if (this.state.order_history_data) {
            if (this.offset + this.limit < this.state.order_history_data.total && !this.isLoadingMore) {
                this.isLoadingMore = true;
                this.offset += this.limit;
                this.requestData(this.createParams());
            }
        }
    }

    shouldRenderLayoutFromConfig() {
        if (this.state.order_history_data) {
            return true;
        }
        return false;
    }

    addMorePropsToComponent(element) {
        return {
            orders: this.state.order_history_data ? this.state.order_history_data : {}
        };
    }

    renderPhoneLayout() {
        return (
            <Container style={{ backgroundColor: variable.appBackground }}>
                {this.renderLayoutFromConfig('orders_layout', 'container')}
            </Container>
        );
    }
}