import React from 'react';
import { Linking, View, Dimensions } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import Identify from '@helper/Identify';
import MapView, { Marker } from 'react-native-maps';
import styles from "./styles";

const { width, height } = Dimensions.get('window');

export default class MapDetail extends React.Component {

    constructor(props) {
        super(props);
        this.data = this.props.data;
        this.state = {
            renderMap: false
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    renderMap() {
        this.setState({renderMap: true});
    }

    openDirection(marker) {
        var url = "https://www.google.com/maps/search/?api=1&query=" + marker.latitude + "," + marker.longitude;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert(
                    'ERROR',
                    'Unable to open: ' + url,
                    [
                        { text: 'OK' },
                    ]
                );
            }
        });
    }

    render() {
        if(!this.state.renderMap) {
            return(null);
        }
        let marker = {
            latitude: parseFloat(this.data.latitude),
            longitude: this.data.longitude ? parseFloat(this.data.longitude) :  parseFloat(this.data.longtitude)
        }
        console.log(marker)
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    showsUserLocation={true}
                    followUserLocation={true}
                    showsMyLocationButton={true}
                    initialRegion={{
                        latitude: parseFloat(this.data.latitude),
                        longitude: this.data.longitude ? parseFloat(this.data.longitude) :  parseFloat(this.data.longtitude),
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0922 * (width / height),
                    }}
                >
                    <Marker
                        title={this.data.store_name}
                        description={this.data.address}
                        coordinate={marker}
                    />
                </MapView>
                <Button iconLeft small light onPress={() => { this.openDirection(marker) }} style={{ position: 'absolute', bottom: 0, right: 0 }}>
                    <Icon name='md-map' />
                    <Text>{Identify.__("Get Directions")}</Text>
                </Button>
            </View>
        );
    }
}