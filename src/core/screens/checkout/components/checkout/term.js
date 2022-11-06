import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { CheckBox, Text, Icon } from 'native-base';
import { TouchableOpacity, View } from 'react-native';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';

export default class TermCondition extends SimiComponent {

    constructor(props) {
        super(props);
        let data = Identify.getMerchantConfig().storeview.checkout.checkout_terms_and_conditions;
        if (!Identify.isEmpty(data)) {
            this.title = data.title;
            this.content = data.content;
        }
        this.state = {
            acceptedTerm: false
        }
    }

    acceptTerm() {
        this.props.parent.acceptTerm = !this.props.parent.acceptTerm;
        this.setState(previousState => ({ acceptedTerm: !previousState.acceptedTerm }));
    }

    renderPhoneLayout() {
        if (!this.title && !this.content) {
            this.props.parent.acceptTerm = true;
            return null;
        }
        return (
            <View style={{ padding: 10, borderTopWidth: 0.5, borderTopColor: '#EDEDED' }}>
                <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} onPress={() => {
                    NavigationManager.openPage(this.props.navigation, 'WebViewPage', {
                        html: this.content,
                    });
                }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, marginRight: 40 }}>{Identify.__('Term and conditions')}</Text>
                    <Icon name={Identify.isRtl() ? 'ios-arrow-back' : "ios-arrow-forward"} style={{ position: 'absolute', right: 0, fontSize: 20 }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 10 }}
                    onPress={() => this.acceptTerm()}>
                    <Icon name={this.state.acceptedTerm ? "ios-checkmark-circle" : "ios-radio-button-off"}
                        style={{ fontSize: 25, left: 0 }}
                    />
                    <Text style={{ marginLeft: 10 }}>{Identify.__(this.title)}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
