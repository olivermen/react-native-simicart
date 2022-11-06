import React from 'react';
import SimiPageComponent from '@base/components/SimiPageComponent';
import Identify from '@helper/Identify';
import { connect } from 'react-redux';
import NewConnection from '@base/network/NewConnection';
import { Container, Content } from 'native-base';
import { View } from 'react-native';
import { products, home_spot_products, products_mode } from '@helper/constants';
import NavigationManager from '@helper/NavigationManager';
import variable from '@theme/variables/material';
import Device from '@helper/device';

class ProductsPage extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            data: null,
            loadMore: true,
            showList: (Identify.getMerchantConfig().storeview.catalog.frontend.view_products_default == '0') ? true : false,
            showBottom: true
        };
        this.cateId = -1;
        this.spotId = -1;
        this.query = this.props.navigation.getParam("query");
        if(this.query) {
            this.showSearch = false;
        }
        this.limit = Device.isTablet() ? 16 : 10;
        this.offset = 0;
        this.lastY = 0;
        this.isLoadingMore = false;
        this.shouldStoreData = true;
        this.mode = this.props.navigation.getParam('mode');
        this.layout = 'ProductDetail';
        this.onFilterAction = this.onFilterAction.bind(this);
        this.onSortAction = this.onSortAction.bind(this);
        this.isBack = this.props.navigation.state.params.hasOwnProperty("showBack") ? this.props.navigation.getParam("showBack") : true;
    }

    componentWillMount() {
        if (this.props.data.showLoading.type === 'none' && !this.props.isCategory) {
            this.props.storeData('showLoading', { type: 'full' });
        }
    }

    componentDidMount() {
        super.componentDidMount();
        if (!this.checkExistData()) {
            this.requestData(this.createParams());
        }
    }

    createParams() {
        let params = {
            limit: this.limit,
            offset: this.offset
        };
        if (this.cateId != -1) {
            params['filter[cat_id]'] = this.cateId;
        }
        if (this.query) {
            this.shouldStoreData = false;
            params['filter[q]'] = this.query;
        }
        return params;
    }

    requestData(params) {
        let url = products;
        if (this.mode === products_mode.spot) {
            url = home_spot_products + '/' + this.spotId;
        }
        new NewConnection()
            .init(url, 'get_products_data', this)
            .addGetData(params)
            .connect();
    }

    setData(data) {
        switch (this.mode) {
            case products_mode.spot: {
                let spotData = data.homeproductlist.product_array;
                this.updateData('add_home_spot_data', this.spotId, spotData);
            }
                break;
            default: {
                this.updateData('add_products_data', this.cateId, data);
            }
                break;
        }
    }

    updateData(type, data_key, data) {
        if (this.state.data) {
            let combinedProducts = this.state.data.products;
            combinedProducts.push.apply(combinedProducts, data.products);
            data.products = combinedProducts;

            let combinedIds = this.state.data.all_ids;
            combinedIds.push.apply(combinedIds, data.all_ids);
            data.all_ids = combinedIds;
        }
        if (this.props.data.showLoading.type !== 'none' && !this.props.isCategory) {
            this.props.storeData('showLoading', { type: 'none' });
        }
        let canLoadMore = true;
        if (this.offset + this.limit >= data.total) {
            canLoadMore = false;
        }
        this.isLoadingMore = false;
        if (this.shouldStoreData) {
            this.state.data = data;
            this.state.loadMore = canLoadMore;
            let productsData = {};
            productsData[data_key] = data;
            this.props.storeData(type, productsData);
        } else {
            this.setState({ data: data, loadMore: canLoadMore });
        }
    }

    loadExistData(item) {
        if (item.products.length % this.limit == 0) {
            this.offset = (~~(item.products.length / this.limit) - 1) * this.limit;
        } else {
            this.offset = (~~(item.products.length / this.limit)) * this.limit;
        }

        let canLoadMore = true;
        if (this.offset + this.limit >= item.total) {
            canLoadMore = false;
        }
        this.state.data = item;
        this.state.loadMore = canLoadMore;
        this.props.storeData('showLoading', { type: 'none' });
        return true;
    }

    checkExistData() {
        this.spotId = this.props.navigation.getParam("spotId") ? this.props.navigation.getParam("spotId") : -1;
        this.cateId = this.props.navigation.getParam("categoryId") ? this.props.navigation.getParam("categoryId") : -1;
        if (this.query) {
            return false;
        }
        switch (this.mode) {
            case products_mode.spot:
                let spotData = this.props.data.home_spot_data;
                if (spotData && spotData.hasOwnProperty(this.spotId)) {
                    let item = spotData[this.spotId];
                    return this.loadExistData(item);
                }
                break;
            default:
                let productsData = this.props.data.products_data;
                if (productsData && productsData.hasOwnProperty(this.cateId)) {
                    let item = productsData[this.cateId];
                    return this.loadExistData(item);
                }
                break;
        }
        return false;
    }

    changeStyle = () => {
        if (this.state.showList == true) {
            this.setState({ showList: false });
        } else {
            this.setState({ showList: true });
        }
    }

    openFilter = () => {
        NavigationManager.openPage(this.props.navigation, 'Filter', {
            filter: this.state.data.layers,
            onFilterAction: this.onFilterAction
        });
    }

    onFilterAction(filterParams) {
        this.limit = Device.isTablet() ? 16 : 10;
        this.offset = 0;
        this.props.storeData('showLoading', { type: 'full' });
        params = {
            ...this.createParams(),
            ...filterParams
        };
        if (this.sortOrder) {
            params = {
                ...params,
                ...this.sortOrder
            }
        }
        this.shouldStoreData = false;
        this.filterData = filterParams
        this.setState({ data: null });
        this.requestData(params);
    }

    openSort = () => {
        NavigationManager.openPage(this.props.navigation, 'Sort', {
            sort: this.state.data.orders,
            onSortAction: this.onSortAction
        });
    }

    onSortAction(order, dir) {
        this.limit = Device.isTablet() ? 16 : 10;
        this.offset = 0;
        this.props.storeData('showLoading', { type: 'full' });
        params = this.createParams();
        if (this.filterData) {
            params = {
                ...params,
                ...this.filterData
            }
        }
        params['order'] = order;
        params['dir'] = dir;
        this.shouldStoreData = false;
        this.sortOrder = { order, dir }
        this.setState({ data: null });
        this.requestData(params);
    }

    onEndReached = () => {
        if (this.offset + this.limit < this.state.data.total && !this.isLoadingMore) {
            this.isLoadingMore = true;
            this.offset += this.limit;
            let params = this.createParams()
            if (this.filterData) {
                params = {
                    ...params,
                    ...this.filterData
                }
            }
            if (this.sortOrder) {
                params = {
                    ...params,
                    ...this.sortOrder
                }
            }
            this.requestData(params);
        }
    }

    onListScroll = ({ nativeEvent }) => {
        if (this.lastY == 0 || this.lastY > nativeEvent.contentOffset.y) {
            if (this.state.showBottom == false) {
                this.setState({ showBottom: true });
            }
        } else {
            if (this.state.showBottom == true) {
                this.setState({ showBottom: false });
            }
        }
        this.lastY = nativeEvent.contentOffset.y;

        if ((Number((nativeEvent.contentSize.height).toFixed(0)) - 1) <= Number((nativeEvent.contentOffset.y).toFixed(1)) + Number((nativeEvent.layoutMeasurement.height).toFixed(1))) {
            this.onEndReached();
        }
    }

    shouldRenderLayoutFromConfig() {
        if (this.state.data) {
            return true;
        }
        return false;
    }

    addMorePropsToComponent(element) {
        return {
            products: this.state.data.products
        };
    }

    renderPhoneLayout() {
        let contentLayout = this.renderLayoutFromConfig('products_layout', 'content');
        return (
            <Container style={{ backgroundColor: variable.appBackground }}>
                {contentLayout.length > 0 && <Content>
                    <View>
                        {contentLayout}
                    </View>
                </Content>}
                {this.renderLayoutFromConfig('products_layout', 'container')}
            </Container>
        );
    }

}

const mapStateToProps = (state) => {
    return { data: state.redux_data };
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductsPage);