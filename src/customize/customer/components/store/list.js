import React from 'react'
import { FlatList, View, Text, Image, TouchableOpacity } from 'react-native'
import { Icon } from 'native-base'
import Identify from '@helper/Identify';
import StoreDetails from './details'
import { styles } from './styles'

export default class ListStore extends React.Component {

    constructor(props) {
        super(props);
        this.stores = null
        this.state = {
            ...this.state,
            tab1: true,
            tab2: false,
            item: null
        }
    }

    navigateDetails = (item) => {
        this.setState({
            item,
            tab1: false,
            tab2: true
        })
    }

    backAction = () => {
        this.setState({ tab1: true, tab2: false })
    }

    updateStore = (store) => {
        this.props.parent.handleStore(store)
    }

    renderItem = ({ item }) => (
        <View style={styles.container}>
            <View>
                <Text style={[styles.txtHeader, { fontWeight: '500', paddingBottom: 10 }]}>{Identify.isRtl() && item.name_ar ? item.name_ar : item.name}</Text>
                <Text style={{ paddingBottom: 8 }}>{Identify.isRtl() && item.address_ar ? item.address_ar : item.street}</Text>
                <Text style={{ paddingBottom: 8 }}>{(Identify.isRtl() && item.telephone_ar) ? item.telephone_ar : item.telephone}</Text>
                <Text style={{ fontWeight: '500', paddingBottom: 15 }}>
                    {Identify.__('Open today from')} {item.schedule.monday_open} - {item.schedule.monday_close}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => this.navigateDetails(item)}
                        style={[styles.rowCenter, { marginRight: 40 }]}
                    >
                        <Image source={require('../../../icon/icon-info-1.png')} style={{ width: 20, height: 20 }} />
                        <Text style={styles.txtAction}>{Identify.__('More info')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rowCenter} onPress={() => this.updateStore(item)}>
                        <Image source={require('../../../icon/icon-direction.png')} style={{ width: 20, height: 20 }} />
                        <Text style={styles.txtAction}>{Identify.__('Direction')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )

    render() {
        const { data } = this.props
        const { tab1, item } = this.state

        if (tab1) {
            return (
                <View style={{ paddingBottom: 60 }}>
                    <Text style={styles.total}>{data.length} {Identify.__('Store(s)')}</Text>
                    <FlatList
                        data={data}
                        keyExtractor={item => item.location_id}
                        renderItem={this.renderItem}
                    />
                </View>
            )
        } else return <StoreDetails item={item} backAction={this.backAction} />
    }
}