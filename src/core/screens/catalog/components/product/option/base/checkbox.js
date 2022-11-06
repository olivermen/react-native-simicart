import React from 'react';
import Abstract from "./Abstract";
import { View } from 'react-native';
import { CheckBox, ListItem, Body } from 'native-base';
import Identify from '../../../../../../helper/Identify';

class CheckboxField extends Abstract {
    constructor(props) {
        super(props);
        let checked = this.setDefaultSelected(this.props.value);
        this.state = {
            checked
        }
        this.selected = '';
    }

    getValues() {
        return this.selected;
    }

    onSelect() {
        this.setState((oldState) => {
            let checked = !oldState.checked;
            if (checked) {
                this.selected = this.props.value;
            } else {
                this.selected = '';
            }
            this.parent.updatePrices();
            return {
                checked: checked,
            };
        });
    }

    render = () => {
        return (
            <ListItem key={this.props.id} style={{ borderBottomWidth: 0 }} onPress={() => {
                this.onSelect();
            }}>
                <CheckBox checked={this.state.checked} style={{ width: 20, height: 20 }} onPress={() => {
                    this.onSelect();
                }} />
                <Body>
                    {this.props.label}
                </Body>
            </ListItem>
        );
    }
}
export default CheckboxField;
