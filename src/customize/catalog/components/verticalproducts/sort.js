import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { Icon, Text } from 'native-base';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';

const SortPopup = (props) => {

    const data = props.parent.state.data.orders ? (Identify.isRtl() ? props.parent.state.data.orders.filter(item => item.value !== 'ماركة') : props.parent.state.data.orders.filter(item => item.value !== 'Brand')) : null;

    if (!data) {
        return null;
    }

    const getDirectionLabel = (key, dir) => {
        if (key == 'name') {
            if (dir == 'asc') {
                return 'A-Z';
            } else {
                return 'Z-A';
            }
        } else {
            if (dir == 'asc') {
                return Identify.__('Low to High');
            } else {
                return Identify.__('High to Low');
            }
        }
    }

    const sortOptions = data.map(item => {
        if (item.key == 'position') {
            return null;
        }
        return (
            <TouchableOpacity
                key={item.key + item.direction}
                style={{ padding: 15, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}
                onPress={() => {
                    props.parent.onSortAction(item.key, item.direction)
                }}>
                <Text style={{ color: item.default == '1' ? '#E4531A' : 'black' }}>{Identify.__(item.value)}: {Identify.__(getDirectionLabel(item.key, item.direction))}</Text>
                {item.default == '1' && <Icon name={"md-checkmark"} style={{ fontSize: 15, color: '#E4531A' }} />}
            </TouchableOpacity>
        );
    })

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.parent.state.showSort}
            onRequestClose={() => {
                console.log('Modal has been closed.');
            }}>
            <TouchableOpacity
                activeOpacity={1}
                style={{ flex: 1, backgroundColor: 'transparent' }}
                onPress={() => props.parent.setState({ showSort: false })}>
                <>
                    <View style={{ backgroundColor: 'white', paddingVertical: 15, marginTop: material.platform === 'ios' ? 186 + (material.isIphoneX ? 24 : 0) : 174 }}>
                        {sortOptions}
                    </View>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
                        onPress={() => props.parent.setState({ showSort: false })} />
                </>
            </TouchableOpacity>
        </Modal>
    );

}

export default SortPopup;