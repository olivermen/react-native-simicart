import React from 'react';
import { View } from 'react-native';
import { Text } from 'native-base';
import ListItems from '../quoteitem/list';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';
import Totals from '../totals';

const Summary = props => {

    if (!props.parent.list) {
        return null;
    }

    return (
        <View style={{ backgroundColor: '#FAFAFA', flex: 1, paddingVertical: 30, paddingHorizontal: 12, marginTop: 30, paddingBottom: 100 }}>
            <Text style={{ fontFamily: material.fontBold, textAlign: 'left', fontSize: 24 }}>{Identify.__('Summary')}</Text>
            <ListItems parent={props.parent} from="checkout" />
            <Totals
                parent={props.parent}
                from="checkout"
                screen='checkout'
                styleMargin={{ marginTop: 10 }}
                styleOneRowPrice={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }} />
        </View>
    );

}

export default Summary;