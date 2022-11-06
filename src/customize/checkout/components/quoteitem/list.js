import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import Identify from '@helper/Identify';
import { Text, H3, Icon } from 'native-base';
import material from '@theme/variables/material';
import QuoteItem from './item';

const ListItems = (props) => {

    const [expanded, setExpanded] = useState(true);

    function generatePropsFlatlist(list) {
        return {
            data: list,
            extraData: props.parent.list,
            showsVerticalScrollIndicator: false
        }
    }

    function renderItem(item) {
        return (
            <QuoteItem data={item} parent={props.parent} />
        );
    }

    let list = props.list ? props.list : props.parent.list;
    if (list) {
        return (
            <View style={{ marginHorizontal: (props.parent.from && props.parent.from == 'cart') ? 12 : 0 }}>
                {props.from == 'order_detail' && <H3 style={{ width: '100%', backgroundColor: '#EDEDED', paddingLeft: 15, paddingRight: 10, paddingTop: 10, paddingBottom: 10, textAlign: 'left' }}>{Identify.__('Items').toUpperCase()}</H3>}
                <View style={{ marginTop: 30, borderBottomWidth: 1, borderBottomColor: '#D8D8D8', paddingBottom: 10 }}>
                    {!props.from && <Text style={{ fontSize: 20, fontFamily: material.fontBold, textAlign: 'center' }}>{Identify.__('Shopping Cart')}</Text>}
                    {props.parent.state.isShowValidate ?
                        <View style={{ width: '100%', borderRadius: 8, borderWidth: 1, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', borderColor: '#e4531a', backgroundColor: '#FFE699', marginTop: 16 }}>
                            <Text style={{ fontSize: 16, textAlign: 'center' }}>{Identify.__('Some products are not available in')} </Text>
                            <Text style={{ fontSize: 16, textAlign: 'center' }}>{Identify.__(props.parent.selectedStore.name)}</Text>
                        </View> : null}
                    {props.parent.props.data.min_order_message && <View style={{ backgroundColor: '#FFF4E5', borderWidth: 1, borderColor: '#FF9E37', borderRadius: 8, padding: 15, width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                        <Text style={{ fontSize: 16 }}>{Identify.__(props.parent.props.data.min_order_message)}</Text>
                    </View>}
                    <TouchableOpacity
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30 }}
                        onPress={() => {
                            if (props.from) {
                                setExpanded(!expanded);
                            }
                        }}>
                        <Text style={{ fontSize: 16 }}><Text style={{ fontFamily: material.fontBold }}>{list.length}</Text> {Identify.__('Item(s)')}</Text>
                        {expanded
                            ? <Icon style={{ fontSize: 18, color: 'black' }} name="ios-arrow-up" />
                            : <Icon style={{ fontSize: 18, color: 'black' }} name="ios-arrow-down" />}
                    </TouchableOpacity>
                </View>
                {expanded && <FlatList
                    {...generatePropsFlatlist(list)}
                    keyExtractor={(item) => item.item_id}
                    renderItem={({ item }) =>
                        renderItem(item)
                    } />}
                {!props.from && <View style={{ marginTop: 15, flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={{ flex: 1, height: 35, borderWidth: 1, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => props.parent.clearAllItems()}>
                        <Text
                            style={{ fontSize: 12, fontFamily: material.fontBold }}
                            numberOfLines={1}
                            ellipsizeMode='tail'>
                            {Identify.__('CLEAR ALL ITEMS')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flex: 1.5, height: 35, borderRadius: 5, backgroundColor: '#E4531A', alignItems: 'center', justifyContent: 'center', marginLeft: 16 }}
                        onPress={() => props.parent.refreshListView()}>
                        <Text
                            style={{ fontSize: 12, color: 'white', fontFamily: material.fontBold }}
                            numberOfLines={1}
                            ellipsizeMode='tail'>
                            {Identify.__('UPDATE SHOPPING CART')}
                        </Text>
                    </TouchableOpacity>
                </View>}
            </View>
        );
    }
    return null;
}

ListItems.defaultProps = {
    is_go_detail: false,
    from: null
};

export default ListItems;
