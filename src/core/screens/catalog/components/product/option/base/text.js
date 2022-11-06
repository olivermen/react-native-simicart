import React from 'react';
import Identify from "@helper/Identify";
import Abstract from './Abstract';
import { Input, Item, Textarea } from 'native-base';
import material from '@theme/variables/material';

class Text extends Abstract {

    constructor(props) {
        super(props);
        this.text = '';
        this.maxLength = this.props.maxLength ? parseInt(this.props.maxLength) : 255;
    }

    getValues() {
        return this.text;
    }

    renderTextField = () => {
        return (
            <Item regular style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
                <Input
                    placeholder={Identify.__('Enter text in here')}
                    onChangeText={(txt) => {
                        this.text = txt;
                        this.parent.updatePrices();
                    }}
                    style={{fontFamily: material.fontFamily}}
                    maxLength={this.maxLength} />
            </Item>
        )
    };

    renderTextArea = () => {
        return (
            <Textarea
                rowSpan={5}
                bordered placeholder={Identify.__('Enter text in here')}
                style={{ marginLeft: 10, marginRight: 10, marginTop: 10 , fontFamily: material.fontFamily }}
                onChangeText={(txt) => {
                    this.text = txt;
                    this.parent.updatePrices();
                }}
            />
        )
    };

    render() {
        if (this.props.type === 'area') {
            return this.renderTextArea();
        }
        return this.renderTextField();
    }
}
export default Text;
