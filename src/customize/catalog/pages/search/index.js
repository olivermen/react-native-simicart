import React from 'react';
import { View, Image, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { Container, Content, Text } from 'native-base';
import SimiPageComponent from "@base/components/SimiPageComponent";
import NavigationManager from "@helper/NavigationManager";
import Events from '@helper/config/events';
import Identify from '../../../../core/helper/Identify';
import material from '../../../../../native-base-theme/variables/material';
import { products } from '@helper/constants';
import NewConnection from '@base/network/NewConnection';
import Price from '../../components/product/price';

class SearchProducts extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.isBack = true;
        this.showSearch = false;
        this.showHeader = false;
        this.state = {
            ...this.state,
            status: 'note-search',
            query: '',
            data: null,
            suggestion: []
        }
    }

    openSearchResults() {
        const { query } = this.state;
        if (query.length > 0) {
            this.tracking(query);
            routeName = 'Products';
            params = {
                // categoryId: this.props.navigation.getParam("categoryId"),
                categoryName: Identify.__('Search results for') + ': \'' + query + '\'',
                query: query
            };
            NavigationManager.openPage(this.props.navigation, routeName, params);
        }
    }

    queryProducts = (query) => {
        let params = {
            limit: 3
        };
        params['filter[q]'] = query;
        new NewConnection()
            .init(products, 'get_products_data', this)
            .addGetData(params)
            .connect();
    }

    setData(data) {
        this.setState({ data: data })
    }

    checkTypeIdAndPrice(item) {
        if (item.type_id === 'configurable' && item.app_prices && item.app_prices.price == 0) {
            return false;
        }
        return true;
    }

    renderSearchedData() {
        if (this.state.data && this.state.data.products && this.state.data.products.length == 0) {
            return (
                <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'center', marginTop: 50 }}>{Identify.__('No result')}...</Text>
                </View>
            );
        }
        if (!this.state.data || !this.state.data.products || this.state.data.products.length == 0) {
            return null;
        }
        let categories = null;
        if (this.state.data.layers && this.state.data.layers.layer_filter) {
            const filterCategory = this.state.data.layers.layer_filter.find(item => item.attribute == 'category_id');
            if (filterCategory) {
                categories = filterCategory.filter.splice(0, 4).map(item => {
                    return (
                        <TouchableOpacity
                            key={item.value}
                            style={{ padding: 15, flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => {
                                NavigationManager.openPage(this.props.navigation, 'Products', {
                                    categoryId: item.value,
                                    categoryName: item.label,
                                    query: this.state.query
                                });
                            }}>
                            <Text style={{ fontFamily: material.fontBold, color: '#E4531A' }}>{this.state.query}</Text>
                            <Text style={{ marginHorizontal: 3 }}>{Identify.__('in')}</Text>
                            <Text style={{ fontFamily: material.fontBold }}>{item.label}</Text>
                        </TouchableOpacity>
                    );
                })
            }
        }
        const products = this.state.data.products.map(item => {
            return (
                <TouchableOpacity
                    key={item.entity_id}
                    style={{ flex: 1, padding: 15, flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E6E6E6' }}
                    onPress={() => {
                        NavigationManager.openPage(this.props.navigation, 'ProductDetail', {
                            productId: item.entity_id,
                            objData: item
                        });
                    }}>
                    <Image source={{ uri: item.images[0].url }} style={{ width: 58, height: 58 }} />
                    <View style={{ marginLeft: 15, flex: 1 }}>
                        <Text style={{ marginBottom: 5 }}>{item.name}</Text>
                        {this.checkTypeIdAndPrice(item) && (
                            <Price
                                type={item.type_id}
                                prices={item.app_prices}
                                navigation={this.props.navigation}
                                styleOneRowPrice={{ flexDirection: 'column-reverse' }}
                                styleSpecialPrice={{ fontFamily: material.fontBold }}
                                stylePrice={{ fontFamily: material.fontBold }}
                                stylePriceLine={{ color: '#747474', textDecorationLine: 'line-through', fontSize: 12 }}
                            />
                        )}
                    </View>
                </TouchableOpacity>
            );
        })
        return (
            <View style={{ flex: 1 }}>
                <Text style={{ marginTop: 15, marginHorizontal: 15 }}>{this.state.data.total} {Identify.__(this.state.data.total > 1 ? 'items' : 'item')}</Text>
                {categories}
                <Text style={{ paddingVertical: 13, paddingHorizontal: 15, backgroundColor: '#F2F2F2', fontFamily: material.fontBold }}>{Identify.__('Product Suggestions')}</Text>
                {products}
            </View>
        );
    }

    renderPhoneLayout() {
        const searchData = this.renderSearchedData();
        return (
            <Container>
                <Content>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', margin: 20 }}>
                            <Text
                                style={{ fontFamily: material.fontBold, color: '#E4531A', marginLeft: 20 }}
                                onPress={() => NavigationManager.backToRootPage()}>{Identify.__('Cancel')}</Text>
                            <TextInput
                                style={{
                                    flex: 1,
                                    backgroundColor: 'white',
                                    borderWidth: 1,
                                    borderColor: '#7B7B7B',
                                    height: 45,
                                    borderRadius: 23,
                                    paddingLeft: 47,
                                    paddingRight: 15,
                                    overflow: 'hidden',
                                    textAlign: Identify.isRtl() ? 'right' : 'left'
                                }}
                                placeholder={Identify.__('What are you looking for?')}
                                placeholderTextColor="#7B7B7B"
                                autoFocus={true}
                                onSubmitEditing={() => this.openSearchResults()}
                                onChangeText={(text) => {
                                    if (text.length > 2) {
                                        this.setState({ query: text });
                                        this.queryProducts(text);
                                    } else {
                                        this.setState({ query: text, data: null });
                                    }
                                }} />
                            <TouchableOpacity
                                style={{ position: 'absolute', right: 15 }}
                                onPress={() => this.openSearchResults()}>
                                <Image
                                    source={require('../../../icon/icon-search.png')}
                                    style={{ width: 21, height: 21, tintColor: '#686868' }} />
                            </TouchableOpacity>
                        </View>
                        {(this.state.query.length > 2 || this.state.data) ? searchData : null}
                    </View>
                </Content>
            </Container>
        );
    }

    tracking(query) {
        let data = {};
        data['event'] = 'search_action';
        data['action'] = 'view_search_results';
        data['search_term'] = query;
        Events.dispatchEventAction(data, this);
    }

}

export default SearchProducts;
