import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Container, Content, View } from "native-base";
import Identify from '@helper/Identify';
import variable from '@theme/variables/material';
import NewConnection from '@base/network/NewConnection';
import SimiPageComponent from '@base/components/SimiPageComponent';
import ListStore from '../components/store/list'
import StoreMap from '../components/store/map'
import { styles } from '../components/store/styles';

class Store extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.stores = null
        this.state = {
            ...this.state,
            showLoading: 'full',
            tab1: true,
            tab2: false,
            store: null
        }
    }

    componentDidMount() {
        this.getStores();
    }

    getStores = () => {
        new NewConnection()
            .init('simiconnector/rest/V2/clickCollectLocations', 'get_store', this)
            .addGetData({
                page: 1,
                limit: 10
            })
            .connect();
    }

    setData(data) {
        this.stores = data.clickCollectLocations.filter(store => store.is_service_center === '0' && store.is_allow_pickup === '1')
        this.setState({ showLoading: 'none' });
    }

    handleTabs = (tab) => {
        if (tab === 1) {
            this.setState({ tab1: true, tab2: false })
        } else {
            this.setState({ tab1: false, tab2: true })
        }
    }

    handleStore = (store) => {
        this.setState({
            store,
            tab1: false,
            tab2: true
        })
    }

    renderHeader = () => {
        const { tab1, tab2 } = this.state

        return (
            <View style={styles.header}>
                <TouchableOpacity onPress={() => this.handleTabs(1)} style={[styles.tabHeader, { borderBottomColor: tab1 ? '#E4531A' : '#D8D8D8' }]}>
                    <Text style={[styles.txtHeader, { color: tab1 ? '#000' : '#747474', fontWeight: tab1 ? '500' : 'normal' }]}>
                        {Identify.__('List of store')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleTabs(2)} style={[styles.tabHeader, { borderBottomColor: tab2 ? '#E4531A' : '#D8D8D8' }]}>
                    <Text style={[styles.txtHeader, { color: tab2 ? '#000' : '#747474', fontWeight: tab2 ? '500' : 'normal' }]}>
                        {Identify.__('View on map')}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderPhoneLayout() {
        const { tab1, store } = this.state
        if (this.stores) {
            return (
                <Container style={{ backgroundColor: variable.appBackground }}>
                    <Content style={styles.page}>
                        {this.renderHeader()}
                        {tab1
                            ? <ListStore data={this.stores} parent={this} handleStore={this.handleStore} />
                            : <StoreMap data={store ? store : this.stores[0]} />
                        }
                    </Content>
                </Container>
            )
        } else return null
    }
}

export default Store;