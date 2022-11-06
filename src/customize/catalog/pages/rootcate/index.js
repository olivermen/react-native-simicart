import React from 'react';
import SimiPageComponent from '@base/components/SimiPageComponent';
import Identify from '@helper/Identify';
import { connect } from 'react-redux';
import NewConnection from '@base/network/NewConnection';
import { Accordion, Icon, Text } from 'native-base';
import { StyleSheet, TouchableOpacity, View, Image, FlatList } from 'react-native';
import { products, home_spot_products, products_mode } from '@helper/constants';
import NavigationManager from '@helper/NavigationManager';
import Device from '@helper/device';
import { verticalScale } from 'react-native-size-matters';
import material from '@theme/variables/material';
import SimiCart from '@helper/simicart';
import { ScrollView } from 'react-native';

class RootCategory extends SimiPageComponent {

    componentDidMount() {
        super.componentDidMount();
        if (!this.props.categoryTrees) {
            this.showLoading('full');
            new NewConnection()
                .init('simiconnector/rest/v2/categorytrees', 'get_cate_tree', this)
                .connect();
        }
    }

    setData(data, requestId) {
        this.showLoading('none');
        this.props.storeData('cate_tree', data.categorytrees);
    }

    renderPhoneLayout() {
        if (!this.props.categoryTrees) {
            return null;
        }
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                    <Text style={{ fontSize: 18, fontFamily: material.fontBold, marginVertical: 20 }}>{Identify.__('All Categories')}</Text>
                    <FlatList
                        data={this.props.categoryTrees}
                        keyExtractor={(item) => item.entity_id}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        renderItem={({ item, index }) => {
                            const isEvent = index % 2 == 0;
                            return (
                                <TouchableOpacity 
                                style={{ flex: 1, marginLeft: isEvent ? 0 : 5, marginRight: isEvent ? 5 : 0, marginBottom: 20 }}
                                onPress={() => {
                                    NavigationManager.openPage(this.props.navigation, 'Products', {
                                        categoryId: item.entity_id,
                                        categoryName: item.name
                                    })
                                }}>
                                    <Image source={{ uri: SimiCart.pwa_url + item.image_url }} style={{ width: '100%', aspectRatio: 1.3, borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                                    <Text style={{ fontFamily: material.fontBold, paddingVertical: 12, textAlign: 'center', backgroundColor: 'white', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>{item.name}</Text>
                                </TouchableOpacity>
                            );
                        }} />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    leftItemTextSelected: {
        fontFamily: material.fontBold,
        color: '#E4531A'
    },
    leftItem: {
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: '#D8D8D8',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        minHeight: 55,
    },
    leftItemSelected: {
        backgroundColor: 'white',
        borderRightWidth: 0
    },
    rightViewAll: {
        marginVertical: 20,
        marginHorizontal: 15,
        color: '#096BB3',
        textDecorationLine: 'underline',
        fontSize: 13,
        fontFamily: material.fontBold
    }
});

const mapStateToProps = (state) => {
    return { categoryTrees: state.redux_data.cate_tree };
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RootCategory);