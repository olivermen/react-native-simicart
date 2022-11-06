import React from 'react';
import { TouchableOpacity, Alert, View, StyleSheet, Image, Text } from 'react-native';
import Identify from '@helper/Identify';

const AddressItem = (props) => {

    const addressItem = props.address;

    const custom_field_config = Identify.getMerchantConfig().storeview.custom_field_config;

    function showDeleteItemPopup(data) {
        Alert.alert(
            Identify.__('Warning'),
            Identify.__('Are you sure you want to delete this item?'),
            [
                { text: Identify.__('Cancel'), onPress: () => { style: 'cancel' } },
                {
                    text: Identify.__('OK'), onPress: () => {
                        props.parent.deleteAddress(addressItem.entity_id);
                    }
                },
            ],
            { cancelable: true }
        );
    }

    function renderName() {
        let name = '';
        if (addressItem.prefix !== undefined && addressItem.prefix !== null && addressItem.prefix !== '') {
            name += addressItem.prefix + ' ';
        }

        if (addressItem.firstname !== undefined && addressItem.firstname !== null && addressItem.firstname !== '') {
            name += addressItem.firstname + ' ';
        }

        if (addressItem.lastname !== undefined && addressItem.lastname !== null && addressItem.lastname !== '') {
            name += addressItem.lastname + ' ';
        }

        if (addressItem.suffix !== undefined && addressItem.suffix !== null && addressItem.suffix !== '') {
            name += addressItem.suffix;
        }

        if (name !== '') {
            return <Text style={{ fontSize: 14, paddingBottom: 6 }}>{name}</Text>
        }
    }

    function renderPhone() {
        let telephone = '';
        if (addressItem.telephone !== undefined && addressItem.telephone !== null && addressItem.telephone !== '') {
            telephone = addressItem.telephone;
        }
        if (telephone !== '') {
            return <Text style={{ fontSize: 14 }}>{telephone}</Text>
        }
    }

    function renderEmail() {
        let email = '';
        if (addressItem.email !== undefined && addressItem.email !== null && addressItem.email !== '') {
            email = addressItem.email;
        }
        if (email !== '') {
            return <Text style={{ fontSize: 14, paddingBottom: 6 }}>{email}</Text>
        }
    }

    function renderBlockBuildingNumber() {
        let info = '';
        if (addressItem.house_building_number !== undefined && addressItem.house_building_number !== null && addressItem.house_building_number !== '') {
            info += addressItem.house_building_number;
        }
        if (addressItem.block_number !== undefined && addressItem.block_number !== null && addressItem.block_number !== '') {
            info += ', ' + addressItem.block_number;
        }
        if (addressItem.address_types !== undefined && addressItem.address_types !== null && addressItem.address_types !== '' && getFieldLabel('address_types', addressItem.address_types)) {
            info += ', ' + getFieldLabel('address_types', addressItem.address_types);
        }
        if (addressItem.area !== undefined && addressItem.area !== null && addressItem.area !== '' && getFieldLabel('area', addressItem.area)) {
            info += ', ' + getFieldLabel('area', addressItem.area);
        }
        if (info !== '') {
            return <Text style={{ fontSize: 14, paddingBottom: 6 }}>{info}</Text>
        }
    }

    function getFieldLabel(code, value) {
        let label = null;
        try {
            custom_field_config.forEach(field => {
                if (field.code == code) {
                    const options = field.options;
                    options.forEach(element => {
                        if (element.value == value) {
                            label = element.label;
                        }
                    });
                }
            });
        } catch (err) {
            return label;
        }
        return label;
    }

    function onChooseAddress() {
        props.parent.onSelectAddress(addressItem);
    }

    return (
        <TouchableOpacity style={styles.card} onPress={() => { onChooseAddress() }}>
            <View style={{ flexDirection: 'column', width: '80%', alignItems: 'flex-start' }}>
                {renderName()}
                {renderEmail()}
                {renderBlockBuildingNumber()}
                {renderPhone()}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { onChooseAddress() }}>
                    <Text style={{ fontSize: 14, color: '#E4531A', paddingRight: 4, fontWeight: '500' }}>
                        {Identify.__('EDIT')}
                    </Text>
                    <Image source={require('../myaccount/icon-edit.png')} style={{ width: 20, height: 21 }} />
                </TouchableOpacity>
                {!props.parent.mode.includes('checkout') &&
                    <TouchableOpacity onPress={() => { showDeleteItemPopup() }}>
                        <Image source={require('../../../icon/icon-remove.png')} style={{ width: 19, height: 20, marginTop: 16 }} />
                    </TouchableOpacity>}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: '#D8D8D8',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 16,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 16
    }
})

export default AddressItem;
