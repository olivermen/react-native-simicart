import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';

export default class ProfileButton extends React.Component {

    constructor(props) {
        super(props);
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

    onClickButton = () => {
        this.props.parent.onProfileAction();
    }

    updateButtonStatus(status) {
        // if (status != this.state.buttonEnabled) {
        //     this.setState({ buttonEnabled: status });
        // }
    }

    render() {
        return (
            <View>
                <Button style={{ width: '40%', height: 50, borderRadius: 8, marginTop: 30 }}
                    full
                    onPress={this.onClickButton}>
                    <Text style={{ fontSize: 16, fontFamily: material.fontBold }}>{Identify.__('Save')}</Text>
                </Button>
            </View>
        );
    }
}