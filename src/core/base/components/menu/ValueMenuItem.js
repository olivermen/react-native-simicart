import React from 'react';
import SimiComponent from "../../../base/components/SimiComponent";
import { Icon, Text, Card, CardItem, Right } from "native-base";
import { StyleSheet, TouchableOpacity } from 'react-native';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';

class SettingItem extends SimiComponent {
    constructor(props) {
        super(props)
        this.parent = this.props.parent;
    }
    render() {
        if (this.props.hasOwnProperty('add_condition') && this.props.add_condition() == false) {
            return null;
        }
        return (
            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.parent.itemAction(this.props.keyItem, this.props.ItemToShow)}>
                <Card style={{ shadowOpacity: 0 }}>
                    <CardItem icon style={{ flex: 1, paddingRight: 0, alignItems: 'center' }}>
                        <Icon active name={this.props.itemIcon} />
                        <Text style={{ flex: 1, textAlign: 'left', marginLeft: 10, marginRight: 10 }}>{Identify.__(this.props.ItemToShow)}</Text>
                        <Text style={{ marginRight: 10, color: material.textColor, textAlign: 'right' }}>{Identify.__(this.parent.getDataToShow(this.props.ItemName, this.props.hasDataInParent))}</Text>
                        <Right>
                            <Icon active style={{ marginRight: 10, color: material.textColor }} name={Identify.isRtl() ? 'ios-arrow-back' : "ios-arrow-forward"} />
                        </Right>
                    </CardItem>
                </Card>
            </TouchableOpacity>
        )
    }
}
export default SettingItem;