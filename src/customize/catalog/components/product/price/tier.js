import React from 'react';
import { Text } from 'native-base';
import Identify from '@helper/Identify';

export default class TierPrice extends React.Component {
    render() {
        if (!this.props.tierPrice || this.props.tierPrice.length == 0) {
            return null;
        }

        let views = [];
        this.props.tierPrice.forEach(element => {
            views.push(
                <Text key={Identify.makeid()} style={{ fontSize: 12 }}>{element}</Text>
            );
        });
        return views;
    }
}