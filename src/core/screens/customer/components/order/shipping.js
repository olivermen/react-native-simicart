import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { Card, CardItem, Text, H3 } from 'native-base';
import Identify from '@helper/Identify';
import styles from './detailStyles';
import material from '@theme/variables/material';


const OrderShipping = (props) => {

    function renderName(item) {
        let name = '';
        if (item.prefix !== undefined && item.prefix !== null && item.prefix !== '') {
            name += item.prefix + ' ';
        }

        if (item.firstname !== undefined && item.firstname !== null && item.firstname !== '') {
            name += item.firstname + ' ';
        }

        if (item.lastname !== undefined && item.lastname !== null && item.lastname !== '') {
            name += item.lastname + ' ';
        }

        if (item.suffix !== undefined && item.suffix !== null && item.suffix !== '') {
            name += item.suffix;
        }
        return name;
    }

    function renderCompany(item) {
        let company = '';
        if (item.company !== undefined && item.company !== null && item.company !== '') {
            company = item.company
        }
        return company;
    }

    function renderStreet(item) {
        let street = '';
        if (item.street !== undefined && item.street !== null && item.street !== '') {
            street = item.street
        }
        return street;
    }

    function renderCityStatePostCode(item) {
        let info = '';
        if (item.city !== undefined && item.city !== null && item.city !== '') {
            info += item.city + ', ';
        }
        if (item.region !== undefined && item.region !== null && item.region !== '') {
            info += item.region + ', ';
        }
        if (item.postcode !== undefined && item.postcode !== null && item.postcode !== '') {
            info += item.postcode;
        }
        return info;
    }

    function renderCountry(item) {
        let country = '';
        if (item.country_name !== undefined && item.country_name !== null && item.country_name !== '') {
            country = item.country_name;
        }
        return country;
    }

    function renderPhone(item) {
        let telephone = '';
        if (item.telephone !== undefined && item.telephone !== null && item.telephone !== '') {
            telephone = item.telephone;
        }
        return telephone;
    }

    function renderEmail(item) {
        let email = '';
        if (item.email !== undefined && item.email !== null && item.email !== '') {
            email = item.email;
        }
        return email;
    }

    let address = props.order.shipping_address;
    return (
        <Card style={{ flex: 1 }} key={'shipping'}>
            <H3 style={{ width: '100%', backgroundColor: '#EDEDED', paddingLeft: 15, paddingRight: 10, paddingTop: 10, paddingBottom: 10, textAlign: 'left' }}>{Identify.__('Ship To').toUpperCase()}</H3>
            <CardItem style={styles.address}>
                <Text>{renderName(address)}</Text>
                <Text>{renderCompany(address)}</Text>
                <Text>{renderStreet(address)}</Text>
                <Text>{renderCityStatePostCode(address)}</Text>
                <Text>{renderCountry(address)}</Text>
                <Text>{renderPhone(address)}</Text>
                <Text>{renderEmail(address)}</Text>
            </CardItem>
            <CardItem>
                <Text style={[styles.title, { fontFamily: material.fontBold }]}>{Identify.__(props.order.shipping_method)}</Text>
            </CardItem>
        </Card>
    );
}

export default OrderShipping;