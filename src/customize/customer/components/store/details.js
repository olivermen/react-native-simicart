import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Icon } from 'native-base'
import Identify from '@helper/Identify';
import { styles } from './styles'

const StoreDetails = ({ item, backAction }) => {
    console.log(item.schedule);

    renderOpeningHours = (day, status, openHours, closeHours) => {
        return (
            <View style={styles.timeOpen}>
                <Text style={{ width: '50%' }}>{Identify.__(day)}</Text>
                {status === '1' ?
                    <Text style={{ width: '50%' }}>{Identify.__(`${openHours} - ${closeHours}`)}</Text> :
                    <Text style={{ width: '50%' }}>{Identify.__('Closed')}</Text>}
            </View>
        )
    }

    return (
        <View style={{ paddingBottom: 60 }}>
            <TouchableOpacity style={[styles.rowCenter, { marginBottom: 30 }]} onPress={backAction} >
                <Icon name='ios-arrow-back' style={{ color: '#E4531A' }} />
                <Text style={[styles.txtAction, { fontSize: 16 }]}>{Identify.__('Back to store list')}</Text>
            </TouchableOpacity>
            <View style={[styles.rowCenter, { paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#D8D8D8' }]}>
                <Image source={require('../../../icon/icon-location.png')} style={{ tintColor: '#D51C17', height: 30, width: 20, marginLeft: 10 }} />
                <Text style={styles.nameDetail}>{(Identify.isRtl() && item.name_ar) ? item.name_ar : item.name}</Text>
            </View>
            <View style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#D8D8D8', paddingHorizontal: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={require('../../../icon/icon-location.png')} style={{ tintColor: '#000', height: 20, width: 13 }} />
                    <Text style={{ paddingLeft: 12 }}>{(Identify.isRtl() && item.address_ar) ? item.address_ar : item.street}</Text>
                </View>
                <View style={[styles.rowCenter, { paddingTop: 15 }]}>
                    <Icon name='ios-call' size={15} style={{ color: '#000' }} />
                    <Text style={{ paddingLeft: 12 }}>{(Identify.isRtl() && item.telephone_ar) ? item.telephone_ar : item.telephone}</Text>
                </View>
            </View>
            <View style={{ paddingTop: 20, paddingHorizontal: 10, marginBottom: 33 }}>
                <Text style={[styles.nameDetail, { fontSize: 18, paddingLeft: 0, paddingBottom: 20, textAlign: 'left' }]}>{Identify.__('Our opening hours...')}</Text>
                {renderOpeningHours('Monday', item.schedule.monday_status, item.schedule.monday_open, item.schedule.monday_close)}
                {renderOpeningHours('Tuesday', item.schedule.tuesday_status, item.schedule.tuesday_open, item.schedule.tuesday_close)}
                {renderOpeningHours('Wednesday', item.schedule.wednesday_status, item.schedule.wednesday_open, item.schedule.wednesday_close)}
                {renderOpeningHours('Thursday', item.schedule.thursday_status, item.schedule.thursday_open, item.schedule.thursday_close)}
                {renderOpeningHours('Friday', item.schedule.friday_status, item.schedule.friday_open, item.schedule.friday_close)}
                {renderOpeningHours('Saturday', item.schedule.saturday_status, item.schedule.saturday_open, item.schedule.saturday_close)}
                {renderOpeningHours('Sunday', item.schedule.sunday_status, item.schedule.sunday_open, item.schedule.sunday_close)}
            </View>
        </View>
    )
}

export default StoreDetails