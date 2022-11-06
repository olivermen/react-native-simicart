import React from 'react';
import { TouchableOpacity, Dimensions } from 'react-native';
import NavigationManager from '@helper/NavigationManager';
import styles from './styles'
import { View, Text } from "native-base";
import PropTypes from 'prop-types';
import Events from '@helper/config/events';


const Item = (props) => {
    function tracking(id) {
        let params = {
            action: 'selected_category',
            category_id: id,
            event: 'home_action'
        };
        Events.dispatchEventAction(params, this);
    }
    function openPage(item) {
        if (item.has_children) {
            routeName = 'Category';
            params = {
                categoryId: item.entity_id,
                categoryName: item.name,
            };
        } else {
            routeName = 'Products';
            params = {
                categoryId: item.entity_id,
                categoryName: item.name,
            };
        }
        tracking(item.entity_id);
        NavigationManager.openPage(props.navigation, routeName, params);
    }

    if (props.item == null) return null;
    let item = props.item;
    return (
        <TouchableOpacity onPress={() => {
            openPage(item)
        }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <Text style={styles.content}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

}

Item.defaultProps = {
    item: null
}

export default Item
