import React from 'react';
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify';
import styles from '../../../../core/screens/home/components/categories/styles';
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

        // if (item.has_children) {
        //     routeName = 'Category';
        //     params = {
        //         categoryId: item.category_id,
        //         categoryName: item.cat_name,
        //     };
        // } else {
        routeName = 'Products';
        params = {
            categoryId: item.category_id,
            categoryName: item.cat_name,
        };
        // }
        this.tracking(item);
        NavigationManager.openPage(this.props.navigation, routeName, params);
    }
    renderCategoriesItem(item) {
        return (
            <TouchableOpacity
                onPress={() => { this.onClickCategory(item) }}
                style={{
                    width: 196,
                    marginRight: 15,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.20,
                    shadowRadius: 1.41,
                    elevation: 2,
                    borderBottomLeftRadius: 10, borderBottomRightRadius: 10
                }}>
                <Image
                    source={{ uri: item.simicategory_filename }}
                    style={{ width: '100%', height: 151, borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                <View style={{ backgroundColor: 'white', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, paddingVertical: 12 }}>
                    <Text style={{ textAlign: 'center', fontSize: 16, fontFamily: material.fontBold }}>{item.cat_name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    generatePropsFlatlist() {
        return {
            style: { marginLeft: 15, marginTop: 25, paddingBottom: 10 },
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 12 }}>
                        <Text style={{ fontSize: 20, fontFamily: material.fontBold, marginTop: 40 }}>{Identify.__('SHOP BY CATEGORY')}</Text>
                        <Text
                            style={{ fontSize: 16, color: '#E4531A', textDecorationLine: 'underline' }}
                            onPress={() => {
                                NavigationManager.openPage(this.props.navigation, "RootCategory");
                            }}>{Identify.__('View More')}</Text>
                    </View>
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
