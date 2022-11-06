import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { TouchableOpacity, Alert } from 'react-native';
import { Card, CardItem, Text, Button, Icon } from 'native-base';
import Identify from '@helper/Identify';

const AddressItem = (props) => {

    const addressItem = props.address;

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
            return <Text>{name}</Text>
        }
    }

    function renderCompany() {
        let company = '';
        if (addressItem.company !== undefined && addressItem.company !== null && addressItem.company !== '') {
            company = addressItem.company
        }
        if (company !== '') {
            return <Text>{company}</Text>
        }
    }

    function renderStreet() {
        let street = '';
        if (addressItem.street !== undefined && addressItem.street !== null && addressItem.street !== '') {
            street = addressItem.street
        }
        if (street !== '') {
            return <Text>{street}</Text>
        }
    }

    function renderCityStatePostCode() {
        let info = '';
        if (addressItem.city !== undefined && addressItem.city !== null && addressItem.city !== '') {
            info += addressItem.city + ', ';
        }
        if (addressItem.region !== undefined && addressItem.region !== null && addressItem.region !== '') {
            info += addressItem.region + ', ';
        }
        if (addressItem.postcode !== undefined && addressItem.postcode !== null && addressItem.postcode !== '') {
            info += addressItem.postcode;
        }
        if (info !== '') {
            return <Text>{info}</Text>
        }
    }

    function renderCountry() {
        let country = '';
        if (addressItem.country_name !== undefined && addressItem.country_name !== null && addressItem.country_name !== '') {
            country = addressItem.country_name;
        }
        if (country !== '') {
            return <Text>{country}</Text>
        }
    }

    function renderPhone() {
        let telephone = '';
        if (addressItem.telephone !== undefined && addressItem.telephone !== null && addressItem.telephone !== '') {
            telephone = addressItem.telephone;
        }
        if (telephone !== '') {
            return <Text>{telephone}</Text>
        }
    }

    function renderEmail() {
        let email = '';
        if (addressItem.email !== undefined && addressItem.email !== null && addressItem.email !== '') {
            email = addressItem.email;
        }
        if (email !== '') {
            return <Text>{email}</Text>
        }
    }

    function onChooseAddress() {
        props.parent.onSelectAddress(addressItem);
    }

    return (
        <TouchableOpacity onPress={() => { onChooseAddress() }}>
            <Card>
                <CardItem style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    {renderName()}
                    {renderCompany()}
                    {renderStreet()}
                    {renderCityStatePostCode()}
                    {renderCountry()}
                    {renderPhone()}
                    {renderEmail()}
                </CardItem>
                {!props.parent.mode.includes('checkout') && <Button style={{ position: 'absolute', top: 0, right: 0 }} transparent
                    onPress={() => { showDeleteItemPopup() }}>
                    <Icon name="ios-trash" />
                </Button>}
            </Card>
        </TouchableOpacity>
    );
}

export default AddressItem;
