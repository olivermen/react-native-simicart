import React from 'react';
import SimiPageComponent from '@base/components/SimiPageComponent';
import { View, Platform } from 'react-native';
import { Icon, Text, Tab, Tabs, Container, Button } from 'native-base';
import NewConnection from '@base/network/NewConnection';
import Identify from '@helper/Identify';
import { store_locator } from '../constants';
import ListStore from './list';
import MapStore from './map';
import { scale } from 'react-native-size-matters';
import NavigationManager from '@helper/NavigationManager';
import material from "@theme/variables/material";
import Geolocation from '@react-native-community/geolocation';

//tab viewpater new
import { PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'rn-viewpager';

export default class StoreLocator extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.latitude = 0;
        this.longitude = 0;
        this.limit = 10;
        this.offset = 0;
        this.lastY = 0;
        this.state = {
            ...this.state,
            data: {}
        }

        this.tag = this.props.navigation.getParam("tag", null);
        this.country = this.props.navigation.getParam("country", null);
        this.city = this.props.navigation.getParam("city", null);
        this.stateId = this.props.navigation.getParam("state", null);
        this.zipcode = this.props.navigation.getParam("zipcode", null);
        this.refersh = this.props.navigation.getParam("refersh", null);
        this.countryName = this.props.navigation.getParam("countryName", null);
        this.connectApi.bind(this);
    }

    componentWillMount() {
        if (!this.props.storelocator || this.refersh) {
            this.showLoading('full');
        }
    }

    componentDidMount() {
        this.getLocation();
    }

    setData(data) {
        let data1 = data.storelocations;
        let data2 = this.state.data.storelocations ? this.state.data.storelocations : [];
        let combinedData = {};
        combinedData['storelocations'] = data2.concat(data1);
        combinedData['total'] = data.total;
        this.isLoadingMore = false;
        this.showLoading('none');
        this.setState({ data: combinedData });
    }

    connectApi(more = false) {
        if (!this.props.storelocator || more == true || this.refersh) {
            let params = [];
            params['lat'] = this.latitude;
            params['lng'] = this.longitude;
            params['offset'] = this.offset;
            params['limit'] = this.limit;
            if (this.tag) params['tag'] = this.tag;
            if (this.country) params['country'] = this.country;
            if (this.city) params['city'] = this.city;
            if (this.stateId) params['state'] = this.stateId;
            if (this.zipcode) params['zipcode'] = this.zipcode;

            new NewConnection()
                .init(store_locator, 'get_store_locator_data', this)
                .addGetData(params)
                .connect();
        }
    }

    renderHeading(title) {
        return (
            <View
                style={{ backgroundColor: Identify.theme.button_background }}
            >
                <Text
                    style={{
                        fontFamily: material.fontFamily,
                        color: Identify.theme.button_text_color,
                        fontSize: 16
                    }}
                >{title}</Text>
            </View>
        )
    }

    _renderTabIndicator() {
        let tabs = [
            {
                text: Identify.__("Store List"),
            },
            {
                text: Identify.__("Map View"),
            },
        ];
        return <PagerTabIndicator tabs={tabs} selectedTextStyle={{ fontSize: 15 }} textStyle={{ fontSize: 15 }} />;
    }

    renderPhoneLayout() {
        let listStore = this.state.data.storelocations;
        if (!listStore || listStore.length == 0) {
            return (
                <Container>
                    <View>
                        <Text style={{ textAlign: 'center', marginTop: 90 }}>{Identify.__('The store list is empty')}</Text>
                    </View>
                    <Button primary onPress={() => { this.openSearchPage() }} style={{ position: 'absolute', bottom: scale(10), right: scale(20), height: 50, width: 50, borderRadius: scale(100) }}><Icon name='search' fontSize={8} /></Button>
                </Container>
            );
        }

        return (
            <Container>
                <View style={{ flex: 1 }}>
                    <IndicatorViewPager
                        style={{ flex: 1, flexDirection: 'column-reverse' }}
                        indicator={this._renderTabIndicator()}>
                        <View>
                            <ListStore data={this.state.data} parent={this} />
                        </View>
                        <View>
                            <MapStore data={this.state.data} parent={this} />
                        </View>
                    </IndicatorViewPager>
                </View>
                <Button primary onPress={() => { this.openSearchPage() }} style={{ position: 'absolute', bottom: scale(10), right: scale(20), height: 50, width: 50, borderRadius: scale(100) }}><Icon name='search' fontSize={8} /></Button>
            </Container>
        );
    }


    getLocation() {
        Geolocation.getCurrentPosition(
            (position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.connectApi();
            },
            (error) => { this.error = error; this.connectApi(); },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 },
        );
    }

    openSearchPage() {
        NavigationManager.openPage(this.props.navigation, 'StoreLocatorSearch', {
            tag: this.tag,
            country: this.value,
            city: this.city,
            state: this.stateId,
            zipcode: this.zipcode,
            countryName: this.countryName,
            onSearchAction: this.applySearch.bind(this)
        })
    }

    applySearch(tag, country, city, state, zipcode, refersh, countryName) {
        this.tag = tag;
        this.country = country;
        this.city = city;
        this.stateId = state;
        this.zipcode = zipcode;
        this.refersh = refersh;
        this.countryName = countryName;
        this.state.data = {};
        this.showLoading('dialog');
        this.connectApi();
    }

}