import React from 'react';
import { Spinner, Text } from 'native-base';
import Identify from '@helper/Identify';
import { TouchableOpacity, View, Modal, ScrollView } from 'react-native';
import material from '@theme/variables/material';

export default class ButtonAddAddress extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            buttonEnabled: Object.keys(this.props.parent.state.address).length == 0 ? false : true
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

    updateButtonStatus(status) {
        if (status != this.state.buttonEnabled) {
            this.setState({ buttonEnabled: status });
        }
    }

    render() {
        return (
            <TouchableOpacity
                key={Identify.makeid()}
                style={{ flex: 1, height: 50, borderRadius: 8, backgroundColor: '#E4531A', alignItems: 'center', justifyContent: 'center', marginLeft: 10, opacity: this.state.buttonEnabled ? 1 : 0.5 }}
                onPress={() => {
                    if (this.state.buttonEnabled) {
                        this.props.parent.addNewAddress();
                    }
                }}>
                {!this.state.buttonLoading ? <Text
                    style={{ fontSize: 15, color: 'white', fontFamily: material.fontBold }}
                    numberOfLines={1}
                    ellipsizeMode='tail'>
                    {Identify.__('Save')}
                </Text> : <Spinner color="white" />}
            </TouchableOpacity>
        );
    }
}