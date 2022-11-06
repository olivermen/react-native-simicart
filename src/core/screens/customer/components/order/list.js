import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { ScrollView, FlatList } from 'react-native';
import { Spinner, Text } from 'native-base';
import styles from './listStyles';
import OrderItem from './item';
import Identify from '@helper/Identify';
import material from "../../../../../../native-base-theme/variables/material";

const OrdersList = (props) => {

    function createListProps() {
        return {
            style: styles.verticalList,
            data: props.orders.orders,
            extraData: props.orders,
            showsVerticalScrollIndicator: false
        }
    }

    function renderItem(item) {
        return (
            <OrderItem order={item} />
        );
    }

    if (!Identify.isEmpty(props.orders) && props.orders.orders && props.orders.orders.length > 0) {
        let showLoadMore = props.parent.state.loadMore;
        return (
            <ScrollView
                onScroll={({ nativeEvent }) => {
                    if ((Number((nativeEvent.contentSize.height).toFixed(0)) - 1) <= Number((nativeEvent.contentOffset.y).toFixed(1)) + Number((nativeEvent.layoutMeasurement.height).toFixed(1))) {
                        props.parent.onEndReached();
                    }
                }}
                scrollEventThrottle={400}>
                <FlatList
                    {...createListProps()}
                    keyExtractor={(item) => item.entity_id}
                    renderItem={({ item }) => renderItem(item)} />
                <Spinner color={Identify.theme.loading_color} style={showLoadMore ? {} : { display: 'none' }} />
            </ScrollView>
        );
    } else {
        return (
            <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, fontFamily: material.fontBold, margin: 20 }}>{Identify.__('You have placed no orders')}</Text>
        );
    }
}

export default OrdersList