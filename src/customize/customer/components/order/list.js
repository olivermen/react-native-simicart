import React from 'react';
import { ScrollView, FlatList, View, Text } from 'react-native';
import { Spinner } from 'native-base';
import styles from './listStyles';
import OrderItem from './item';
import Identify from '@helper/Identify';

const OrdersList = (props) => {

    function createListProps() {
        return {
            data: props.orders.orders,
            extraData: props.orders,
            showsVerticalScrollIndicator: false
        }
    }

    renderItem = ({ item }) => (
        <OrderItem order={item} />
    )

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
                <View style={styles.view}>
                    <Text style={styles.title}>{Identify.__('My Orders')}</Text>
                    <FlatList
                        {...createListProps()}
                        keyExtractor={(item) => item.entity_id}
                        renderItem={renderItem} />
                    <Spinner color={Identify.theme.loading_color} style={showLoadMore ? {} : { display: 'none' }} />
                </View>
            </ScrollView>
        );
    } else {
        return (
            <View style={styles.view}>
                <Text style={styles.title}>{Identify.__('My Orders')}</Text>
                <View style={styles.container}>
                    <Text style={{ fontSize: 16 }}>{Identify.__('No orders found')}</Text>
                </View>
            </View>
        );
    }
}

export default OrdersList