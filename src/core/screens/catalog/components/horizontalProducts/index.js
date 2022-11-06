import React from 'react';
import SimiComponent from "@base/components/SimiComponent";
import { Card, Spinner, H3 } from 'native-base';
import NewConnection from '@base/network/NewConnection';
import { FlatList, ScrollView } from 'react-native';
import HorizontalItem from './horizontal_item'
import { connect } from 'react-redux';
import styles from './styles'
import Identify from "@helper/Identify";
import material from '@theme/variables/material';

class HorizontalProduct extends SimiComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            loaded: false
        };
        this.shouldStoreData = true;
        this.parent = this.props.parent;
    }

    componentDidMount() {
        if (!this.props.title || this.props.title !== 'Related Products') {
            this.requestRelatedProduct();
        }
    }

    requestRelatedProduct() {
        if (!this.props.hasData && !this.checkExistData()) {
            this.requestData(this.createParam(), this.generateUrl(this.props.type.name));
        } else {
            this.setState({ loaded: true })
        }
    }

    setData(data) {
        this.updateData(this.props.redux_action, this.parent[this.props.idName], data);
    }

    updateData(type, data_key, data) {
        if (this.shouldStoreData) {
            this.setState({ data: data, loaded: true })
            let productsData = {};
            productsData[data_key] = data;
            this.props.storeData(type, productsData);
        } else {
            this.setState({ data: data, loaded: true });
        }
    }

    requestData(params, url) {
        new NewConnection()
            .init(url, 'get_products_data', this)
            .addGetData(params)
            .connect();
    }

    createParam() {
        let param = this.props.param;
        if (this.props.type.param) {
            param[this.props.type.param] = this.parent[this.props.idName]
        }
        return param;
    }

    checkExistData() {
        let data = this.props.data[this.props.redux_data_key];
        let key = this.parent[this.props.idName];
        if (data && data.hasOwnProperty(key)) {
            let item = data[key];
            return this.loadExistData(item);
        }
        return false;
    }

    loadExistData(item) {
        this.state.data = item;
        return true;
    }

    //idAfter: api + param + id   idBefore: api + / + id + param
    generateUrl(type) {
        switch (type) {
            case 'idAfter':
                return this.props.api;
                break;
            case 'idBefore':
                return this.props.api + '/' + this.specialId;
                break;
            default:
                return null;
                break;
        }
    }

    renderListProducts(data) {
        return (
            <ScrollView
                style={styles.list}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                showVerticalScrollIndicator={false}
            >
                <FlatList
                    contentContainerStyle={{ flex: 1, flexDirection: 'row' }}
                    data={data}
                    scrollEnabled={false}
                    keyExtractor={(item) => item.entity_id}
                    renderItem={({ item }) =>
                        <HorizontalItem item={item} fromHome={this.props.fromHome} navigation={this.props.navigation} />
                    } />
            </ScrollView>
        )
    }

    render() {
        if (this.parent && this.parent.state.reRender && this.props.title && this.props.title === 'Related Products' && !this.state.data) {
            this.requestRelatedProduct();
        }
        if (!this.state.loaded) {
            if (this.props.showSpinner) {
                return <Spinner color={Identify.theme.loading_color} />;
            } else return null
        }
        let data = this.props.hasData ? this.props.products.slice(0, 9) : this.state.data.products;
        if (data.length == 0) {
            return (null);
        }
        if (this.props.show_as_card) {
            return (
                <Card style={styles.card}>
                    {this.props.title && <H3 style={{ marginStart: 12, marginBottom: 20, ...styles.title, fontFamily: material.fontBold }}>{Identify.__(this.props.title)}</H3>}
                    {this.renderListProducts(data)}
                </Card>
            )
        }
        return this.renderListProducts(data);
    }
}
HorizontalProduct.defaultProps = {
    showSpinner: false
}
const mapStateToProps = (state) => {
    return { data: state.redux_data };
};

const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(HorizontalProduct);
