import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { ScrollView, FlatList } from 'react-native';
import { Spinner, View, Text, Toast } from 'native-base';
import Device from '@helper/device';
import VerticalProductItem from './item';
import styles from './styles';
import Identify from '@helper/Identify';
import material from "../../../../../../native-base-theme/variables/material";

export default class VerticalProducts extends SimiComponent {
    constructor(props) {
        super(props);
        let showList = this.props.parent.state.showList;
    }

    componentDidMount() {
        Toast.show({
            text: this.props.parent.state.data.total + ' ' + Identify.__('Product') + '(' + Identify.__('s') + ')',
            duration: 3000,
            textStyle: { textAlign: "center", fontFamily: material.fontFamily },
        })
    }

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

    renderItem(item) {
        return (<VerticalProductItem
            layout={this.props.parent.layout}
            product={item}
            navigation={this.props.navigation}
            showList={this.props.parent.state.showList}
            itemStyle={{ flex: 1 }}
        />);
    }

    createListProps() {
        let showList = this.props.parent.state.showList;
        let numColumns = (showList && !Device.isTablet()) ? 1 : ((showList && Device.isTablet() || !showList && !Device.isTablet()) ? 2 : 4)
        return {
            style: styles.verticalList,
            data: this.formatData(this.props.products, numColumns),
            extraData: this.props.parent.state.data,
            showsVerticalScrollIndicator: false,
            keyExtractor: (item) => item.entity_id,
            numColumns: numColumns,
            key: (showList) ? 'ONE COLUMN' : 'TWO COLUMN'
        };
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
                    <FlatList
                        {...this.createListProps()}
                        renderItem={({ item }) => {
                            if (item.empty) {
                                return <View style={{ flex: 1 }} />
                            }
                            return (
                                this.renderItem(item)
                            );
                        }
                        } />
                    <Spinner color={Identify.theme.loading_color} style={(showLoadMore) ? {} : { display: 'none' }} />
                </ScrollView>
            );
        }
    }

}
