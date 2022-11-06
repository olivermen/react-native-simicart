import React from "react";
import { View, Dimensions, Text, Image, TouchableOpacity, Platform } from "react-native";
import SimiComponent from "@base/components/SimiComponent";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Identify from '@helper/Identify';
import { styles } from "./styles";

const { width, height } = Dimensions.get("window");
const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class StoreMap extends SimiComponent {
    constructor(props) {
        super(props);
        this.markers = [];
        this.data = this.props.data ? this.props.data : this.props.navigation.state.params.data
        this.state = {
            showMapInfo: true
        }
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
                <Image source={require('../../../icon/icon-location.png')} style={{ tintColor: '#EF5261' }} />
            </Marker>
        )
    }

    renderPhoneLayout() {
        const { data } = this

        return (
            <View style={styles.containerlist}>
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
                        latitude: parseFloat(data.latitude),
                        longitude: parseFloat(data.longitude),
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                >
                    {this.renderMarker(data)}
                </MapView>
                {this.state.showMapInfo ?
                    <View style={styles.mapInfo}>
                        <TouchableOpacity style={styles.icClose} onPress={this.hideMapInfo}>
                            <Image source={require('../../../icon/icon-close.png')} style={{ width: 10, height: 10 }} />
                        </TouchableOpacity>

                        <Text style={{ fontWeight: '500', paddingBottom: 10 }}>{(Identify.isRtl() && data.name_ar) ? data.name_ar : data.name}</Text>
                        <Text style={{ paddingBottom: 8 }}>{(Identify.isRtl() && data.address_ar) ? data.address_ar : data.street}</Text>
                        <Text>{(Identify.isRtl() && data.telephone_ar) ? data.telephone_ar : data.telephone}</Text>
                    </View>
                    : null}
            </View>
        );
    }
}
