import React, { PureComponent } from 'react';
import Touchable from '../../../../community/react-native-search-list/utils/Touchable';
import { HighlightableText } from '../../../../community/react-native-search-list/index';
import Identify from "@helper/Identify";
import variable from "@theme/variables/material";
import { StyleSheet, View } from 'react-native';
import { Icon } from 'native-base';

const styles = StyleSheet.create({
    iconStyle: {
        position: 'absolute', right: 0, top: 5
    },
    iconStyleRtl: {
        position: 'absolute', left: 0, top: 5
    }
})

export default class AdvanceListItem extends PureComponent {

    render() {
        let item = this.props.item;
        return (
            <Touchable key={Identify.makeid()} onPress={() => { this.props.parent.handleSelected(item.type, item.key, item) }}>
                <View style={{ flex: 1, marginLeft: 20, marginRight: 20, height: 40, justifyContent: Identify.isRtl() ? 'flex-end' : 'flex-start', alignItems: 'center', flexDirection: Identify.isRtl() ? 'row-reverse' : 'row' }}>
                    <HighlightableText
                        style={{ flex: 1, textAlign: Identify.isRtl() ? 'left' : 'right', fontFamily: variable.fontBold }}
                        matcher={item.matcher}
                        text={Identify.__(item.searchStr)}
                        textColor={variable.textColor}
                        hightlightTextColor={'#0069c0'}
                    />
                    {item.selected == true ?
                        <Icon name="ios-checkmark" style={Identify.isRtl() ? styles.iconStyleRtl : styles.iconStyle} /> : null
                    }
                </View>
            </Touchable>
        );
    }

}