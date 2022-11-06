import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { TouchableOpacity } from 'react-native';
import { Card, CardItem, Icon, H3, Right, Text, View } from 'native-base';
import Identify from '@helper/Identify';
import material from '../../../../../../native-base-theme/variables/material';

const AddNewAddress = (props) => {

    function onClickAddNew() {
        props.parent.addNewAddress()
    }

    function renderMessage() {
        let message = 'Or choose address(es) to edit';
        if (props.parent.mode === 'checkout_select_address') {
            message = 'Or choose an address to continue';
        } else if (props.parent.mode.includes('edit')) {
            message = 'Or choose an address to edit';
        }
        return (
            <View style={{ paddingLeft: 27, paddingRight: 27, paddingTop: 10, paddingBottom: 10 }}>
                <Text style={{ fontSize: 16, textAlign: 'left' }}>{Identify.__(message)}</Text>
            </View>
        );
    }

    return (
        <View>
            <TouchableOpacity onPress={() => { onClickAddNew() }}>
                <Card style={{ marginLeft: 12, marginRight: 12, marginTop: 12, height: 50 }}>
                    <CardItem style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name={'add-circle'} />
                        <H3 style={{ fontFamily: material.fontBold, flex: 1, marginLeft: 10 }}>{Identify.__('Add an address')}</H3>
                        <Right>
                            <Icon name={Identify.isRtl() ? 'ios-arrow-back' : "ios-arrow-forward"} style={{ color: 'black' }} />
                        </Right>
                    </CardItem>
                </Card>
            </TouchableOpacity>
            {renderMessage()}
        </View>
    );
}

export default AddNewAddress;