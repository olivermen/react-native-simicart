import React from 'react';
import { FlatList } from 'react-native';
import QuoteItem from './itemOrder';

const ListItems = (props) => {

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
            <FlatList
                {...generatePropsFlatlist(list)}
                keyExtractor={(item) => item.item_id}
                renderItem={({ item }) =>
                    renderItem(item)
                }
            />
        );
    }
    return null;
}

ListItems.defaultProps = {
    is_go_detail: false,
    from: null
};

export default ListItems;
