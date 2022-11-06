import React, { useState } from 'react';
import { FlatList, View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import AddressItem from './item';
import Title from './title';
import Identify from '@helper/Identify';

const AddressList = (props) => {
    const [defaultBilling, setDefaultBilling] = useState(props.addresses.filter(address => address.is_default_billing === true))
    const [defaultShipping, setDefaultShipping] = useState(props.addresses.filter(address => address.is_default_shipping === true))
    const [addresses, setAddresses] = useState(props.addresses.filter(address => address.is_default_billing === false && address.is_default_shipping === false))
    const custom_field_config = Identify.getMerchantConfig().storeview.custom_field_config;

    function renderName(addressItem) {
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

    function renderPhone(addressItem) {
        let telephone = '';
        if (addressItem.telephone !== undefined && addressItem.telephone !== null && addressItem.telephone !== '') {
            telephone = addressItem.telephone;
        }
        if (telephone !== '') {
            return <Text style={{ fontSize: 14 }}>{telephone}</Text>
        }
    }

    function renderEmail(addressItem) {
        let email = '';
        if (addressItem.email !== undefined && addressItem.email !== null && addressItem.email !== '') {
            email = addressItem.email;
        }
        if (email !== '') {
            return <Text style={{ fontSize: 14, paddingBottom: 6 }}>{email}</Text>
        }
    }

    function renderBlockBuildingNumber(addressItem) {
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

    const Card = props => {
        return (
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{props.title}</Text>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => onChooseAddress(props.data)}>
                        <Text style={{ fontSize: 14, color: '#E4531A', paddingRight: 4, fontWeight: '500' }}>
                            {Identify.__('EDIT')}
                        </Text>
                        <Image source={require('../myaccount/icon-edit.png')} style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.info}>
                    {renderName(props.data)}
                    {renderEmail(props.data)}
                    {renderBlockBuildingNumber(props.data)}
                    {renderPhone(props.data)}
                </View>
            </View>
        )
    }

    const onChooseAddress = (item) => {
        props.parent.onSelectAddress(item);
    }

    function createListProps() {
        let data = props.addresses.filter(address => address.is_default_billing === false && address.is_default_shipping === false)

        return {
            style: { marginBottom: 14, marginTop: -14 },
            data,
            extraData: props.parent.props.data
        };
    }

    function renderItem(item) {
        return (
            <AddressItem address={item} parent={props.parent} />
        );
    }

    return (
        props.addresses.length ?
            <View style={{ paddingTop: 30, paddingHorizontal: 12 }}>
                {defaultBilling.length || defaultShipping.length ? <Title subTitle='Default Addresses' /> : null}
                {defaultBilling.length ?
                    <Card
                        title={Identify.__('Default Billing Address')}
                        data={defaultBilling[0]}
                        screen={props.parent.screen}
                    />
                    : null}
                {defaultShipping.length ?
                    <Card
                        title={Identify.__('Default Shipping Address')}
                        data={defaultShipping[0]}
                        screen={props.parent.screen}
                    />
                    : null}
                {addresses.length ?
                    <>
                        <Text style={styles.subTitle}>{Identify.__('Additional Address Entries')}</Text>
                        <FlatList
                            {...createListProps()}
                            keyExtractor={(item) => item.entity_id}
                            renderItem={({ item }) => renderItem(item)}
                        />
                    </> : null}
            </View> : null
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#D8D8D8',
        marginBottom: 15
    },
    header: {
        height: 55,
        paddingHorizontal: 20,
        backgroundColor: '#FAFAFA',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#D8D8D8'
    },
    icon: {
        width: 20,
        height: 21
    },
    info: {
        paddingTop: 10,
        paddingBottom: 16,
        paddingHorizontal: 20,
        alignItems: 'flex-start'
    },
    subTitle: {
        fontSize: 16,
        paddingTop: 20,
        paddingBottom: 30,
        alignSelf: 'flex-start'
    }
})

export default AddressList;