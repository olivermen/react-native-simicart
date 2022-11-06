import React from 'react';
import { Button, Text } from 'native-base';
import Identify from '@helper/Identify';

export default class CreditCardSubmit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            buttonEnabled: Identify.getCreditCardData() ? true : false
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
            <Button style={{ position: 'absolute', bottom: 0, width: '100%', height: 56 }}
                full
                disabled={!this.state.buttonEnabled}
                onPress={() => { this.props.parent.onClickButton() }}>
                <Text> {Identify.__('Save')} </Text>
            </Button>
        );
    }
}