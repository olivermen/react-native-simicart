import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { Button, Text } from 'native-base';
import Identify from '../../../../helper/Identify';

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
            <Button style={{ position: 'absolute', bottom: 0, width: '100%', height: 56 }}
                full
                disabled={!this.state.buttonEnabled}
                onPress={() => { this.onClickButton() }}>
                <Text> {Identify.__(text)} </Text>
            </Button>
        );
    }
}