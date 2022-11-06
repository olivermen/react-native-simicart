import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image, ScrollView, Dimensions } from 'react-native';
import { Accordion, Icon, Text } from 'native-base';
import { connect } from 'react-redux';
import Identify from '@helper/Identify';
import SimiCart from '@helper/simicart';
import NewConnection from '@base/network/NewConnection';
import NavigationManager from '@helper/NavigationManager';
import SimiPageComponent from '@base/components/SimiPageComponent';
import material from '../../../../../native-base-theme/variables/material';

const screenWidth = Dimensions.get('window').width;

class MenuPage extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            selectedItem: -1
        }
        this.headerProps = {
            showHeaderBottom: false
        }
    }

    componentDidMount() {
        super.componentDidMount();
        if (!this.props.categoryTrees) {
            this.showLoading('dialog');
            new NewConnection()
                .init('simiconnector/rest/v2/categorytrees', 'get_cate_tree', this)
                .connect();
        }
    }

    setData(data, requestId) {
        this.showLoading('none');
        this.props.storeData('cate_tree', data.categorytrees);
    }

    renderItemHeaderRight(item, expanded) {
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingRight: 16,
                marginLeft: 16,
                paddingVertical: 20,
                borderBottomWidth: expanded ? 0 : 1,
                borderBottomColor: '#E6E6E6'
            }}>
                <Text style={{ fontSize: 13 }}>{item.name}</Text>
                <Icon
                    style={{ fontSize: 18, color: '#E4531A' }}
                    name={expanded ? "ios-arrow-up" : "ios-arrow-down"} />
            </View>
        );
    }

    renderItemContentRight(item) {
        let childs = <></>;
        if (item.child_cats) {
            childs = item.child_cats.map(childCate => {
                return (
                    <TouchableOpacity
                        key={childCate.entity_id}
                        style={{ width: '33.33%', alignItems: 'center', paddingVertical: 15 }}
                        onPress={() => NavigationManager.openPage(this.props.navigation, "Products", {
                            categoryId: childCate.entity_id,
                            categoryName: childCate.name
                        })}>
                        <Image
                            source={{ uri: SimiCart.pwa_url + childCate.custom_image }}
                            style={{ width: 60, height: 60 }} />
                        <Text style={{ textAlign: 'center', marginTop: 10, fontFamily: material.fontBold }}>{childCate.name}</Text>
                    </TouchableOpacity>
                );
            })
        }

        return (
            <View>
                <View style={{ flexDirection: 'row', flexWrap: 'nowrap' }}>
                    {childs}
                </View>
                <Text
                    style={{
                        marginTop: 15,
                        marginBottom: 20,
                        color: '#096BB3',
                        textDecorationLine: 'underline',
                        fontSize: 13,
                        fontFamily: material.fontBold,
                        textAlign: 'center'
                    }}
                    onPress={() => NavigationManager.openPage(this.props.navigation, "Products", {
                        categoryId: item.entity_id,
                        categoryName: item.name
                    })}>
                    {Identify.__('View All')} {item.name}
                </Text>
            </View>
        );
    }

    renderRight() {
        if (this.state.selectedItem == -1 ||
            this.state.selectedItem == 0 ||
            this.props.categoryTrees[this.state.selectedItem - 1].child_cats.length == 0) {
            return null;
        }
        const selectedCate = this.props.categoryTrees[this.state.selectedItem - 1];
        return (
            <View style={{ width: screenWidth * 0.7, height: '100%', overflow: 'scroll' }}>
                <Text
                    style={styles.rightViewAll}
                    onPress={() => NavigationManager.openPage(this.props.navigation, "Products", {
                        categoryId: selectedCate.entity_id,
                        categoryName: selectedCate.name
                    })}>
                    {Identify.__('View All')}
                </Text>
                <Accordion
                    key={selectedCate.entity_id}
                    style={{ borderWidth: 0 }}
                    dataArray={selectedCate.child_cats}
                    renderHeader={this.renderItemHeaderRight.bind(this)}
                    renderContent={this.renderItemContentRight.bind(this)}
                />
            </View>
        );
    }

    renderLeftBar() {
        return this.props.categoryTrees.map((item, index) => {
            const isSelected = this.state.selectedItem == (index + 1);
            return (
                <TouchableOpacity
                    key={item.entity_id}
                    style={[
                        styles.leftItem,
                        isSelected ? styles.leftItemSelected : {}]}
                    onPress={() => {
                        this.setState({ selectedItem: index + 1 })
                        if (!item.child_cats || item.child_cats.length == 0) {
                            NavigationManager.openPage(this.props.navigation, "Products", {
                                categoryId: item.entity_id,
                                categoryName: item.name
                            })
                        }
                    }}>
                    <Text style={[{ fontSize: 12 }, isSelected ? styles.leftItemTextSelected : {}]}>{item.name}</Text>
                </TouchableOpacity>
            );
        })
    }

    renderPhoneLayout() {
        if (!this.props.categoryTrees) {
            return null;
        }

        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ width: screenWidth * 0.3, height: '100%', overflow: 'scroll', backgroundColor: '#FAFAFA' }}>
                        <TouchableOpacity
                            key={'brand'}
                            style={[
                                styles.leftItem,
                                this.state.selectedItem == 0 ? styles.leftItemSelected : {}]}
                            onPress={() => {
                                this.setState({ selectedItem: 0 });
                                NavigationManager.openPage(this.props.navigation, 'BrandPage')
                            }}>
                            <Text style={[{ fontSize: 12 }, this.state.selectedItem == 0 ? styles.leftItemTextSelected : {}]}>{Identify.__('Brands')}</Text>
                        </TouchableOpacity>
                        {this.renderLeftBar()}
                        <View key={'fake'} style={{ flex: 1, borderRightWidth: 1, borderColor: '#D8D8D8', }} />
                    </View>
                </ScrollView>
                {this.renderRight()}
            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(MenuPage);