import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { ScrollView, View, Linking, Image, TouchableOpacity } from 'react-native';
import { List, Button, Text, Spinner, Icon } from 'native-base';
import NavigationManager from '@helper/NavigationManager';

export default class StoreList extends SimiComponent {

    constructor(props) {
        super(props);
        this.lastY = 0;
        this.isLoadingMore = false;
    }

    loadMore() {
        if (this.props.parent.offset + this.props.parent.limit < this.props.data.total && this.isLoadingMore == false) {
            this.props.parent.offset += this.props.parent.limit;
            this.isLoadingMore = true;
            this.props.parent.connectApi(true);
        }
    }

    renderItemStore(item) {
        let addressString = '';
        addressString = item.address ? addressString + item.address : addressString
        addressString = item.city ? addressString + ' ' + item.city : addressString
        addressString = item.country ? addressString + ' ' + item.country : addressString

        return (
            <TouchableOpacity
                onPress={() => NavigationManager.openPage(this.props.navigation, 'StoreLocatorDetail', { item_data: item })}
                style={{ borderBottomWidth: 1, borderBottomColor: '#EDEDED' }}>
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    <Image style={{ width: 90, height: 90 }}
                        source={{ uri: item.image }} />
                    <View style={{ flex: 1, marginStart: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>{item.store_name}</Text>
                            <Text>{parseInt(item.distance / 1000) + ' ' + 'km'}</Text>
                        </View>
                        <Text>{addressString}</Text>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            {this.renderPhoneItem(item)}
                            {this.renderEmailItem(item)}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderPhoneItem(item) {
        if (item.phone) {
            return (
                <Button transparent primary onPress={() => Linking.openURL(`tel:${item.phone}`).catch(err => console.log(err))}>
                    <Icon name='md-call' />
                </Button>
            )
        }
        return null;
    }

    renderEmailItem(item) {
        if (item.email) {
            return (
                <Button transparent primary onPress={() => Linking.openURL(`mailto:${item.email}`).catch(err => console.log(err))}>
                    <Icon name='md-mail' />
                </Button>
            )
        }
        return null;
    }

    renderPhoneLayout() {
        this.isLoadingMore = false;
        let canLoadMore = true;
        if (this.props.parent.offset + this.props.parent.limit >= this.props.data.total) {
            canLoadMore = false;
        }
        return (
            <ScrollView onScroll={({ nativeEvent }) => {
                this.lastY = nativeEvent.contentOffset.y;
                if ((Number((nativeEvent.contentSize.height).toFixed(0)) - 1) <= Number((nativeEvent.contentOffset.y).toFixed(1)) + Number((nativeEvent.layoutMeasurement.height).toFixed(1))) {
                    this.loadMore();
                }
            }}
                scrollEventThrottle={400}>
                <List dataArray={this.props.data.storelocations}
                    renderRow={(item) => this.renderItemStore(item)
                    }>
                </List>
                <Spinner style={canLoadMore ? {} : { display: 'none' }} />
            </ScrollView>
        );
    }
}