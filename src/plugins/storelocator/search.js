import React from "react";
import { Icon, Text, Container, Content, Button, View, H3, Input, Item, Form, Label } from 'native-base';
import SimiPageComponent from '@base/components/SimiPageComponent';
import { connect } from 'react-redux';
import NewConnection from '@base/network/NewConnection';
import Identify from '@helper/Identify';
import styles from "./styles";
import { scale } from 'react-native-size-matters';
import { TouchableHighlight, Modal } from 'react-native';
import AdvanceList from '@base/components/advancelist';
import NavigationManager from '@helper/NavigationManager';
import { store_locator_tag } from '../constants';

class Search extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.isPage = true;
        this.tags = [];
        this.state = {
            ...this.state,
            modalVisible: false,
            data: [],
            title: "Country",
            clear: false
        };
        this.countries = Identify.getMerchantConfig().storeview.allowed_countries;
        this.data = [];
        this.value = this.props.navigation.getParam("country", null); //country Code
        this.countryName = this.props.navigation.getParam("countryName", "");
        this.tag = this.props.navigation.getParam("tag", null);
        // this.country = this.props.navigation.getParam("country", null);
        this.city = this.props.navigation.getParam("city", null);
        this.stateId = this.props.navigation.getParam("state", null);
        this.zipcode = this.props.navigation.getParam("zipcode", null);
        this.onSearchAction = this.props.navigation.getParam("onSearchAction", null);
    }
    componentWillMount() {
        if (this.props.loading.type === 'none' && !this.props.tags) {
            this.props.storeData('showLoading', { type: 'full' });
        }
    }
    componentDidMount() {
        //get Tag
        if (!this.props.tags) {
            new NewConnection()
                .init(store_locator_tag, 'get_store_tag', this)
                .connect();
        }
    }
    setData(data) {
        this.tags = data.storelocatortags;
        //this.props.storeData({type: 'none',style: {}});
        this.props.storeData('actions', [
            { type: 'tags', data: this.tags },
            { type: 'showLoading', data: { type: 'none' } }
        ]);
    }
    showModal(data = "", title = "") {
        this.setState(previousState => { return { modalVisible: !previousState.modalVisible, data: data, title: title }; });
    }
    openSelect() {
        this.data = [];
        for (let i in this.countries) {
            let sv = this.countries[i];
            let ssv = { searchStr: sv.country_name, key: sv.country_code, selected: false };
            if (sv.country_code == this.value) {
                ssv['selected'] = true;
            }
            this.data.push(ssv);
        }
        this.showModal(this.data, Identify.__('Country'));
    }
    handleSelected(type, value, item = null) {
        this.value = value;
        this.countryName = item.searchStr;
        this.setState(previousState => { return { modalVisible: !previousState.modalVisible }; });
    }
    renderModal() {
        return (
            <Modal
                onRequestClose={() => { null }}
                animationType="slide"
                transparent={false}
                presentationStyle="fullScreen"
                visible={this.state.modalVisible}>
                <AdvanceList parent={this} data={this.state.data} title={this.state.title} value={this.state.value} />
            </Modal>
        );
    }
    clearData() {
        this.value = null;
        this.city = null;
        this.stateId = null;
        this.zipcode = null;
        this.countryName = "";
        this.tag = null;
        this.setState({
            city: "",
            stateId: "",
            zipcode: ""
        })
        // this.searchAction();
        this.setState(previousState => { return { clear: !previousState.clear }; });
    }
    renderLayout(data) {
        return (
            <Content style={styles.content}>
                <View style={{ paddingTop: scale(15) }}>
                    <H3>{Identify.__('Search By Area')}</H3>
                    <Form>
                        <TouchableHighlight onPress={() => { this.openSelect() }}>
                            <Item inlineLabel disabled pointerEvents='none'>
                                <Label>{Identify.__('Country')}</Label>
                                <Input disabled pointerEvents='none' defaultValue={this.countryName} />
                            </Item>
                        </TouchableHighlight>
                        <Item inlineLabel>
                            <Label>{Identify.__('City')}</Label>
                            <Input
                                value={this.state.city}
                                defaultValue={this.city}
                                onChangeText={(text) => { this.changeCity(text) }} />
                        </Item>
                        <Item inlineLabel>
                            <Label>{Identify.__('State')}</Label>
                            <Input
                                value={this.state.stateId}
                                defaultValue={this.stateId}
                                onChangeText={(text) => { this.changeStateId(text) }} />
                        </Item>
                        <Item inlineLabel last>
                            <Label>{Identify.__('Zip Code')}</Label>
                            <Input
                                value={this.state.zipcode}
                                defaultValue={this.zipcode}
                                onChangeText={(text) => { this.changeZipCode(text) }} />
                        </Item>
                        <View style={[styles.row, { marginTop: scale(15) }]}>
                            <Button primary style={{ marginRight: 30 }} onPress={() => { this.searchAction() }}><Text uppercase={false}>{Identify.__('Search')}</Text></Button>
                            <Button dark onPress={() => { this.clearData() }}><Text uppercase={false}> {Identify.__('Clear')} </Text></Button>
                        </View>
                    </Form>
                </View>

                <View style={{ paddingTop: scale(15) }}>
                    {data.length > 0 && <H3>{Identify.__('Search By Tag')}</H3>}
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginTop: scale(15) }}>
                        {this.renderTags(data)}
                    </View>
                </View>
                {this.renderModal()}
            </Content>
        );
    }
    renderTags(data) {
        if (data.length <= 0) return null;
        let list = [];
        if (this.tag == null || this.tag == "all") {
            list.push(
                <Button onPress={() => { this.tag = "all"; this.searchAction(); }} iconLeft small primary key={-1} style={{ marginRight: scale(10), marginBottom: scale(10) }}>
                    <Icon style={{ marginTop: -2 }} name='ios-pricetag' />
                    <Text style={{ marginTop: -3 }} uppercase={false}>{Identify.__('All')}</Text>
                </Button>
            );
        } else {
            list.push(
                <Button onPress={() => { this.tag = "all"; this.searchAction(); }} iconLeft small bordered primary key={-1} style={{ marginRight: scale(10), marginBottom: scale(10) }}>
                    <Icon style={{ marginTop: -2 }} name='ios-pricetag' />
                    <Text style={{ marginTop: -3 }} uppercase={false}>{Identify.__('All')}</Text>
                </Button>
            );
        }
        for (let i = 0; i < data.length; i++) {
            let tag = data[i];
            if (tag.value == this.tag) {
                list.push(
                    <Button onPress={() => { this.tag = tag.value; this.searchAction(); }} iconLeft small primary key={i} style={{ marginRight: scale(10), marginBottom: scale(10) }}>
                        <Icon style={{ marginTop: -2 }} name='ios-pricetag' />
                        <Text style={{ marginTop: -3 }} uppercase={false}>{tag.value}</Text>
                    </Button>
                );
            } else {
                list.push(
                    <Button onPress={() => { this.tag = tag.value; this.searchAction(); }} iconLeft small bordered primary key={i} style={{ marginRight: scale(10), marginBottom: scale(10) }}>
                        <Icon style={{ marginTop: -2 }} name='ios-pricetag' />
                        <Text style={{ marginTop: -3 }} uppercase={false}>{tag.value}</Text>
                    </Button>
                );
            }
        }
        return list;
    }
    searchAction() {
        this.onSearchAction(this.tag, this.value, this.city, this.stateId, this.zipcode, true, this.countryName);
        NavigationManager.backToPreviousPage(this.props.navigation);
    }
    renderPhoneLayout() {
        if (!this.props.tags) return null;
        return (
            <Container>
                {this.renderLayout(this.props.tags)}
            </Container>
        );
    }
    changeCity(text) {
        this.setState({
            city: text
        })
        this.city = text;
    }
    changeStateId(text) {
        this.setState({
            stateId: text
        })
        this.stateId = text;
    }
    changeZipCode(text) {
        this.setState({
            zipcode: text
        })
        this.zipcode = text;
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.redux_data.showLoading,
        tags: state.redux_data.tags,
    };
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Search);