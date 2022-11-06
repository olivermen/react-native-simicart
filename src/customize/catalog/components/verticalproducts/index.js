import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { ScrollView, FlatList, Image } from 'react-native';
import { Spinner, View, Text, Toast } from 'native-base';
import Device from '@helper/device';
import VerticalProductItem from './item';
import styles from '../../../../core/screens/catalog/components/verticalproducts/styles';
import Identify from '@helper/Identify';
import material from "@theme/variables/material";

export default class VerticalProducts extends SimiComponent {
    constructor(props) {
        super(props);
        let showList = this.props.parent.state.showList;
    }

    // componentDidMount() {
    //     Toast.show({
    //         text: this.props.parent.state.data.total + ' ' + Identify.__('Product') + '(' + Identify.__('s') + ')',
    //         duration: 3000,
    //         textStyle: { textAlign: "center", fontFamily: material.fontFamily },
    //     })
    // }

    formatData = (data, numColumns) => {
        let numOfFullRow = Math.floor(data.length / numColumns);
        let numOfItemOnLastRow = data.length - numOfFullRow * numColumns;
        while (numOfItemOnLastRow !== numColumns && numOfItemOnLastRow !== 0) {
            ///remove this sec if don't have loadMore
            if (this.props.parent.state.loadMore) {
                for (let i = 0; i < data.length - 1; i++) {
                    if (data[i].empty) {
                        data.splice(i, 1);
                    }
                }
            }
            ///
            data.push({ entity_id: Identify.makeid(), empty: true, app_prices: { has_special_price: null } })
            numOfItemOnLastRow = numOfItemOnLastRow + 1;
        }
        return data;
    }

    renderItem(item, index) {
        return (<VerticalProductItem
            layout={this.props.parent.layout}
            product={item}
            navigation={this.props.navigation}
            showList={this.props.parent.state.showList}
            itemStyle={{ flex: 1 }}
            index={index}
        />);
    }

    createListProps() {
        let showList = this.props.parent.state.showList;
        let numColumns = (showList && !Device.isTablet()) ? 1 : ((showList && Device.isTablet() || !showList && !Device.isTablet()) ? 2 : 4)
        return {
            style: { paddingBottom: 60, marginHorizontal: 12 },
            data: this.formatData(this.props.products, numColumns),
            extraData: this.props.parent.state.data,
            showsVerticalScrollIndicator: false,
            keyExtractor: (item) => item.entity_id,
            numColumns: numColumns,
            key: (showList) ? 'ONE COLUMN' : 'TWO COLUMN'
        };
    }

    renderBand() {
        return (
            <View style={{ width: '100%', padding: 10, paddingLeft: 20, flexDirection: 'row', backgroundColor: '#F9F9F9', alignItems: 'center', marginBottom: 10 }}>
                <Image style={{ width: 70, aspectRatio: 1, resizeMode: 'contain' }}
                    source={{ uri: this.props.parent.manufacturer_image }} />
                <Text style={{ fontSize: 15, fontFamily: material.fontBold, marginLeft: 15 }}>
                    {Identify.__(this.props.parent.manufacturer_name)}
                </Text>
            </View>
        )
    }

    renderPhoneLayout() {
        let showLoadMore = this.props.parent.state.loadMore;
        if (this.props.products.length === 0) {
            return (
                <Text style={{ textAlign: 'center', fontFamily: material.fontBold, marginTop: 30 }}>{Identify.__('There are no products matching the selection')}</Text>
            )
        } else {
            return (
                <ScrollView
                    onScroll={this.props.parent.onListScroll}
                    scrollEventThrottle={400}
                    showsVerticalScrollIndicator={false}>
                    {this.props.parent.manufacturer_option_id && this.renderBand()}
                    {this.props.parent.categoryName && <Text style={{ marginTop: 40, fontFamily: material.fontBold, textAlign: 'center', fontSize: 20 }}>{this.props.parent.categoryName}</Text>}
                    <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: 20, paddingHorizontal: 12, alignItems: 'center' }}>
                        <Text style={{ fontFamily: material.fontBold, fontSize: 16 }}>{this.props.parent.state.data.total} {Identify.__(this.props.products.length > 1 ? 'Items' : 'Item')}</Text>
                        <View style={{ marginLeft: 5, flex: 1, height: 1, backgroundColor: 'black', marginTop: 5 }} />
                    </View>
                    <FlatList
                        {...this.createListProps()}
                        renderItem={({ item, index }) => {
                            if (item.empty) {
                                return <View style={{ flex: 1 }} />
                            }
                            return (
                                this.renderItem(item, index)
                            );
                        }
                        } />
                    <Spinner color={Identify.theme.loading_color} style={(showLoadMore) ? {} : { display: 'none' }} />
                </ScrollView>
            );
        }
    }

}
