import React from 'react';
import { FlatList } from 'react-native';
import CategoriesItem from './categoriesItem';

class Categories extends React.Component {

    constructor(props) {
        super(props);
    }

    createListProps() {
        return {
            style: { marginTop: this.props.topMargin },
            data: this.props.parent.categoryData.categories,
            showsVerticalScrollIndicator: false
        }
    }

    renderItem(item) {
        return (
            <CategoriesItem item={item} navigation={this.props.navigation} />
        );
    }

    render() {
        return (
            <FlatList
                {...this.createListProps()}
                keyExtractor={(item) => item.entity_id}
                renderItem={({ item }) => this.renderItem(item)} />
        );
    }
}
export default Categories;
