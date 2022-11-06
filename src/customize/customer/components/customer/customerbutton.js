import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { View, Alert } from 'react-native';
import { Button, Text } from 'native-base';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';
import NavigationManager from '@helper/NavigationManager';

export default class CustomerButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            buttonEnabled: this.props.navigation.getParam('isEditProfile') ? true : false
        }
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }
    }

    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined)
        }
    }

    onClickButton() {
        this.props.parent.onCustomerAction();
    }

    updateButtonStatus(status) {
        if (status != this.state.buttonEnabled) {
            this.setState({ buttonEnabled: status });
        }
    }

    render() {
        let text = 'Register';
        if (this.props.navigation.getParam('isEditProfile')) {
            text = 'Save';
        }
        return (
            <View>
                <Button style={{ width: '100%', height: 50, borderRadius: 8, marginTop: 30 }}
                    full
                    onPress={() => {
                        if (this.state.buttonEnabled) {
                            this.onClickButton()
                        } else {
                            Alert.alert(
                                Identify.__('Warning'),
                                Identify.__('Please fill all required fields')
                            );
                        }
                    }}>
                    <Text style={{ fontSize: 16, fontFamily: material.fontBold }}>{Identify.__(text)}</Text>
                </Button>
                <View style={{ marginTop: 15, borderTopWidth: 1, borderTopColor: '#C5CBD5', flexDirection: 'row', paddingTop: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontFamily: material.fontBold }}>{Identify.__('Already have an account')}?</Text>
                    <Text
                        style={{ fontSize: 16, color: '#096BB3', marginLeft: 10 }}
                        onPress={() => NavigationManager.backToPreviousPage(this.props.navigation)}>
                        {Identify.__('Sign In')}
                    </Text>
                </View>
            </View>
        );
    }
}