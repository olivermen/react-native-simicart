import React from 'react';
import SimiComponent from '../SimiComponent';
import { Card, CardItem, Icon, Text, Right, Thumbnail } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Identify from '@helper/Identify';

const BaseMenuItem = (props) => {
    if (props.hasOwnProperty('add_condition') && props.add_condition() == false) {
        return null;
    }
    return (
        <TouchableOpacity style={{ flex: 1 }}
            onPress={() => {
                if (!props.parent.onSelectMenuItem(props.keyItem)) {
                    props.onClick();
                }
            }}>
            <Card style={{ shadowOpacity: 0 }}>
                <CardItem style={{ flex: 1, paddingRight: 0, alignItems: 'center' }}>
                    {props.iconName && <Icon name={props.iconName} />}
                    {props.hasOwnProperty('image') && <Thumbnail
                        square
                        source={this.props.image}
                        style={{ width: 25, height: 25 }} />}
                    <Text style={{ flex: 1, textAlign: 'left', marginLeft: 10, marginRight: 10 }}>{Identify.__(props.label)}</Text>
                    <Right>
                        {props.extendable && <Icon style={{ marginRight: 10 }} name={Identify.isRtl() ? 'ios-arrow-back' : "ios-arrow-forward"} />}
                    </Right>

                </CardItem>
            </Card>
        </TouchableOpacity>
    );
}

export default BaseMenuItem;