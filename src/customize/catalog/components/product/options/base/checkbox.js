import React from 'react';
import { CheckBox, ListItem, Body, Icon } from 'native-base';
import Abstract from "./Abstract";

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
        if (!this.props.disabled) {
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
    }

    render = () => {
        return (
            <ListItem
                disabled={this.props.disabled}
                key={this.props.id} style={{ borderBottomWidth: 0 }} onPress={() => {
                    this.onSelect();
                }}>
                <Icon name={this.state.checked ? 'md-checkbox' : 'md-square-outline'}
                    style={{ color: '#EB774F' }}
                    onPress={() => {
                        this.onSelect();
                    }} />
                {/* <CheckBox checked={this.state.checked} style={{ width: 20, height: 20 }} onPress={() => {
                    this.onSelect();
                }} /> */}
                <Body style={{ color: 'green' }}>
                    {this.props.label}
                </Body>
            </ListItem>
        );
    }
}
export default CheckboxField;
