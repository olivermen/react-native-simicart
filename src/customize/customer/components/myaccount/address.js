import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';

export default class AddressBook extends React.Component {

    constructor(props) {
        super(props);
        this.custom_field_config = Identify.getMerchantConfig().storeview.custom_field_config;
    }

    navigateAddressPage = () => {
        NavigationManager.openPage(this.props.navigation, 'AddressBook');
    }

    handleEditAddress = (item) => {
        this.props.parent.onSelectAddress(item)
    }

    renderName = (addressItem) => {
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

    renderPhone = (addressItem) => {
        let telephone = '';
        if (addressItem.telephone !== undefined && addressItem.telephone !== null && addressItem.telephone !== '') {
            telephone = addressItem.telephone;
        }
        if (telephone !== '') {
            return <Text style={{ fontSize: 14 }}>{telephone}</Text>
        }
    }

    renderEmail = (addressItem) => {
        let email = '';
        if (addressItem.email !== undefined && addressItem.email !== null && addressItem.email !== '') {
            email = addressItem.email;
        }
        if (email !== '') {
            return <Text style={{ fontSize: 14, paddingBottom: 6 }}>{email}</Text>
        }
    }

    renderBlockBuildingNumber = (addressItem) => {
        let info = '';
        if (addressItem.house_building_number !== undefined && addressItem.house_building_number !== null && addressItem.house_building_number !== '') {
            info += addressItem.house_building_number;
        }
        if (addressItem.block_number !== undefined && addressItem.block_number !== null && addressItem.block_number !== '') {
            info += ', ' + addressItem.block_number;
        }
        if (addressItem.address_types !== undefined && addressItem.address_types !== null && addressItem.address_types !== '' && this.getFieldLabel('address_types', addressItem.address_types)) {
            info += ', ' + this.getFieldLabel('address_types', addressItem.address_types);
        }
        if (addressItem.area !== undefined && addressItem.area !== null && addressItem.area !== '' && this.getFieldLabel('area', addressItem.area)) {
            info += ', ' + this.getFieldLabel('area', addressItem.area);
        }
        if (info !== '') {
            return <Text style={{ fontSize: 14, paddingBottom: 6 }}>{info}</Text>
        }
    }

    getFieldLabel = (code, value) => {
        let label = null;
        try {
            this.custom_field_config.forEach(field => {
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

    Card = props => {
        return (
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{props.title}</Text>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => this.handleEditAddress(props.data)}>
                        <Text style={{ fontSize: 14, color: '#E4531A', paddingRight: 4, fontWeight: '500' }}>
                            {Identify.__('EDIT')}
                        </Text>
                        <Image source={require('./icon-edit.png')} style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.info}>
                    {this.renderName(props.data)}
                    {this.renderEmail(props.data)}
                    {this.renderBlockBuildingNumber(props.data)}
                    {this.renderPhone(props.data)}
                </View>
            </View>
        )
    }

    render() {
        const { address } = this.props.parent
        let defaultBilling = address && address.addresses && address.addresses.filter(address => address.is_default_billing === true)
        let defaultShipping = address && address.addresses && address.addresses.filter(address => address.is_default_shipping === true)

        // const { addresses } = this.props
        // let defaultBilling = addresses && addresses.filter(address => address.is_default_billing === true)
        // let defaultShipping = addresses && addresses.filter(address => address.is_default_shipping === true)

        return (
            <View style={{ marginBottom: 50 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                    <Text style={styles.title}>{Identify.__('Address Book')}</Text>
                    <TouchableOpacity onPress={this.navigateAddressPage}>
                        <Text style={styles.txtManage}>{Identify.__('Manage Addresses')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.line} />

                {defaultBilling && defaultBilling[0] ?
                    <this.Card
                        title={Identify.__('Default Billing Address')}
                        data={defaultBilling[0]}
                    /> : null
                }
                {defaultShipping && defaultShipping[0] ?
                    <this.Card
                        title={Identify.__('Default Shipping Address')}
                        data={defaultShipping[0]}
                    /> : null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: '600'
    },
    txtManage: {
        fontSize: 16,
        color: '#E4531A',
        textDecorationLine: 'underline',
        fontWeight: '600',
    },
    line: {
        height: 1,
        width: '100%',
        backgroundColor: '#D8D8D8',
        marginTop: 10,
        marginBottom: 20
    },
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
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'flex-start'
    },
})

