import React from 'react';
import { Text, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { Container, Content, View, Icon } from "native-base";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Identify from '@helper/Identify';
import variable from '@theme/variables/material';
import NewConnection from '@base/network/NewConnection';
import SimiPageComponent from '@base/components/SimiPageComponent';
import StoreDetails from '../components/store/details';
import { styles } from '../components/store/styles';

const { width, height } = Dimensions.get("window");
const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Service extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.stores = null
        this.state = {
            ...this.state,
            showLoading: 'full',
            type: 'list',
            item: null,
            showMapInfo: true
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
        this.stores = data.clickCollectLocations.filter(store => store.is_service_center === '1')
        this.setState({ showLoading: 'none' });
    }

    navigateDetails = (item) => {
        this.setState({ item, type: 'details' })
    }

    redirectMap = (item) => {
        this.setState({ item, type: 'map' })
    }

    backAction = () => {
        this.setState({ type: 'list' })
    }

    _mapReady() {
        Platform.OS === 'ios' ?
            this.map.fitToCoordinates(this.markers, {
                edgePadding: DEFAULT_PADDING,
                animated: true,
            }) :
            this.map.fitToElements(true)
    }

    hideMapInfo = () => {
        this.setState({ showMapInfo: false });
    }

    renderMarker(data) {
        let marker = {
            latitude: parseFloat(data.latitude),
            longitude: data.longitude
                ? parseFloat(data.longitude)
                : parseFloat(data.longtitude),
        };
        return (
            <Marker
                title={data.name}
                description={data.description}
                coordinate={marker}
            >
                <Image source={require('../../icon/icon-location.png')} style={{ tintColor: '#EF5261' }} />
            </Marker>
        )
    }

    renderItem = ({ item }) => (
        <View style={styles.container}>
            <View>
                <Text style={[styles.txtHeader, { fontWeight: '500', paddingBottom: 10 }]}>{(Identify.isRtl() && item.name_ar) ? item.name_ar : item.name}</Text>
                <Text style={{ paddingBottom: 8 }}>{(Identify.isRtl() && item.address_ar) ? item.address_ar : item.street}</Text>
                <Text style={{ paddingBottom: 8 }}>{(Identify.isRtl() && item.telephone_ar) ? item.telephone_ar : item.telephone}</Text>
                <Text style={{ fontWeight: '500', paddingBottom: 15 }}>
                    {Identify.__('Open today from')} {item.schedule.monday_open} - {item.schedule.monday_close}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => this.navigateDetails(item)}
                        style={[styles.rowCenter, { marginRight: 40 }]}
                    >
                        <Image source={require('../../icon/icon-info-1.png')} style={{ width: 20, height: 20 }} />
                        <Text style={styles.txtAction}>{Identify.__('More info')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rowCenter} onPress={() => this.redirectMap(item)}>
                        <Image source={require('../../icon/icon-direction.png')} style={{ width: 20, height: 20 }} />
                        <Text style={styles.txtAction}>{Identify.__('Direction')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )

    renderContent = (type) => {
        const { item } = this.state
        if (type === 'list') {
            return (
                <FlatList
                    data={this.stores}
                    keyExtractor={item => item.location_id}
                    renderItem={this.renderItem}
                />
            )
        } else if (type === 'details') {
            return <StoreDetails item={item} backAction={this.backAction} />
        } else if (type === 'map') {
            return (
                <View style={styles.containerlist}>
                    <TouchableOpacity style={[styles.rowCenter, { marginBottom: 30 }]} onPress={this.backAction} >
                        <Icon name='ios-arrow-back' style={{ color: '#E4531A' }} />
                        <Text style={[styles.txtAction, { fontSize: 16 }]}>{Identify.__('Back to store list')}</Text>
                    </TouchableOpacity>
                    <MapView
                        onLayout={(event) => {
                            this._mapReady();
                        }}
                        ref={(ref) => {
                            this.map = ref;
                        }}
                        provider={PROVIDER_GOOGLE}
                        style={Platform.OS === 'ios' ? styles.mapIOS : styles.mapAndroid}
                        scrollEnabled={true}
                        zoomEnabled={true}
                        showsUserLocation={true}
                        followUserLocation={true}
                        showsMyLocationButton={true}
                        initialRegion={{
                            latitude: parseFloat(item.latitude),
                            longitude: parseFloat(item.longitude),
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}
                    >
                        {this.renderMarker(item)}
                    </MapView>
                    {this.state.showMapInfo ?
                        <View style={styles.mapInfo}>
                            <TouchableOpacity style={styles.icClose} onPress={this.hideMapInfo}>
                                <Image source={require('../../icon/icon-close.png')} style={{ width: 10, height: 10 }} />
                            </TouchableOpacity>

                            <Text style={{ fontWeight: '500', paddingBottom: 10 }}>{Identify.isRtl() ? item.name_ar : item.name}</Text>
                            <Text style={{ paddingBottom: 8 }}>{Identify.isRtl() ? item.address_ar : item.street}</Text>
                            <Text>{item.telephone}</Text>
                        </View>
                        : null}
                </View>
            )
        }
    }

    renderPhoneLayout() {
        if (this.stores) {
            return (
                <Container style={{ backgroundColor: variable.appBackground }}>
                    <Content style={[styles.page, { marginTop: 30 }]}>
                        {this.renderContent(this.state.type)}
                    </Content>
                </Container>
            )
        } else return null
    }
}

export default Service;