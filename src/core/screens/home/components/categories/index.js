import React from 'react';
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify';
import styles from './styles';
import { Image, FlatList, TouchableOpacity } from 'react-native';
import { View, Text, H3 } from 'native-base';
import { connect } from 'react-redux';
import Events from '@helper/config/events';
import material from '@theme/variables/material';

class Categories extends React.Component {

    constructor(props) {
        super(props);
        this.listCategories = this.props.data;
        this.listCategories.sort(function (a, b) {
            return parseInt(a.sort_order) - parseInt(b.sort_order);
        });
    }

    tracking(item) {
        let data = {};
        data['event'] = 'home_action';
        data['action'] = 'selected_category';
        data['category_id'] = item.category_id;
        data['category_name'] = item.cat_name;
        Events.dispatchEventAction(data, this);
    }
    onClickCategory(item) {

        if (item.has_children) {
            routeName = 'Category';
            params = {
                categoryId: item.category_id,
                categoryName: item.cat_name,
            };
        } else {
            routeName = 'Products';
            params = {
                categoryId: item.category_id,
                categoryName: item.cat_name,
            };
        }
        this.tracking(item);
        NavigationManager.openPage(this.props.navigation, routeName, params);
    }
    renderCategoriesItem(item) {
        return (
            <TouchableOpacity onPress={() => { this.onClickCategory(item) }}>
                <View style={styles.listItem}>
                    <View style={[styles.imageListItem, { borderColor: material.imageBorderColor, borderWidth: 0.5, justifyContent: 'center', alignItems: 'center' }]}>
                        <Image resizeMode='contain' source={{ uri: item.simicategory_filename }} style={{ width: '100%', aspectRatio: item.width/item.height }} />
                    </View>
                    <Text style={styles.textListItem}>{item.cat_name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    generatePropsFlatlist() {
        return {
            style: styles.list,
            data: this.listCategories,
            horizontal: true,
            showsHorizontalScrollIndicator: false
        }
    }
    render() {
        if (!this.listCategories || Identify.isEmpty(this.listCategories)) {
            return (
                <View />
            );
        } else {
            return (
                <View>
                    <H3 style={styles.title}>{Identify.__('CATEGORY')}</H3>
                    <FlatList
                        {...this.generatePropsFlatlist()}
                        keyExtractor={(item) => item.category_id}
                        renderItem={({ item }) =>
                            this.renderCategoriesItem(item)
                        }
                    />
                </View>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.home_data.home.homecategories.homecategories };
}
export default connect(mapStateToProps)(Categories);
//export default Categories;
