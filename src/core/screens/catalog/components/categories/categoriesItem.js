import React from 'react';
import SimiComponent from "../../../../base/components/SimiComponent";
import { ListItem, Left, Right, Icon, Text } from "native-base";
import NavigationManager from '../../../../helper/NavigationManager';
import Identify from '@helper/Identify';

const CategoriesItem = (props) => {
    function openCategory(category) {
        if (category.has_children) {
            routeName = 'Category',
                params = {
                    categoryId: category.entity_id,
                    hasChild: category.has_children,
                    categoryName: category.name,
                };
        } else {
            routeName = 'Products',
                params = {
                    categoryId: category.entity_id,
                    categoryName: category.name,
                };
        }
        NavigationManager.openPage(props.navigation, routeName, params);
        // comment
    };

    let item = props.item;
    return (
        <ListItem onPress={() => { openCategory(item) }}>
            <Left>
                <Text>{item.name}</Text>
            </Left>
            <Right>
                <Icon name={Identify.isRtl() ? 'ios-arrow-back' : "ios-arrow-forward"} color="red" />
            </Right>
        </ListItem>
    )

}
export default CategoriesItem;