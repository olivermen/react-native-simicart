import SimiPageComponent from '@base/components/SimiPageComponent';
import { FlatList, Image, TouchableOpacity, SectionList, View, ScrollView, TextInput } from 'react-native'
import { Text } from 'native-base'
import NewConnection from '@base/network/NewConnection';
import { connect } from 'react-redux'
import React from 'react'
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import material from '@theme/variables/material';

class BrandPage extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            selectedChar: null,
            listSearch: null
        }
    }

    componentDidMount() {
        super.componentDidMount();
        if (!this.props.brand) {
            this.props.storeData('showLoading', { type: 'dialog' });
            new NewConnection()
                .init('simiconnector/rest/v2/manufacturers', 'get_brand_data', this)
                .connect();
        }
    }

    setData(data) {
        this.props.storeData('showLoading', { type: 'none' });
        this.props.storeData('brand', data.manufacturers);
    }

    handleItem = (item) => {
        NavigationManager.openPage(this.props.navigation, 'Products', {
            manufacturer_option_id: item.option_id,
            manufacturer_name: item.name,
            manufacturer_image: item.image
        })
    }

    createListData() {
        let filteredData = [], chars = [];
        if (this.props.brand) {
            this.props.brand.forEach(brandItem => {
                const char = brandItem.default_value.toLowerCase()[0];
                chars.push(char);
                if (this.state.selectedChar && this.state.selectedChar != char) {
                    return;
                }
                let filteredItem = filteredData.find(item => item.title == char);
                if (!filteredItem) {
                    filteredItem = {
                        title: char,
                        data: [
                            { list: [brandItem] }
                        ]
                    }
                    filteredData.push(filteredItem);
                } else {
                    filteredItem['data'][0]['list'].push(brandItem);
                }
            });
        }
        return { filteredData, chars };
    }

    renderChars = (availableChar) => {
        const dictionaryOptions = "abcdefghijklmnopqrstuvwxyz".split('').map(
            dictionaryOption => {
                let color = 'black';
                const enable = availableChar.indexOf(dictionaryOption) != -1;
                const selected = this.state.selectedChar && this.state.selectedChar == dictionaryOption;
                if (!enable) {
                    color = '#999999';
                }
                if (selected) {
                    color = '#E4531A';
                }
                return (
                    <Text
                        key={dictionaryOption}
                        style={{ paddingRight: 30, marginBottom: 20, textTransform: 'uppercase', fontSize: 16, fontFamily: material.fontBold, color: color, textDecorationLine: selected ? 'underline' : undefined }}
                        onPress={() => {
                            if (enable) {
                                this.setState({ selectedChar: dictionaryOption })
                            }
                        }}>
                        {Identify.__(dictionaryOption)}
                    </Text>
                )
            });
        return (
            <View style={{ marginTop: 20, borderColor: '#333132', borderTopWidth: 1, borderBottomWidth: 1, paddingTop: 15, flexDirection: 'row', flexWrap: 'wrap', zIndex: 0, elevation: 0 }}>
                <Text
                    style={{ paddingRight: 20, fontSize: 16, fontFamily: material.fontBold, color: this.state.selectedChar ? 'black' : '#E4531A', textDecorationLine: this.state.selectedChar ? undefined : 'underline' }}
                    onPress={() => this.setState({ selectedChar: null })}>
                    {Identify.__('All brands')}
                </Text>
                {dictionaryOptions}
            </View>
        );
    }

    renderItem = (item) => {
        return (
            <FlatList
                style={{ flex: 1, marginTop: 20 }}
                data={item.list}
                numColumns={2}
                keyExtractor={(item) => item.manufacturer_id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: brandItem, index }) => {
                    return (
                        <TouchableOpacity
                            style={{
                                width: '50%',
                                paddingRight: index % 2 == 0 ? 10 : 0,
                                paddingLeft: index % 2 == 0 ? 0 : 10,
                                marginBottom: 20
                            }}
                            onPress={() => this.handleItem(brandItem)}
                        >
                            <Image
                                style={{
                                    flex: 1,
                                    aspectRatio: 3,
                                    backgroundColor: 'white',
                                    borderWidth: 1,
                                    borderColor: '#E6E6E6'
                                }}
                                resizeMode="contain"
                                source={{ uri: brandItem.image }} />
                            <Text style={{ marginTop: 8, fontSize: 16, textAlign: 'center' }}>
                                {brandItem.name}
                            </Text>
                        </TouchableOpacity>
                    )
                }}
            />
        );
    }

    renderItems = ({item}) => (
        <TouchableOpacity 
            style={{ marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}
            onPress={() => this.handleItem(item)}
        >
            <Image
                style={{
                    height: 40,
                    aspectRatio: 2,
                    backgroundColor: 'white',
                    marginRight: 5
                }}
                resizeMode="contain"
                source={{ uri: item.image }} 
            />
            <Text>{item.name}</Text>
        </TouchableOpacity>
    )

    renderPhoneLayout() {
        if (!this.props.brand) return null;
        const { filteredData, chars } = this.createListData();
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ backgroundColor: 'rgba(228,83,26,0.36)', paddingHorizontal: 25, paddingTop: 30, paddingBottom: 40, alignItems: 'center', position: 'relative' }}>
                    <Text style={{ fontSize: 24, fontFamily: material.fontBold }}>{Identify.__('Find brand')}</Text>
                    <Text style={{ fontSize: 16, marginTop: 10 }}>{Identify.__('You can find brands here')}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                        <TextInput
                            style={{
                                flex: 1,
                                backgroundColor: 'white',
                                borderWidth: 1,
                                borderColor: '#E4531A',
                                height: 50,
                                borderRadius: 25,
                                paddingLeft: 20,
                                overflow: 'hidden',
                                paddingRight: 45
                            }}
                            placeholder={Identify.__('Search a brand name')}
                            placeholderTextColor="#7B7B7B"
                            onChangeText={(text) => {
                                this.emailValue = text;
                                if (text) {
                                    this.setState({ listSearch: this.props.brand.filter(item => item.name.includes(text)) })
                                } else {
                                    this.setState({ listSearch: null })
                                }
                            }} />
                        <Image source={require('../../icon/icon-search.png')} style={{ width: 21, height: 21, position: 'absolute', right: 20 }} />
                    </View>
                </View>
                <View style={{ marginTop: 35, marginHorizontal: 12, alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontFamily: material.fontBold }}>{Identify.__('All by Brand')}</Text>
                    {this.renderChars(chars)}
                </View>
                <SectionList
                    sections={filteredData}
                    keyExtractor={(item, index) => item.brand_id + index}
                    style={{ paddingHorizontal: 15, marginTop: 30 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => this.renderItem(item)}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={{ textTransform: 'uppercase', fontSize: 20, fontFamily: material.fontBold }}>{Identify.__(title)}</Text>
                    )}
                />
                {this.state.listSearch && this.state.listSearch.length ? 
                    <FlatList 
                        style={{ position: 'absolute', borderWidth: 1, borderColor: '#ccc', paddingTop: 10, paddingHorizontal: 10, paddingBottom: 5, backgroundColor: '#fff', top: 170, marginLeft: 25, zIndex: 9999, elevation: 10, width: '90%' }}
                        data={this.state.listSearch}
                        keyExtractor={item => item.option_id}
                        renderItem={this.renderItems}
                    /> : null
                }
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => {
    return { brand: state.redux_data.brand };
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BrandPage);
