import React from "react";
import SimiComponent from "@base/components/SimiComponent";
import MapView, { Marker, Callout } from "react-native-maps";
import styles from "./styles";
import material from '../../../native-base-theme/variables/material';
import NavigationManager from '@helper/NavigationManager';
import { View, Dimensions, Text } from "react-native";
const { width, height } = Dimensions.get("window");

const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class StoreMap extends SimiComponent {
  constructor(props) {
    super(props);
    this.markers = [];
  }

  _mapReady() {
    this.map.fitToCoordinates(this.markers, {
      edgePadding: DEFAULT_PADDING,
      animated: true,
    });
  }

  renderMarker(data) {
    try {
      let list = [];
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        let marker = {
          latitude: parseFloat(item.latitude),
          longitude: item.longitude
            ? parseFloat(item.longitude)
            : parseFloat(item.longtitude),
        };
        this.markers.push(marker);
        list.push(
          <Marker
            key={i}
            title={item.name}
            description={item.description}
            coordinate={marker}
          >
            <Callout onPress={() => {
              NavigationManager.openPage(this.props.navigation, 'StoreLocatorDetail', { item_data: item })
            }}>
              <View style={{ height: 100, width: 200 }}>
                <Text style={{ fontFamily: material.fontBold, fontSize: 16 }}>{item.store_name}</Text>
                <Text style={{ fontSize: 12 }}>{item.address}</Text>
                <Text style={{ fontSize: 12 }}>{item.city}</Text>
                <Text style={{ fontSize: 12 }}>{item.country_name} - {item.zipcode}</Text>
              </View>
            </Callout>
          </Marker>
        );
      }
      // this.markers.push({
      //     latitude: parseFloat(this.props.parent.latitude),
      //     longitude: parseFloat(this.props.parent.longitude)
      // });
      return list.length > 0 ? list : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  renderPhoneLayout() {
    return (
      <View style={styles.containerlist}>
        <MapView
          onLayout={(event) => {
            this._mapReady();
          }}
          ref={(ref) => {
            this.map = ref;
          }}
          style={styles.maplist}
          scrollEnabled={true}
          zoomEnabled={true}
          showsUserLocation={true}
          followUserLocation={true}
          showsMyLocationButton={true}
          initialRegion={{
            latitude: parseFloat(this.props.parent.latitude),
            longitude: parseFloat(this.props.parent.longitude),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          {this.renderMarker(this.props.data.storelocations)}
        </MapView>
      </View>
    );
  }
}
